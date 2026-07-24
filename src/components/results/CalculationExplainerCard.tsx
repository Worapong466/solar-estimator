import { useState } from "react";
import type { ConfidenceResult, DetailedAssessmentAnswers, QuickEstimateInput, SizingResult } from "../../types";

interface Props {
  confidence: ConfidenceResult;
  sizing: SizingResult;
  quickEstimate: QuickEstimateInput;
  assessment: DetailedAssessmentAnswers;
}

export function CalculationExplainerCard({ confidence, sizing, quickEstimate, assessment }: Props) {
  const [showDetails, setShowDetails] = useState(false);

  const steps = [
    {
      title: "1. การใช้ไฟปัจจุบัน",
      detail: `ค่าไฟ ${quickEstimate.monthlyBillBaht.toLocaleString()} บาท/เดือน = ${sizing.kWhMonthly.toFixed(0)} หน่วย/เดือน → ขนาดระบบพื้นฐาน ${sizing.baseKwp.toFixed(2)} kWp`,
    },
    {
      title: "2. วิเคราะห์พฤติกรรมการใช้ไฟ",
      detail: `ใช้ไฟกลางวัน ${assessment.daytimeUsagePct}% → ปรับขนาดด้วยตัวคูณ ${sizing.daytimeMultiplier.toFixed(2)} เท่า = ${sizing.adjustedKwp.toFixed(2)} kWp`,
    },
    {
      title: "3. เผื่อการใช้ไฟในอนาคต",
      detail: `แผนขยายโหลด +${(sizing.futureLoadPct * 100).toFixed(0)}% และสถานะ EV +${(sizing.evPct * 100).toFixed(0)}% = ${sizing.sizedKwp.toFixed(2)} kWp`,
    },
    {
      title: "4. ตรวจสอบพื้นที่หลังคา",
      detail: sizing.roofCapKwp
        ? `เพดานตามขนาดหลังคา ${sizing.roofCapKwp} kWp → ${sizing.sizedKwp > sizing.roofCapKwp ? "ปรับลดให้ไม่เกินเพดาน" : "ไม่เกินเพดาน ใช้ค่าที่คำนวณได้"}`
        : "ไม่มีข้อมูลขนาดหลังคา",
    },
    { title: "5. ผลตอบแทนการเงิน", detail: "ดูรายละเอียดในการ์ดผลประโยชน์ทางการเงินด้านล่าง" },
    { title: "6. ขนาดติดตั้งที่แนะนำสุดท้าย", detail: `${sizing.finalKwp} kWp (ปัดเศษทศนิยม 1 ตำแหน่ง)` },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">ที่ปรึกษาอธิบายการคำนวณ</h2>

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">ความแม่นยำของผลประเมิน</span>
        <span className="font-semibold text-emerald-700">{confidence.score}%</span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-emerald-600" style={{ width: `${confidence.score}%` }} />
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500">
        {confidence.breakdown.map((item) => (
          <li key={item.field} className={item.answered ? "text-emerald-700" : "text-slate-400"}>
            {item.answered ? "✓" : "○"} {item.field}
          </li>
        ))}
      </ul>

      <ol className="mt-5 space-y-3 border-t border-slate-100 pt-4">
        {steps.map((step) => (
          <li key={step.title}>
            <p className="text-sm font-medium text-slate-800">{step.title}</p>
            <p className="text-sm text-slate-500">{step.detail}</p>
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={() => setShowDetails((v) => !v)}
        className="mt-4 text-sm font-medium text-emerald-700 hover:underline"
      >
        {showDetails ? "ซ่อนรายละเอียดการคำนวณ" : "ดูรายละเอียดการคำนวณ (Calculation Details)"}
      </button>

      {showDetails && (
        <dl className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
          <DetailRow label="หน่วยไฟฟ้า/เดือน" value={`${sizing.kWhMonthly.toFixed(1)} kWh`} />
          <DetailRow label="ขนาดพื้นฐาน" value={`${sizing.baseKwp.toFixed(2)} kWp`} />
          <DetailRow label="ตัวคูณใช้ไฟกลางวัน" value={sizing.daytimeMultiplier.toFixed(2)} />
          <DetailRow label="ขนาดหลังปรับพฤติกรรม" value={`${sizing.adjustedKwp.toFixed(2)} kWp`} />
          <DetailRow label="% แผนขยายโหลด" value={`${(sizing.futureLoadPct * 100).toFixed(0)}%`} />
          <DetailRow label="% EV bonus" value={`${(sizing.evPct * 100).toFixed(0)}%`} />
          <DetailRow label="ขนาดก่อนจำกัดหลังคา" value={`${sizing.sizedKwp.toFixed(2)} kWp`} />
          <DetailRow label="เพดานหลังคา" value={sizing.roofCapKwp ? `${sizing.roofCapKwp} kWp` : "-"} />
          <DetailRow label="ขนาดสุดท้าย" value={`${sizing.finalKwp} kWp`} />
        </dl>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt>{label}</dt>
      <dd className="font-medium text-slate-800">{value}</dd>
    </div>
  );
}
