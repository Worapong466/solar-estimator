import { CONFIG, selfConsumptionPct } from "../config/constants";
import type { FinancialResult, YearProjection } from "../types";

export function calculateFinancials(
  finalKwp: number,
  monthlyBillBaht: number,
  kWhMonthly: number,
  daytimeUsagePct: number
): FinancialResult {
  const investmentBaht = finalKwp * CONFIG.PRICE_PER_KWP_BAHT;

  const annualProductionKwh = finalKwp * CONFIG.PEAK_SUN_HOURS * 365;
  const monthlyProductionKwh = annualProductionKwh / 12;

  const selfConsumption = selfConsumptionPct(daytimeUsagePct);
  const selfConsumedKwh = Math.min(monthlyProductionKwh * selfConsumption, kWhMonthly);
  const exportedKwh = Math.max(monthlyProductionKwh - selfConsumedKwh, 0);

  const remainingBillBaht = (kWhMonthly - selfConsumedKwh) * CONFIG.ELECTRICITY_RATE_BAHT_PER_KWH;
  const savingsPerMonthBaht = monthlyBillBaht - remainingBillBaht;

  const paybackYears =
    savingsPerMonthBaht > 0 ? investmentBaht / (savingsPerMonthBaht * 12) : null;

  const feedInRevenueBahtPerMonth = exportedKwh * CONFIG.FEED_IN_TARIFF_BAHT_PER_KWH;
  const carbonReductionKgPerYear = annualProductionKwh * CONFIG.EMISSION_FACTOR_KG_CO2_PER_KWH;

  return {
    investmentBaht,
    annualProductionKwh,
    monthlyProductionKwh,
    selfConsumptionPct: selfConsumption,
    selfConsumedKwh,
    exportedKwh,
    remainingBillBaht,
    savingsPerMonthBaht,
    paybackYears,
    feedInRevenueBahtPerMonth,
    carbonReductionKgPerYear,
  };
}

/** กราฟเปรียบเทียบค่าไฟ 25 ปี (มีโซลาร์ vs ไม่มี) — รวม panel degradation ที่สเปกเดิมขาดไป */
export function calculate25YearProjection(
  annualProductionKwh: number,
  monthlyBillBaht: number,
  savingsPerMonthBaht: number
): YearProjection[] {
  const years: YearProjection[] = [];
  const annualBillBaht = monthlyBillBaht * 12;
  const annualSavingsBaht = savingsPerMonthBaht * 12;

  for (let year = 1; year <= 25; year++) {
    const degradationFactor = Math.pow(1 - CONFIG.PANEL_DEGRADATION_RATE, year - 1);
    const inflationFactor = Math.pow(1 + CONFIG.INFLATION_RATE, year - 1);

    const productionKwh = annualProductionKwh * degradationFactor;
    const billWithoutSolarBaht = annualBillBaht * inflationFactor;
    // ปีที่ผลผลิตลดลงจาก degradation ก็ทำให้ส่วนที่ประหยัดได้ลดลงตามสัดส่วนเดียวกัน
    const billWithSolarBaht = billWithoutSolarBaht - annualSavingsBaht * degradationFactor * inflationFactor;

    years.push({ year, productionKwh, billWithoutSolarBaht, billWithSolarBaht });
  }

  return years;
}
