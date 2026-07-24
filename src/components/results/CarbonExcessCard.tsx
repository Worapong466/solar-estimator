import type { FinancialResult } from "../../types";

export function CarbonExcessCard({ financial }: { financial: FinancialResult }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">ลดคาร์บอน</h2>
        <p className="mt-3 text-2xl font-bold text-emerald-700">
          {Math.round(financial.carbonReductionKgPerYear).toLocaleString()} กก. CO₂/ปี
        </p>
        <p className="mt-1 text-xs text-slate-500">เทียบเท่าลดการปล่อยคาร์บอนจากการผลิตไฟฟ้า</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">ไฟฟ้าส่วนเกิน</h2>
        <p className="mt-3 text-2xl font-bold text-slate-900">{Math.round(financial.exportedKwh).toLocaleString()} kWh/เดือน</p>
        <p className="mt-1 text-xs text-slate-500">
          หากขายคืนภาครัฐที่ feed-in tariff ปัจจุบัน ≈ {Math.round(financial.feedInRevenueBahtPerMonth).toLocaleString()} บาท/เดือน
          (ข้อมูลอ้างอิงเท่านั้น ไม่รวมในเซฟวิ่งหลัก)
        </p>
      </div>
    </div>
  );
}
