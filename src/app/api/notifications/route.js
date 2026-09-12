import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';

export async function GET() {
  try {
    await connectDB();
    const notifications = await Notification.find({}).sort({ createdAt: -1 }).limit(50);
    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    await connectDB();
    const { id, markAll } = await request.json();

    if (markAll) {
      await Notification.updateMany({ isRead: false }, { isRead: true });
      return NextResponse.json({ success: true, message: 'All notifications marked as read' });
    }

    if (id) {
      await Notification.findByIdAndUpdate(id, { isRead: true });
      return NextResponse.json({ success: true, message: 'Notification marked as read' });
    }

    return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const { id } = await request.json();
    if (id) {
      await Notification.findByIdAndDelete(id);
    }
    return NextResponse.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
