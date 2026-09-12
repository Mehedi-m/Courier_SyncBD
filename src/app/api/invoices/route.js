import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Invoice from '@/models/Invoice';

// GET: Fetch all invoices
export async function GET() {
  try {
    await connectDB();
    const invoices = await Invoice.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: invoices });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create new invoice
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    if (!body.name || !body.email) {
      return NextResponse.json({ success: false, error: 'Name and email are required' }, { status: 400 });
    }

    if (!body.invoiceId) {
      body.invoiceId = `#${Math.floor(100000 + Math.random() * 900000)}`;
    }

    const invoice = await Invoice.create(body);
    return NextResponse.json({ success: true, data: invoice }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE: Delete invoice(s)
export async function DELETE(request) {
  try {
    await connectDB();
    const { ids } = await request.json();
    if (Array.isArray(ids) && ids.length > 0) {
      await Invoice.deleteMany({ invoiceId: { $in: ids } });
    }
    return NextResponse.json({ success: true, message: 'Invoices deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}