import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Invoice from '@/models/Invoice';
import Notification from '@/models/Notification';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await connectDB();

    const sampleOrders = [
      {
        customerName: 'Rahim Uddin',
        customerPhone: '01712345678',
        customerEmail: 'rahim.uddin88@gmail.com',
        deliveryAddress: 'House 12, Road 5, Block C, Mirpur 10, Dhaka',
        district: 'Dhaka',
        items: 'Premium Linen Panjabi (Navy Blue, L)',
        codAmount: 1850,
        courierName: 'Steadfast',
        courierTrackingCode: 'SF-884920',
        status: 'Delivered',
        invoiceSent: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        customerName: 'Nusrat Jahan',
        customerPhone: '01898765432',
        customerEmail: 'nusrat.ctg@yahoo.com',
        deliveryAddress: 'Flat 4B, Green Tower, Agrabad, Chittagong',
        district: 'Chittagong',
        items: 'Wireless ANC Earbuds v2.0',
        codAmount: 2400,
        courierName: 'Pathao',
        courierTrackingCode: 'PTH-102938',
        status: 'Booked',
        invoiceSent: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        customerName: 'Tanvir Hasan',
        customerPhone: '01555667788',
        customerEmail: 'tanvir.hasan@gmail.com',
        deliveryAddress: 'House 34, Sector 7, Uttara, Dhaka',
        district: 'Dhaka',
        items: 'Genuine Leather Bi-Fold Wallet',
        codAmount: 950,
        courierName: 'Steadfast',
        courierTrackingCode: 'SF-449120',
        status: 'Delivered',
        invoiceSent: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        customerName: 'Sadia Islam',
        customerPhone: '01911223344',
        customerEmail: 'sadia.islam@outlook.com',
        deliveryAddress: 'Holding 88, Zindabazar, Sylhet',
        district: 'Sylhet',
        items: 'Hydrating Glow Facial Serum (50ml)',
        codAmount: 1450,
        courierName: 'Steadfast',
        courierTrackingCode: 'SF-782194',
        status: 'Booked',
        invoiceSent: true,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        customerName: 'Kazi Farhan',
        customerPhone: '01677889900',
        customerEmail: 'kazi.farhan@gmail.com',
        deliveryAddress: 'Road 11, Block D, Banani, Dhaka',
        district: 'Dhaka',
        items: 'Oxford Formal Cotton Shirt (White, XL)',
        codAmount: 1650,
        courierName: 'Steadfast',
        courierTrackingCode: null,
        status: 'Pending',
        invoiceSent: false,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        customerName: 'Mehnaz Chowdhury',
        customerPhone: '01733445566',
        customerEmail: 'mehnaz.c@gmail.com',
        deliveryAddress: '24/A GEC Circle, Nasirabad, Chittagong',
        district: 'Chittagong',
        items: 'Handmade Silk Scarf & Brooch Set',
        codAmount: 2100,
        courierName: 'Pathao',
        courierTrackingCode: null,
        status: 'Pending',
        invoiceSent: false,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
      {
        customerName: 'Mahmudur Rahman',
        customerPhone: '01812998877',
        customerEmail: 'mahmud.rajshahi@gmail.com',
        deliveryAddress: 'House 45, Lane 2, Udayan Housing, Rajshahi',
        district: 'Rajshahi',
        items: 'Smart Fitness Tracker Band',
        codAmount: 1200,
        courierName: 'Steadfast',
        courierTrackingCode: 'SF-673412',
        status: 'Delivered',
        invoiceSent: true,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        customerName: 'Afsana Mimi',
        customerPhone: '01999887766',
        customerEmail: 'mimi.afsana@yahoo.com',
        deliveryAddress: 'College Road, Kandirpar, Comilla',
        district: 'Comilla',
        items: 'Vintage Shoulder Handbag',
        codAmount: 2850,
        courierName: 'Steadfast',
        courierTrackingCode: 'SF-918234',
        status: 'Booked',
        invoiceSent: true,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
      {
        customerName: 'Zahidul Islam',
        customerPhone: '01777112233',
        customerEmail: 'zahid.dhanmondi@gmail.com',
        deliveryAddress: 'Road 27 (Old), Dhanmondi, Dhaka',
        district: 'Dhaka',
        items: 'Mechanical Gaming Keyboard RGB',
        codAmount: 3400,
        courierName: 'Steadfast',
        courierTrackingCode: 'SF-104928',
        status: 'Delivered',
        invoiceSent: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    ];

    // Clear and insert orders
    await Order.deleteMany({});
    const createdOrders = await Order.insertMany(sampleOrders);

    // Create corresponding Invoices
    await Invoice.deleteMany({});
    const invoices = createdOrders.map((order, idx) => ({
      invoiceId: `#INV-${108200 + idx}`,
      orderId: order._id,
      name: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone,
      deliveryAddress: order.deliveryAddress,
      items: order.items,
      trackingCode: order.courierTrackingCode || 'Pending Assignment',
      courierName: order.courierName,
      date: new Date(order.createdAt).toISOString().split('T')[0],
      amount: order.codAmount,
      status: order.status === 'Delivered' ? 'Complete' : 'Pending',
      starred: idx % 3 === 0,
      emailedToCustomer: order.invoiceSent,
    }));
    await Invoice.insertMany(invoices);

    // Update order invoiceIds
    for (let i = 0; i < createdOrders.length; i++) {
      createdOrders[i].invoiceId = invoices[i].invoiceId;
      await createdOrders[i].save();
    }

    // Seed sample Notifications
    await Notification.deleteMany({});
    const sampleNotifications = [
      {
        title: 'New Order Received',
        message: 'Order received from Mehnaz Chowdhury (Chittagong) for ৳2,100 COD.',
        category: 'Orders',
        type: 'order',
        isRead: false,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
      {
        title: 'Invoice Sent to Customer',
        message: 'Invoice #INV-108203 automatically sent to sadia.islam@outlook.com.',
        category: 'Invoices',
        type: 'payment',
        isRead: false,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        title: 'Steadfast Parcel Picked Up',
        message: 'Consignment SF-884920 picked up by Steadfast rider. In transit to Mirpur, Dhaka.',
        category: 'Orders',
        type: 'dispatch',
        isRead: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        title: 'COD Payment Reconciled',
        message: '৳3,400 COD payment settled from Dhanmondi delivered order #SF-104928.',
        category: 'Orders',
        type: 'payment',
        isRead: true,
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      },
    ];
    await Notification.insertMany(sampleNotifications);

    return NextResponse.json({
      success: true,
      message: 'MongoDB database successfully seeded with realistic Bangladeshi F-Commerce orders, invoices, and notifications!',
      orderCount: createdOrders.length,
      invoiceCount: invoices.length,
    });
  } catch (error) {
    console.error('Database seeding error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
