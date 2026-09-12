import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'merchant@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password');
        }

        await connectDB();
        const user = await User.findOne({ email: credentials.email.toLowerCase().trim() });

        if (!user) {
          throw new Error('No user found with this email address');
        }

        if (!user.password) {
          throw new Error('This account was registered with Google. Please use Google Sign In.');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Incorrect password. Please try again.');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image || null,
          role: user.role || 'Merchant',
          storeName: user.storeName || 'My Shop',
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID?.trim() || 'GOOGLE_CLIENT_ID_PLACEHOLDER',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET?.trim() || 'GOOGLE_CLIENT_SECRET_PLACEHOLDER',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          await connectDB();
          const existingUser = await User.findOne({ email: user.email.toLowerCase().trim() });
          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email.toLowerCase().trim(),
              image: user.image,
              role: 'Merchant',
              storeName: `${user.name}'s Shop`,
            });
          } else if (!existingUser.image && user.image) {
            existingUser.image = user.image;
            await existingUser.save();
          }
          return true;
        } catch (error) {
          console.error('Error in Google signIn callback:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'Merchant';
        token.storeName = user.storeName || 'My Shop';
      }
      if (trigger === 'update' && session) {
        if (session.name) token.name = session.name;
        if (session.storeName) token.storeName = session.storeName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role || 'Merchant';
        session.user.storeName = token.storeName || 'My Shop';
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET?.trim() || 'fcommerce_secret_key_development_only_12345',
};
