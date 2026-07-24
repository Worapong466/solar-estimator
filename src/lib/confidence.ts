import type { ConfidenceBreakdownItem, ConfidenceResult, DetailedAssessmentGroupA, QuickEstimateInput } from "../types";

// กลุ่ม A เท่านั้นที่มีผลต่อคะแนน (รวม 100) — กลุ่ม B (TOU, EV charging time, work from home, backup power)
// ไม่บวกคะแนน ใช้ปรับ narrative/คำแนะนำแบตเตอรี่เท่านั้น ดู solar-estimator-spec.md หมวด 4
const WEIGHTS = {
  monthlyBillBaht: 30,
  propertyType: 15,
  province: 10,
  daytimeUsagePct: 20,
  roofSize: 15,
  futureLoadOptions: 5,
  evStatus: 5,
} as const;

export function calculateConfidence(
  quickEstimate: Partial<QuickEstimateInput>,
  groupA: Partial<DetailedAssessmentGroupA>
): ConfidenceResult {
  const breakdown: ConfidenceBreakdownItem[] = [
    { field: "ค่าไฟต่อเดือน", points: WEIGHTS.monthlyBillBaht, answered: !!quickEstimate.monthlyBillBaht && quickEstimate.monthlyBillBaht > 0 },
    { field: "ประเภทอาคาร", points: WEIGHTS.propertyType, answered: !!quickEstimate.propertyType },
    { field: "จังหวัด", points: WEIGHTS.province, answered: !!quickEstimate.province },
    { field: "สัดส่วนใช้ไฟกลางวัน", points: WEIGHTS.daytimeUsagePct, answered: groupA.daytimeUsagePct !== undefined },
    { field: "ขนาดหลังคา", points: WEIGHTS.roofSize, answered: !!groupA.roofSize },
    { field: "แผนขยายโหลดอนาคต", points: WEIGHTS.futureLoadOptions, answered: groupA.futureLoadOptions !== undefined },
    { field: "สถานะ EV", points: WEIGHTS.evStatus, answered: !!groupA.evStatus },
  ];

  const maxScore = breakdown.reduce((sum, item) => sum + item.points, 0);
  const score = breakdown.reduce((sum, item) => sum + (item.answered ? item.points : 0), 0);

  return { score, maxScore, breakdown };
}
