import { useState } from "react";
import { useEstimatorStore } from "../store/useEstimatorStore";
import { calculateConfidence } from "../lib/confidence";
import { calculateFullSizing } from "../lib/sizing";
import { calculateFinancials } from "../lib/financial";
import { submitAssessmentToBackend } from "../lib/api";
import type {
  DetailedAssessmentGroupB,
  EvChargingTime,
  EvStatus,
  FutureLoadOption,
  RoofSize,
} from "../types";

const FUTURE_LOAD_LABELS: Record<FutureLoadOption, string> = {
  aircon: "ติดแอร์เพิ่ม",
  extension: "ต่อเติมบ้าน",
  business: "ขยายธุรกิจ",
  machinery: "เครื่องจักรเพิ่ม",
};

const ROOF_SIZE_OPTIONS: { value: RoofSize; label: string }[] = [
  { value: "small", label: "เล็ก (<50 ตร.ม.)" },
  { value: "medium", label: "กลาง (50-100 ตร.ม.)" },
  { value: "large", label: "ใหญ่ (>100 ตร.ม.)" },
];

const EV_STATUS_OPTIONS: { value: EvStatus; label: string }[] = [
  { value: "owned", label: "มีแล้ว" },
  { value: "planning", label: "วางแผนซื้อ" },
  { value: "none", label: "ไม่มีแผน" },
];

const TOU_OPTIONS: { value: DetailedAssessmentGroupB["touMeter"]; label: string }[] = [
  { value: "yes", label: "ใช่" },
  { value: "no", label: "ไม่ใช่" },
  { value: "unsure", label: "ไม่แน่ใจ" },
];

const EV_CHARGING_OPTIONS: { value: EvChargingTime; label: string }[] = [
  { value: "none", label: "ไม่มี" },
  { value: "day", label: "ชาร์จกลางวัน" },
  { value: "night", label: "ชาร์จกลางคืน" },
  { value: "allday", label: "ชาร์จทั้งวัน" },
];

const WFH_OPTIONS: { value: DetailedAssessmentGroupB["workFromHome"]; label: string }[] = [
  { value: "yes", label: "ใช่" },
  { value: "sometimes", label: "บางครั้ง" },
  { value: "no", label: "ไม่" },
];

const BACKUP_OPTIONS: { value: DetailedAssessmentGroupB["backupPowerNeeded"]; label: string }[] = [
  { value: "yes", label: "ใช่" },
  { value: "maybe", label: "อาจจะ" },
  { value: "no", label: "ไม่" },
];

