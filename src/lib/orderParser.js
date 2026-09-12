export function parseChatOrder(text) {
  if (!text) return null;

  const phoneRegex = /(?:\+88)?(01[3-9]\d{8})/;
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/i;
  const codRegex = /(?:cod|cash|টাকা|tk|bdt)\s*:?\s*(\d{2,6})/i;
  const genericNumberRegex = /\b(\d{3,5})\s*(?:tk|bdt|টাকা)?\b/i;

  const phoneMatch = text.match(phoneRegex);
  const emailMatch = text.match(emailRegex);
  const codMatch = text.match(codRegex) || text.match(genericNumberRegex);

  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  const textLower = text.toLowerCase();

  // District detection across Bangladesh
  let district = 'Dhaka';
  const districts = [
    'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 
    'Rangpur', 'Mymensingh', 'Comilla', 'Gazipur', 'Narayanganj', 
    'Bogra', 'Jessore', 'Cox\'s Bazar', 'Dhaka'
  ];

  for (const d of districts) {
    if (textLower.includes(d.toLowerCase())) {
      district = d;
      break;
    }
  }

  // Address lines excluding phone, email, and COD
  const addressLines = lines.filter(
    (line) =>
      !phoneRegex.test(line) &&
      !emailRegex.test(line) &&
      !codRegex.test(line)
  );

  const customerName = addressLines[0] || 'Facebook Merchant Customer';
  const deliveryAddress = addressLines.slice(1).join(', ') || lines.join(', ');

  return {
    customerName,
    customerPhone: phoneMatch ? phoneMatch[1] : '01711223344',
    customerEmail: emailMatch ? emailMatch[0] : '',
    deliveryAddress: deliveryAddress || 'House 1, Road 1, Dhaka',
    district,
    items: 'F-Commerce Parcel',
    codAmount: codMatch ? parseInt(codMatch[1], 10) : 1200,
    courierName: 'Steadfast',
    status: 'Pending',
    createdAt: new Date(),
  };
}