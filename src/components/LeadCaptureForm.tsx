import { useState, type FormEvent } from "react";
import { useEstimatorStore } from "../store/useEstimatorStore";
import { isValidThaiMobile, normalizeThaiMobile } from "../lib/phone";
import { generateLeadId } from "../lib/id";
import { submitLeadToBackend } from "../lib/api";

export function LeadCaptureForm() {
  const quickEstimate = useEstimatorStore((s) => s.quickEstimate)!;
  const existingLeadId = useEstimatorStore((s) => s.leadId);
  const submitLead = useEstimatorStore((s) => s.submitLead);
  const backToQuickEstimate = useEstimatorStore((s) => s.backToQuickEstimate);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pdpaConsent, setPdpaConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) return setError("กรุณากรอกชื่อ-นามสกุล");
    if (!isValidThaiMobile(phone)) return setError("กรุณากรอกเบอร์โทรศัพท์มือถือให้ถูกต้อง (เช่น 0812345678)");
    if (!pdpaConsent) return setError("กรุณายินยอมนโยบายความเป็นส่วนตัว (PDPA) ก่อนดำเนินการต่อ");

    const normalizedPhone = normalizeThaiMobile(phone)!;
    const leadId = existingLeadId ?? generateLeadId();
    const leadInfo = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: normalizedPhone,
      email: email.trim() || undefined,
      pdpaConsent,
      marketingConsent,
    };

    setError(null);
    submitLead(leadInfo, leadId);
    submitLeadToBackend(leadId, leadInfo, quickEstimate).catch((err) => console.error("submitLeadToBackend failed", err));
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">กรอกข้อมูลติดต่อ</h2>
      <p className="mt-1 text-sm text-slate-500">เพื่อรับผลวิเคราะห์ฉบับเต็มและให้ทีมงานติดต่อกลับ</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">ชื่อ</span>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">นามสกุล</span>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-slate-700">เบอร์โทรศัพท์</span>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0812345678"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-slate-700">อีเมล (ไม่บังคับ)</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
        />
      </label>

      <label className="mt-4 flex items-start gap-2">
        <input
          type="checkbox"
          checked={pdpaConsent}
          onChange={(e) => setPdpaConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300"
        />
        <span className="text-sm text-slate-600">
          ข้าพเจ้ายินยอมให้เก็บและใช้ข้อมูลส่วนบุคคลตามนโยบายความเป็นส่วนตัว (PDPA) เพื่อการติดต่อกลับและประเมินระบบโซลาร์ (จำเป็น)
        </span>
      </label>

      <label className="mt-2 flex items-start gap-2">
        <input
          type="checkbox"
          checked={marketingConsent}
          onChange={(e) => setMarketingConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300"
        />
        <span className="text-sm text-slate-600">ข้าพเจ้าต้องการรับข่าวสารและโปรโมชั่น (ไม่บังคับ)</span>
      </label>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex gap-3">
        <button type="submit" className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 font-medium text-white hover:bg-emerald-700">
          ดูผลวิเคราะห์ฉบับเต็ม
        </button>
        <button
          type="button"
          onClick={backToQuickEstimate}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-slate-600 hover:bg-slate-50"
        >
          ย้อนกลับ
        </button>
      </div>
    </form>
  );
}