export function DetailedAssessmentForm() {
  const quickEstimate = useEstimatorStore((s) => s.quickEstimate)!;
  const leadId = useEstimatorStore((s) => s.leadId);
  const submitAssessment = useEstimatorStore((s) => s.submitAssessment);
  const backToLeadCapture = useEstimatorStore((s) => s.backToLeadCapture);

  const [touMeter, setTouMeter] = useState<DetailedAssessmentGroupB["touMeter"]>();
  const [evChargingTime, setEvChargingTime] = useState<EvChargingTime>();
  const [daytimeUsagePct, setDaytimeUsagePct] = useState(50);
  const [futureLoadOptions, setFutureLoadOptions] = useState<FutureLoadOption[]>();
  const [workFromHome, setWorkFromHome] = useState<DetailedAssessmentGroupB["workFromHome"]>();
  const [backupPowerNeeded, setBackupPowerNeeded] = useState<DetailedAssessmentGroupB["backupPowerNeeded"]>();
  const [evStatus, setEvStatus] = useState<EvStatus>();
  const [roofSize, setRoofSize] = useState<RoofSize>();
  const [error, setError] = useState<string | null>(null);

  const confidence = calculateConfidence(quickEstimate, { daytimeUsagePct, futureLoadOptions, evStatus, roofSize });
  const unanswered = confidence.breakdown.filter((item) => !item.answered);

  const toggleFutureLoad = (option: FutureLoadOption) => {
    setFutureLoadOptions((prev) => {
      const current = prev ?? [];
      return current.includes(option) ? current.filter((o) => o !== option) : [...current, option];
    });
  };

  const daytimeLabel = daytimeUsagePct < 40 ? "กลางคืนเป็นหลัก" : daytimeUsagePct > 60 ? "กลางวันเป็นหลัก" : "สมดุล";

  const handleSubmit = () => {
    if (!touMeter || !evChargingTime || !futureLoadOptions || !workFromHome || !backupPowerNeeded || !evStatus || !roofSize) {
      setError("กรุณาตอบให้ครบทั้ง 8 ข้อก่อนดูผลวิเคราะห์");
      return;
    }
    setError(null);
    const answers = {
      touMeter,
      evChargingTime,
      daytimeUsagePct,
      futureLoadOptions,
      workFromHome,
      backupPowerNeeded,
      evStatus,
      roofSize,
    };
    submitAssessment(answers);

    if (leadId) {
      const sizing = calculateFullSizing(quickEstimate.monthlyBillBaht, answers);
      const financial = calculateFinancials(sizing.finalKwp, quickEstimate.monthlyBillBaht, sizing.kWhMonthly, daytimeUsagePct);
      const fullConfidence = calculateConfidence(quickEstimate, answers);
      submitAssessmentToBackend(leadId, answers, sizing, financial, fullConfidence.score).catch((err) =>
        console.error("submitAssessmentToBackend failed", err)
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">แบบประเมินละเอียด</h2>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">ความแม่นยำของผลประเมิน</span>
          <span className="font-semibold text-emerald-700">{confidence.score}%</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all"
            style={{ width: `${confidence.score}%` }}
          />
        </div>
        {unanswered.length > 0 && (
          <p className="mt-1.5 text-xs text-slate-500">
            ตอบอีก {unanswered.length} ข้อ ({unanswered.map((u) => u.field).join(", ")}) เพื่อเพิ่มความแม่นยำเป็น 100%
          </p>
        )}
      </div>

      <div className="mt-6 space-y-6">
        <RadioGroup legend="1. มิเตอร์ไฟฟ้าเป็นแบบ TOU (คิดค่าไฟตามช่วงเวลา) หรือไม่" options={TOU_OPTIONS} value={touMeter} onChange={setTouMeter} />

        <RadioGroup
          legend="2. มีรถ EV และชาร์จช่วงไหน"
          options={EV_CHARGING_OPTIONS}
          value={evChargingTime}
          onChange={setEvChargingTime}
        />

        <div>
          <label className="text-sm font-medium text-slate-700">
            3. สัดส่วนการใช้ไฟฟ้าช่วงกลางวัน (08:00-17:00): {daytimeUsagePct}% ({daytimeLabel})
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={daytimeUsagePct}
            onChange={(e) => setDaytimeUsagePct(Number(e.target.value))}
            className="mt-2 w-full accent-emerald-600"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>กลางคืนเป็นหลัก</span>
            <span>สมดุล</span>
            <span>กลางวันเป็นหลัก</span>
          </div>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-slate-700">4. แผนขยายโหลดการใช้ไฟในอนาคต (เลือกได้หลายข้อ)</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {(Object.keys(FUTURE_LOAD_LABELS) as FutureLoadOption[]).map((option) => (
              <label
                key={option}
                className={`cursor-pointer rounded-lg border px-3 py-2 text-sm transition-colors ${
                  futureLoadOptions?.includes(option)
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                    : "border-slate-300 text-slate-600 hover:border-slate-400"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={futureLoadOptions?.includes(option) ?? false}
                  onChange={() => toggleFutureLoad(option)}
                />
                {FUTURE_LOAD_LABELS[option]}
              </label>
            ))}
            <label
              className={`cursor-pointer rounded-lg border px-3 py-2 text-sm transition-colors ${
                futureLoadOptions?.length === 0
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                  : "border-slate-300 text-slate-600 hover:border-slate-400"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={futureLoadOptions?.length === 0}
                onChange={() => setFutureLoadOptions([])}
              />
              ไม่มี
            </label>
          </div>
        </fieldset>

        <RadioGroup legend="5. ทำงานที่บ้านหรือไม่" options={WFH_OPTIONS} value={workFromHome} onChange={setWorkFromHome} />

        <RadioGroup
          legend="6. ต้องการไฟสำรองเมื่อไฟดับหรือไม่"
          options={BACKUP_OPTIONS}
          value={backupPowerNeeded}
          onChange={setBackupPowerNeeded}
        />

        <RadioGroup legend="7. เป็นเจ้าของหรือวางแผนซื้อรถ EV หรือไม่" options={EV_STATUS_OPTIONS} value={evStatus} onChange={setEvStatus} />

        <RadioGroup legend="8. ขนาดหลังคาโดยประมาณ" options={ROOF_SIZE_OPTIONS} value={roofSize} onChange={setRoofSize} />
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex gap-3">
        <button type="button" onClick={handleSubmit} className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 font-medium text-white hover:bg-emerald-700">
          ดูผลวิเคราะห์
        </button>
        <button type="button" onClick={backToLeadCapture} className="rounded-lg border border-slate-300 px-4 py-2.5 text-slate-600 hover:bg-slate-50">
          ย้อนกลับ
        </button>
      </div>
    </div>
  );
}

function RadioGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: { value: T | undefined; label: string }[];
  value: T | undefined;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-slate-700">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => (
          <label
            key={opt.label}
            className={`cursor-pointer rounded-lg border px-3 py-2 text-sm transition-colors ${
              value === opt.value ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-slate-300 text-slate-600 hover:border-slate-400"
            }`}
          >
            <input type="radio" className="sr-only" checked={value === opt.value} onChange={() => opt.value !== undefined && onChange(opt.value)} />
            {opt.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
