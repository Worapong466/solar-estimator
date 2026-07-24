import type { FinancialResult, SizingResult, SystemRecommendation } from "../../types";

interface Props {
  sizing: SizingResult;
  systemRec: SystemRecommendation;
  financial: FinancialResult;
}

export function RecommendedSystemCard({ sizing, systemRec, financial }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">ระบบที่แนะนำ</h2>
      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Item label="ขนาดระบบ" value={`${sizing.finalKwp} kWp`} />
        <Item label="อินเวอร์เตอร์" value={`On-Grid ${systemRec.inverterSizeKw} kW`} />
        <Item label="จำนวนแผง" value={`${systemRec.panelCount} แผง (${systemRec.panelWattageW}W)`} />
        <Item label="พื้นที่หลังคาที่ใช้" value={`${systemRec.roofAreaUsedSqm.toFixed(1)} ตร.ม.`} />
        <Item label="ผลิตไฟต่อปี" value={`${Math.round(financial.annualProductionKwh).toLocaleString()} kWh`} />
      </dl>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
