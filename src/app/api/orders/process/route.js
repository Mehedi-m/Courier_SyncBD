import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Invoice from '@/models/Invoice';
import Notification from '@/models/Notification';
import { sendCustomerInvoiceEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const { orderId, sendEmail = true, status = 'Booked' } = await request.json();

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'orderId is required' }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Assign tracking code if missing
    if (!order.courierTrackingCode) {
      order.courierTrackingCode = `SF-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    order.status = status;
    order.updatedAt = new Date();

    // Check if invoice already exists for this order
    let invoice = await Invoice.findOne({ orderId: order._id });

    if (!invoice) {
      const invoiceId = `#INV-${Math.floor(100000 + Math.random() * 900000)}`;
      invoice = await Invoice.create({
        invoiceId,
        orderId: order._id,
        name: order.customerName,
        email: order.customerEmail || `${order.customerPhone}@customer.order.bd`,
        phone: order.customerPhone,
        deliveryAddress: order.deliveryAddress,
        items: order.items || 'Online Parcel (COD)',
        trackingCode: order.courierTrackingCode,
        courierName: order.courierName || 'Steadfast',
        amount: order.codAmount,
        status: order.status === 'Delivered' ? 'Complete' : 'Pending',
        emailedToCustomer: false,
      });

      order.invoiceId = invoice.invoiceId;
    } else {
      invoice.status = order.status === 'Delivered' ? 'Complete' : invoice.status;
      invoice.trackingCode = order.courierTrackingCode;
      await invoice.save();
    }

    let emailResult = null;
    const targetEmail = order.customerEmail || (order.customerPhone ? `${order.customerPhone}@order.bd` : null);

    if (sendEmail && targetEmail) {
      emailResult = await sendCustomerInvoiceEmail({
        customerEmail: targetEmail,
        customerName: order.customerName,
        order,
        invoice,
      });

      if (emailResult.success) {
        order.invoiceSent = true;
        order.invoiceSentAt = new Date();
        invoice.emailedToCustomer = true;
        await invoice.save();
      }
    }

    await order.save();

    // Log merchant notification
    await Notification.create({
      title: `Parcel ${order.status}: ${order.courierTrackingCode}`,
      message: `Invoice ${invoice.invoiceId} generated for ${order.customerName} (COD: ৳${order.codAmount}). ${order.invoiceSent ? 'Invoice emailed to customer.' : ''}`,
      category: 'Orders',
      type: 'order',
      link: '/dashboard',
    });

    return NextResponse.json({
      success: true,
      message: `Order marked as ${order.status} and invoice created.`,
      order,
      invoice,
      emailResult,
    });
  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
