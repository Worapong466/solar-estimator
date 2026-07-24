export type PropertyType = "house" | "townhome" | "commercial" | "office" | "factory";

export type RoofSize = "small" | "medium" | "large"; // เล็ก <50 ตร.ม. / กลาง 50-100 / ใหญ่ >100

export type FutureLoadOption = "aircon" | "extension" | "business" | "machinery";

// Q7: เป็นเจ้าของหรือวางแผนซื้อ EV — ใช้คำนวณ bonus ขนาดระบบ (กลุ่ม A)
export type EvStatus = "owned" | "planning" | "none";

// Q2: มีรถ EV ชาร์จช่วงไหน — ใช้เฉพาะ narrative/แนะนำแบตเตอรี่ (กลุ่ม B, ไม่เข้าสูตร)
export type EvChargingTime = "none" | "day" | "night" | "allday";

export interface QuickEstimateInput {
  propertyType: PropertyType;
  monthlyBillBaht: number;
  province: string;
}

export interface LeadInfo {
  firstName: string;
  lastName: string;
  phone: string; // เก็บเป็น +66xxxxxxxxx หลัง normalize แล้ว
  email?: string;
  pdpaConsent: boolean;
  marketingConsent: boolean;
}

// กลุ่ม A: มีผลต่อ confidence score และสูตรคำนวณขนาดระบบ
export interface DetailedAssessmentGroupA {
  daytimeUsagePct: number; // Q3, slider 0-100
  futureLoadOptions: FutureLoadOption[]; // Q4
  evStatus: EvStatus; // Q7
  roofSize: RoofSize; // Q8
}

// กลุ่ม B: คำถามเสริม ไม่มีผลต่อคะแนน ใช้ปรับ narrative/คำแนะนำแบตเตอรี่เท่านั้น
export interface DetailedAssessmentGroupB {
  touMeter: "yes" | "no" | "unsure"; // Q1
  evChargingTime: EvChargingTime; // Q2
  workFromHome: "yes" | "sometimes" | "no"; // Q5
  backupPowerNeeded: "yes" | "maybe" | "no"; // Q6
}

export type DetailedAssessmentAnswers = DetailedAssessmentGroupA & DetailedAssessmentGroupB;

export interface SizingResult {
  kWhMonthly: number;
  baseKwp: number;
  daytimeMultiplier: number;
  adjustedKwp: number;
  futureLoadPct: number;
  evPct: number;
  sizedKwp: number;
  roofCapKwp: number | null; // null = ยังไม่รู้ขนาดหลังคา (ตอน Quick Estimate)
  finalKwp: number;
}

export interface FinancialResult {
  investmentBaht: number;
  annualProductionKwh: number;
  monthlyProductionKwh: number;
  selfConsumptionPct: number;
  selfConsumedKwh: number;
  exportedKwh: number;
  remainingBillBaht: number;
  savingsPerMonthBaht: number;
  paybackYears: number | null; // null ถ้าประหยัด <= 0 (คำนวณคืนทุนไม่ได้)
  feedInRevenueBahtPerMonth: number;
  carbonReductionKgPerYear: number;
}

export interface YearProjection {
  year: number;
  productionKwh: number;
  billWithoutSolarBaht: number;
  billWithSolarBaht: number;
}

export interface ConfidenceBreakdownItem {
  field: string;
  points: number;
  answered: boolean;
}

export interface ConfidenceResult {
  score: number;
  maxScore: number;
  breakdown: ConfidenceBreakdownItem[];
}

export interface SystemRecommendation {
  panelCount: number;
  panelWattageW: number;
  inverterSizeKw: number;
  roofAreaUsedSqm: number;
}

export interface BatteryRecommendation {
  recommended: boolean;
  reason: string;
}
