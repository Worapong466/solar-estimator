import { describe, it, expect } from "vitest";
import { calculateFinancials, calculate25YearProjection } from "./financial";

describe("calculateFinancials", () => {
  it("คำนวณผลตอบแทนการเงินตามตัวอย่างในสเปก (5.6 kWp, ค่าไฟ 3,000 บาท, ใช้ไฟกลางวัน 50%)", () => {
    const result = calculateFinancials(5.6, 3000, 714.29, 50);

    expect(result.investmentBaht).toBeCloseTo(140000, 0);
    expect(result.annualProductionKwh).toBeCloseTo(9198, 0);
    expect(result.selfConsumptionPct).toBeCloseTo(0.5, 5);
    expect(result.savingsPerMonthBaht).toBeCloseTo(1609.6, 0);
    expect(result.paybackYears).toBeCloseTo(7.25, 1);
  });

  it("self-consumption ไม่เกิน 70% แม้ใช้ไฟกลางวัน 100%", () => {
    const result = calculateFinancials(5, 5000, 1190, 100);
    expect(result.selfConsumptionPct).toBeCloseTo(0.7, 5);
  });

  it("self-consumption ไม่ต่ำกว่า 30% แม้ใช้ไฟกลางวัน 0%", () => {
    const result = calculateFinancials(5, 5000, 1190, 0);
    expect(result.selfConsumptionPct).toBeCloseTo(0.3, 5);
  });

  it("paybackYears เป็น null เมื่อไม่มีเงินประหยัด (ป้องกันหารด้วย 0/ติดลบ)", () => {
    const result = calculateFinancials(5, 0, 0, 50);
    expect(result.savingsPerMonthBaht).toBeLessThanOrEqual(0);
    expect(result.paybackYears).toBeNull();
  });
});

describe("calculate25YearProjection", () => {
  it("ปีที่ 1 เท่ากับค่าตั้งต้น (ไม่มี degradation/inflation)", () => {
    const projection = calculate25YearProjection(9198, 3000, 1609.6);
    const year1 = projection[0];
    expect(year1.year).toBe(1);
    expect(year1.productionKwh).toBeCloseTo(9198, 0);
    expect(year1.billWithoutSolarBaht).toBeCloseTo(36000, 0);
  });

  it("ผลผลิตปีที่ 25 ลดลงจาก panel degradation", () => {
    const projection = calculate25YearProjection(9198, 3000, 1609.6);
    const year25 = projection[24];
    expect(year25.productionKwh).toBeLessThan(9198);
    expect(year25.productionKwh).toBeCloseTo(9198 * Math.pow(1 - 0.006, 24), 0);
  });

  it("ค่าไฟที่ไม่มีโซลาร์ปีที่ 25 สูงขึ้นจากเงินเฟ้อ 3%/ปี", () => {
    const projection = calculate25YearProjection(9198, 3000, 1609.6);
    const year25 = projection[24];
    expect(year25.billWithoutSolarBaht).toBeCloseTo(36000 * Math.pow(1.03, 24), 0);
  });

  it("มีข้อมูลครบ 25 ปี", () => {
    const projection = calculate25YearProjection(9198, 3000, 1609.6);
    expect(projection).toHaveLength(25);
  });
});
