'use client';

import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export default function AnalyticsChart({ orders }) {
  // Aggregate order metrics by district
  const districtData = orders.reduce((acc, order) => {
    const existing = acc.find((item) => item.district === order.district);
    if (existing) {
      existing.totalCOD += order.codAmount;
      existing.orderCount += 1;
    } else {
      acc.push({
        district: order.district,
        totalCOD: order.codAmount,
        orderCount: 1,
      });
    }
    return acc;
  }, []);

  return (
    <div className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-200">
      <div className="mb-4">
        <h3 className="text-lg font-bold">COD Value by Region</h3>
        <p className="text-xs text-base-content/60">Total pending and settled cash distribution (BDT)</p>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={districtData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="district" stroke="#888888" fontSize={12} />
            <YAxis stroke="#888888" fontSize={12} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', color: '#fff', borderRadius: '8px' }} 
              formatter={(value) => [`৳${value}`, 'Total COD']}
            />
            <Bar dataKey="totalCOD" fill="#570df8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
