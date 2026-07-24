import { describe, it, expect } from "vitest";
import { calculateQuickEstimateSizing, calculateFullSizing, computeFutureLoadPct, computeEvPct } from "./sizing";

describe("calculateQuickEstimateSizing", () => {
  it("คำนวณขนาดเบื้องต้นด้วย default daytime 50%", () => {
    const result = calculateQuickEstimateSizing(3000);
    expect(result.kWhMonthly).toBeCloseTo(714.29, 1);
    expect(result.baseKwp).toBeCloseTo(5.4945, 3);
    expect(result.daytimeMultiplier).toBeCloseTo(0.8, 5);
    expect(result.adjustedKwp).toBeCloseTo(4.3956, 3);
    expect(result.finalKwp).toBe(4.4);
    expect(result.roofCapKwp).toBeNull();
  });
});

describe("computeFutureLoadPct", () => {
  it("รวม % ตามตัวเลือกที่ส่งมา", () => {
    expect(computeFutureLoadPct(["aircon"])).toBeCloseTo(0.08, 5);
    expect(computeFutureLoadPct(["aircon", "extension"])).toBeCloseTo(0.18, 5);
    expect(computeFutureLoadPct([])).toBe(0);
  });

  it("จำกัดเพดานไม่เกิน 30% แม้เลือกครบทุกข้อ", () => {
    const total = computeFutureLoadPct(["aircon", "extension", "business", "machinery"]);
    expect(total).toBe(0.3);
  });
});

describe("computeEvPct", () => {
  it("บวก bonus เฉพาะกรณีวางแผนซื้อ ไม่บวกถ้ามีแล้วหรือไม่มีแผน", () => {
    expect(computeEvPct("planning")).toBe(0.1);
    expect(computeEvPct("owned")).toBe(0);
    expect(computeEvPct("none")).toBe(0);
  });
});

describe("calculateFullSizing", () => {
  it("คำนวณขนาดระบบเต็มรูปแบบตามตัวอย่างในสเปก (3,000 บาท/เดือน, หลังคากลาง)", () => {
    const result = calculateFullSizing(3000, {
      daytimeUsagePct: 50,
      futureLoadOptions: ["aircon", "extension"],
      evStatus: "planning",
      roofSize: "medium",
    });

    expect(result.futureLoadPct).toBeCloseTo(0.18, 5);
    expect(result.evPct).toBeCloseTo(0.1, 5);
    expect(result.sizedKwp).toBeCloseTo(5.6263, 3);
    expect(result.roofCapKwp).toBe(10);
    expect(result.finalKwp).toBe(5.6);
  });

  it("จำกัดขนาดสุดท้ายด้วยเพดานหลังคาเมื่อคำนวณได้เกิน", () => {
    const result = calculateFullSizing(20000, {
      daytimeUsagePct: 100,
      futureLoadOptions: ["aircon", "extension", "business", "machinery"],
      evStatus: "planning",
      roofSize: "small",
    });

    expect(result.roofCapKwp).toBe(7);
    expect(result.finalKwp).toBe(7);
    expect(result.sizedKwp).toBeGreaterThan(7);
  });

  it("ไม่บวก EV bonus ซ้ำเมื่อมีรถ EV อยู่แล้ว (owned)", () => {
    const owned = calculateFullSizing(3000, {
      daytimeUsagePct: 50,
      futureLoadOptions: [],
      evStatus: "owned",
      roofSize: "large",
    });
    const none = calculateFullSizing(3000, {
      daytimeUsagePct: 50,
      futureLoadOptions: [],
      evStatus: "none",
      roofSize: "large",
    });
    expect(owned.finalKwp).toBe(none.finalKwp);
  });
});
