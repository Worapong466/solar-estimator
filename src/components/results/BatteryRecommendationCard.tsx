import type { BatteryRecommendation } from "../../types";

export function BatteryRecommendationCard({ battery }: { battery: BatteryRecommendation }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">คำแนะนำเรื่องแบตเตอรี่</h2>
      <p className={`mt-2 text-sm font-semibold ${battery.recommended ? "text-emerald-700" : "text-slate-600"}`}>
        {battery.recommended ? "แนะนำให้ติดตั้งแบตเตอรี่เสริม" : "ยังไม่จำเป็นต้องติดตั้งแบตเตอรี่"}
      </p>
      <p className="mt-1 text-sm text-slate-500">{battery.reason}</p>
    </div>
  );
}
