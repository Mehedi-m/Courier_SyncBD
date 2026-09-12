import connectDB from './mongodb';

export async function connectToDatabase() {
  return await connectDB();
}

export default connectDB;
