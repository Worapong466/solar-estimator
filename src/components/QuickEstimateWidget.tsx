import { useState, type FormEvent } from "react";
import { useEstimatorStore } from "../store/useEstimatorStore";
import { PROVINCES } from "../data/provinces";
import { countInstallersByProvince } from "../data/installers";
import { calculateQuickEstimateSizing } from "../lib/sizing";
import { calculateFinancials } from "../lib/financial";
import { CONFIG } from "../config/constants";
import type { PropertyType } from "../types";

const PROPERTY_TYPE_OPTIONS: { value: PropertyType; label: string }[] = [
  { value: "house", label: "บ้าน" },
  { value: "townhome", label: "ทาวน์โฮม" },
  { value: "commercial", label: "พาณิชย์" },
  { value: "office", label: "สำนักงาน" },
  { value: "factory", label: "โรงงาน" },
];

export function QuickEstimateWidget() {
  const quickEstimate = useEstimatorStore((s) => s.quickEstimate);
  const setQuickEstimate = useEstimatorStore((s) => s.setQuickEstimate);
  const resetQuickEstimate = useEstimatorStore((s) => s.resetQuickEstimate);
  const goToLeadCapture = useEstimatorStore((s) => s.goToLeadCapture);

  if (quickEstimate) {
    return <QuickEstimateResult onEdit={resetQuickEstimate} onContinue={goToLeadCapture} />;
  }

  return <QuickEstimateForm onSubmit={setQuickEstimate} />;
}

function QuickEstimateForm({ onSubmit }: { onSubmit: (input: { propertyType: PropertyType; monthlyBillBaht: number; province: string }) => void }) {
  const [propertyType, setPropertyType] = useState<PropertyType | "">("");
  const [monthlyBill, setMonthlyBill] = useState("");
  const [province, setProvince] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const billNumber = Number(monthlyBill);

    if (!propertyType) return setError("กรุณาเลือกประเภทอสังหาริมทรัพย์");
    if (!monthlyBill || billNumber <= 0) return setError("กรุณากรอกค่าไฟต่อเดือนให้ถูกต้อง");
    if (!province) return setError("กรุณาเลือกจังหวัด");

    setError(null);
    onSubmit({ propertyType, monthlyBillBaht: billNumber, province });
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">ประเมินขนาดระบบโซลาร์ฟรี</h2>

      <fieldset className="mt-4">
        <legend className="text-sm font-medium text-slate-700">ประเภทอสังหาริมทรัพย์</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PROPERTY_TYPE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2 text-sm transition-colors ${
                propertyType === opt.value
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                  : "border-slate-300 text-slate-600 hover:border-slate-400"
              }`}
            >
              <input
                type="radio"
                name="propertyType"
                value={opt.value}
                checked={propertyType === opt.value}
                onChange={() => setPropertyType(opt.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-slate-700">ค่าไฟต่อเดือน (บาท)</span>
        <input
          type="number"
          min={0}
          inputMode="numeric"
          value={monthlyBill}
          onChange={(e) => setMonthlyBill(e.target.value)}
          placeholder="เช่น 3000"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-slate-700">จังหวัด</span>
        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-emerald-500 focus:outline-none"
        >
          <option value="">เลือกจังหวัด</option>
          {PROVINCES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button type="submit" className="mt-6 w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-medium text-white hover:bg-emerald-700">
        เริ่มประเมินฟรี
      </button>
    </form>
  );
}

function QuickEstimateResult({ onEdit, onContinue }: { onEdit: () => void; onContinue: () => void }) {
  const quickEstimate = useEstimatorStore((s) => s.quickEstimate)!;

  const sizing = calculateQuickEstimateSizing(quickEstimate.monthlyBillBaht);
  const financial = calculateFinancials(
    sizing.finalKwp,
    quickEstimate.monthlyBillBaht,
    sizing.kWhMonthly,
    CONFIG.DEFAULT_DAYTIME_PCT
  );
  const installerCount = countInstallersByProvince(quickEstimate.province);

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">ผลประเมินเบื้องต้น</h2>
      <p className="mt-1 text-sm text-slate-500">
        ประมาณการจากค่าไฟ {quickEstimate.monthlyBillBaht.toLocaleString()} บาท/เดือน ที่{quickEstimate.province}
        {" — "}สมมติสัดส่วนใช้ไฟกลางวัน/กลางคืนแบบสมดุล 50% ทำแบบประเมินละเอียดเพื่อความแม่นยำสูงขึ้น
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-3">
        <ResultItem label="ขนาดระบบแนะนำ" value={`${sizing.finalKwp} kWp`} />
        <ResultItem label="ประหยัด/เดือน" value={`${Math.round(financial.savingsPerMonthBaht).toLocaleString()} บาท`} />
        <ResultItem label="ระยะคืนทุน" value={financial.paybackYears ? `${financial.paybackYears.toFixed(1)} ปี` : "-"} />
        <ResultItem label="ผู้ติดตั้งในพื้นที่" value={`${installerCount} ราย`} />
      </dl>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onContinue}
          className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 font-medium text-white hover:bg-emerald-700"
        >
          ทำแบบประเมินละเอียด
        </button>
        <button type="button" onClick={onEdit} className="rounded-lg border border-slate-300 px-4 py-2.5 text-slate-600 hover:bg-slate-50">
          แก้ไข
        </button>
      </div>
    </div>
  );
}

function ResultItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-base font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
