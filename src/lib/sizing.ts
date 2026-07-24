import { CONFIG, ROOF_MAX_KWP, FUTURE_LOAD_INCREMENTS, daytimeMultiplier } from "../config/constants";
import type { DetailedAssessmentGroupA, SizingResult } from "../types";

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function computeFutureLoadPct(options: readonly (keyof typeof FUTURE_LOAD_INCREMENTS)[]): number {
  const sum = options.reduce((total, opt) => total + FUTURE_LOAD_INCREMENTS[opt], 0);
  return Math.min(sum, CONFIG.FUTURE_LOAD_CAP);
}

export function computeEvPct(evStatus: DetailedAssessmentGroupA["evStatus"]): number {
  // บวก bonus เฉพาะกรณี "วางแผนซื้อ" เพราะเป็นโหลดอนาคตที่ยังไม่อยู่ในบิลปัจจุบัน
  // ถ้า "owned" ถือว่าถูกนับรวมในค่าไฟปัจจุบันแล้ว ไม่บวกซ้ำ
  return evStatus === "planning" ? CONFIG.EV_PLANNED_BONUS : 0;
}

/** ใช้ตอน Quick Estimate (หน้าแรก) — ยังไม่มีคำตอบแบบประเมินละเอียด จึงไม่มี roof cap/future load/EV bonus */
export function calculateQuickEstimateSizing(monthlyBillBaht: number): SizingResult {
  const kWhMonthly = monthlyBillBaht / CONFIG.ELECTRICITY_RATE_BAHT_PER_KWH;
  const baseKwp = kWhMonthly / CONFIG.KWH_PER_KWP_MONTH;
  const multiplier = daytimeMultiplier(CONFIG.DEFAULT_DAYTIME_PCT);
  const adjustedKwp = baseKwp * multiplier;

  return {
    kWhMonthly,
    baseKwp,
    daytimeMultiplier: multiplier,
    adjustedKwp,
    futureLoadPct: 0,
    evPct: 0,
    sizedKwp: adjustedKwp,
    roofCapKwp: null,
    finalKwp: round1(adjustedKwp),
  };
}

/** ใช้หลังตอบครบแบบประเมินละเอียด (8 คำถาม) — คำนวณตามสเปกเต็ม หมวด 3.1-3.7 */
export function calculateFullSizing(monthlyBillBaht: number, answers: DetailedAssessmentGroupA): SizingResult {
  const kWhMonthly = monthlyBillBaht / CONFIG.ELECTRICITY_RATE_BAHT_PER_KWH;
  const baseKwp = kWhMonthly / CONFIG.KWH_PER_KWP_MONTH;

  const multiplier = daytimeMultiplier(answers.daytimeUsagePct);
  const adjustedKwp = baseKwp * multiplier;

  const futureLoadPct = computeFutureLoadPct(answers.futureLoadOptions);
  const evPct = computeEvPct(answers.evStatus);

  const sizedKwp = adjustedKwp * (1 + futureLoadPct + evPct);

  const roofCapKwp = ROOF_MAX_KWP[answers.roofSize];
  const finalKwp = round1(Math.min(sizedKwp, roofCapKwp));

  return {
    kWhMonthly,
    baseKwp,
    daytimeMultiplier: multiplier,
    adjustedKwp,
    futureLoadPct,
    evPct,
    sizedKwp,
    roofCapKwp,
    finalKwp,
  };
}
