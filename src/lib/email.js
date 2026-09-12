import nodemailer from 'nodemailer';

/**
 * Send an automated branded invoice email to the customer
 */
export async function sendCustomerInvoiceEmail({
  customerEmail,
  customerName,
  order,
  invoice,
  storeName = 'CourierSync BD Merchant',
}) {
  if (!customerEmail) {
    console.warn('sendCustomerInvoiceEmail: No customer email provided for order:', order?._id);
    return { success: false, reason: 'No customer email' };
  }

  const invoiceNumber = invoice?.invoiceId || `#INV-${Math.floor(100000 + Math.random() * 900000)}`;
  const codAmount = order?.codAmount || invoice?.amount || 0;
  const trackingCode = order?.courierTrackingCode || 'Assigned on Rider Pickup';
  const courierName = order?.courierName || 'Steadfast Courier';
  const deliveryAddress = order?.deliveryAddress || 'Customer Address';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; padding: 32px 24px; text-align: center; }
          .header h1 { margin: 0 0 6px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
          .header p { margin: 0; opacity: 0.9; font-size: 13px; }
          .content { padding: 28px 24px; }
          .badge { display: inline-block; background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; margin-bottom: 16px; }
          .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
          .info-table th { text-align: left; padding: 10px 12px; background: #f1f5f9; color: #475569; font-weight: 600; border-radius: 6px; }
          .info-table td { padding: 12px; border-bottom: 1px solid #f1f5f9; }
          .amount-box { background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0; }
          .amount-value { font-size: 28px; font-weight: 900; color: #4f46e5; margin-top: 4px; }
          .tracking-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px; margin-bottom: 24px; text-align: center; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚡ ${storeName}</h1>
            <p>Official Order Confirmation & Delivery Invoice</p>
          </div>
          <div class="content">
            <span class="badge">Order Dispatched & In Transit</span>
            <p>Dear <strong>${customerName}</strong>,</p>
            <p>Thank you for shopping with us! Your order has been processed and handed over to our courier partner for fast delivery.</p>
            
            <div class="tracking-box">
              <div style="font-size: 12px; color: #1e40af; font-weight: 600;">Courier Tracking Consignment</div>
              <div style="font-size: 18px; font-weight: 800; color: #1e3a8a; letter-spacing: 1px; margin: 4px 0;">${trackingCode}</div>
              <div style="font-size: 11px; color: #3b82f6;">Partner: <strong>${courierName}</strong></div>
            </div>

            <table class="info-table">
              <tr>
                <td style="color: #64748b;">Invoice ID</td>
                <td style="font-weight: 700; text-align: right;">${invoiceNumber}</td>
              </tr>
              <tr>
                <td style="color: #64748b;">Recipient Address</td>
                <td style="text-align: right;">${deliveryAddress}</td>
              </tr>
              <tr>
                <td style="color: #64748b;">Payment Method</td>
                <td style="font-weight: 700; text-align: right; color: #059669;">Cash On Delivery (COD)</td>
              </tr>
            </table>

            <div class="amount-box">
              <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Cash To Collect On Delivery</div>
              <div class="amount-value">৳${codAmount.toLocaleString()}</div>
              <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Please pay exact cash to the courier delivery hero upon receiving the parcel.</div>
            </div>

            <p style="font-size: 12px; color: #64748b; line-height: 1.6;">
              If you have any questions or need to reschedule delivery, please contact our merchant support page. Thank you for choosing us!
            </p>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} ${storeName}. Powered by CourierSync BD.
          </div>
        </div>
      </body>
    </html>
  `;

  // Check if SMTP environment credentials exist
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpPort = process.env.SMTP_PORT || 587;
  const fromEmail = process.env.SMTP_FROM || `"${storeName}" <notifications@couriersync.bd>`;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: Number(smtpPort) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: fromEmail,
        to: customerEmail,
        subject: `Order Dispatched & Invoice ${invoiceNumber} - ${storeName}`,
        html: htmlContent,
      });

      console.log('Customer Invoice Email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error('Error sending SMTP email:', err.message);
      return { success: false, error: err.message };
    }
  } else {
    // Development / Simulated Email Dispatch Mode
    console.log(`[SIMULATED EMAIL DISPATCH] To: ${customerEmail} | Subject: Order Dispatched & Invoice ${invoiceNumber} | Tracking: ${trackingCode}`);
    return {
      success: true,
      simulated: true,
      message: `Invoice email successfully generated and queued for ${customerEmail}.`,
    };
  }
}
