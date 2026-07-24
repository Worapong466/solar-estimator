import { describe, it, expect } from "vitest";
import { recommendBattery } from "./battery";
import type { DetailedAssessmentAnswers } from "../types";

const baseAnswers: DetailedAssessmentAnswers = {
  touMeter: "no",
  evChargingTime: "none",
  daytimeUsagePct: 70,
  futureLoadOptions: [],
  workFromHome: "no",
  backupPowerNeeded: "no",
  evStatus: "none",
  roofSize: "medium",
};

describe("recommendBattery", () => {
  it("แนะนำแบตเตอรี่เมื่อต้องการไฟสำรอง", () => {
    const result = recommendBattery({ ...baseAnswers, backupPowerNeeded: "yes" });
    expect(result.recommended).toBe(true);
  });

  it("แนะนำแบตเตอรี่เมื่อชาร์จ EV ตอนกลางคืน", () => {
    const result = recommendBattery({ ...baseAnswers, evChargingTime: "night" });
    expect(result.recommended).toBe(true);
  });

  it("แนะนำแบตเตอรี่เมื่อใช้ไฟกลางคืนเป็นหลัก (daytime < 40%)", () => {
    const result = recommendBattery({ ...baseAnswers, daytimeUsagePct: 20 });
    expect(result.recommended).toBe(true);
  });

  it("ไม่แนะนำแบตเตอรี่เมื่อใช้ไฟกลางวันเป็นหลักและไม่ต้องการไฟสำรอง", () => {
    const result = recommendBattery(baseAnswers);
    expect(result.recommended).toBe(false);
  });

  it("ไม่แนะนำแบบเด็ดขาดเมื่อคำตอบไฟสำรองคือ 'อาจจะ' แต่ให้เหตุผลว่าพิจารณาภายหลังได้", () => {
    const result = recommendBattery({ ...baseAnswers, backupPowerNeeded: "maybe" });
    expect(result.recommended).toBe(false);
    expect(result.reason).toContain("ภายหลัง");
  });
});
