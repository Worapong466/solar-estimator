import type { DetailedAssessmentAnswers, FinancialResult, LeadInfo, QuickEstimateInput, SizingResult } from "../types";

const WEB_APP_URL = import.meta.env.VITE_GAS_WEB_APP_URL as string | undefined;

async function post(payload: Record<string, unknown>): Promise<void> {
  if (!WEB_APP_URL) {
    console.warn("VITE_GAS_WEB_APP_URL ยังไม่ได้ตั้งค่า — ข้ามการส่งข้อมูลไป backend (ดู .env.example)");
    return;
  }
  // ใช้ text/plain เพื่อเลี่ยง CORS preflight ที่ Google Apps Script Web App ไม่รองรับ
  await fetch(WEB_APP_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
}

export function submitLeadToBackend(leadId: string, lead: LeadInfo, quickEstimate: QuickEstimateInput): Promise<void> {
  return post({
    action: "submitLead",
    leadId,
    firstName: lead.firstName,
    lastName: lead.lastName,
    phone: lead.phone,
    email: lead.email ?? "",
    pdpaConsent: lead.pdpaConsent,
    marketingConsent: lead.marketingConsent,
    propertyType: quickEstimate.propertyType,
    monthlyBillBaht: quickEstimate.monthlyBillBaht,
    province: quickEstimate.province,
  });
}

export function submitAssessmentToBackend(
  leadId: string,
  answers: DetailedAssessmentAnswers,
  sizing: SizingResult,
  financial: FinancialResult,
  confidenceScore: number
): Promise<void> {
  return post({
    action: "submitAssessment",
    leadId,
    touMeter: answers.touMeter,
    evChargingTime: answers.evChargingTime,
    daytimeUsagePct: answers.daytimeUsagePct,
    futureLoadOptions: answers.futureLoadOptions,
    workFromHome: answers.workFromHome,
    backupPowerNeeded: answers.backupPowerNeeded,
    evStatus: answers.evStatus,
    roofSize: answers.roofSize,
    confidenceScore,
    finalKwp: sizing.finalKwp,
    investmentBaht: financial.investmentBaht,
    savingsPerMonthBaht: financial.savingsPerMonthBaht,
    paybackYears: financial.paybackYears,
  });
}

export function submitRequestToBackend(leadId: string): Promise<void> {
  return post({ action: "submitRequest", leadId });
}
