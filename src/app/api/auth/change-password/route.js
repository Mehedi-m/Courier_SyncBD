import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in first.' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email.toLowerCase().trim() });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User account not found.' },
        { status: 404 }
      );
    }

    // If user has an existing password, verify current password
    if (user.password) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, error: 'Please enter your current password.' },
          { status: 400 }
        );
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, error: 'Current password does not match.' },
          { status: 400 }
        );
      }
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password has been updated successfully.',
    });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update password.' },
      { status: 500 }
    );
  }
}
