import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { YearProjection } from "../../types";

export function YearlyComparisonChart({ projection }: { projection: YearProjection[] }) {
  const data = projection.map((y) => ({
    year: y.year,
    "ไม่มีโซลาร์": Math.round(y.billWithoutSolarBaht),
    "มีโซลาร์": Math.round(y.billWithSolarBaht),
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">เปรียบเทียบค่าไฟ 25 ปี</h2>
      <p className="mt-1 text-sm text-slate-500">สมมติเงินเฟ้อค่าไฟ 3%/ปี และประสิทธิภาพแผงลดลง 0.6%/ปี</p>
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} label={{ value: "ปีที่", position: "insideBottom", offset: -4, fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value) => `${Number(value).toLocaleString()} บาท`} labelFormatter={(year) => `ปีที่ ${year}`} />
            <Legend />
            <Line type="monotone" dataKey="ไม่มีโซลาร์" stroke="#ef4444" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="มีโซลาร์" stroke="#059669" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
