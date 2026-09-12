import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { parseChatOrder } from '@/lib/orderParser';


export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    let newOrderData;

    if (body.rawChatText) {
      newOrderData = parseChatOrder(body.rawChatText);
    } else {
      newOrderData = body;
    }

    const order = await Order.create(newOrderData);
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}