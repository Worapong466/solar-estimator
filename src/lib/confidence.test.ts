import { describe, it, expect } from "vitest";
import { calculateConfidence } from "./confidence";

describe("calculateConfidence", () => {
  it("คะแนนเป็น 0 เมื่อยังไม่ตอบอะไรเลย", () => {
    const result = calculateConfidence({}, {});
    expect(result.score).toBe(0);
    expect(result.maxScore).toBe(100);
  });

  it("คะแนน 55 ทันทีหลังจบ Quick Estimate (ค่าไฟ+ประเภทอาคาร+จังหวัด)", () => {
    const result = calculateConfidence(
      { monthlyBillBaht: 3000, propertyType: "house", province: "กรุงเทพมหานคร" },
      {}
    );
    expect(result.score).toBe(55);
  });

  it("คะแนนเต็ม 100 เมื่อตอบครบทั้ง 7 ฟิลด์กลุ่ม A", () => {
    const result = calculateConfidence(
      { monthlyBillBaht: 3000, propertyType: "house", province: "กรุงเทพมหานคร" },
      { daytimeUsagePct: 50, roofSize: "medium", futureLoadOptions: ["aircon"], evStatus: "planning" }
    );
    expect(result.score).toBe(100);
  });

  it("futureLoadOptions ที่เป็น array ว่าง (เลือก 'ไม่มี') ถือว่าตอบแล้ว", () => {
    const result = calculateConfidence(
      { monthlyBillBaht: 3000, propertyType: "house", province: "กรุงเทพมหานคร" },
      { daytimeUsagePct: 50, roofSize: "medium", futureLoadOptions: [], evStatus: "none" }
    );
    expect(result.score).toBe(100);
  });
});
