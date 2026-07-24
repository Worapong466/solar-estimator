import { describe, it, expect } from "vitest";
import { recommendSystem } from "./systemRecommendation";

describe("recommendSystem", () => {
  it("คำนวณจำนวนแผงจากขนาดระบบและ wattage ของแผง (550W)", () => {
    const result = recommendSystem(5.6);
    expect(result.panelCount).toBe(Math.ceil((5.6 * 1000) / 550)); // 11 แผง
    expect(result.panelWattageW).toBe(550);
  });

  it("เลือกขนาดอินเวอร์เตอร์มาตรฐานที่ >= ขนาดระบบเสมอ", () => {
    expect(recommendSystem(4.4).inverterSizeKw).toBe(5);
    expect(recommendSystem(5.6).inverterSizeKw).toBe(6);
    expect(recommendSystem(9.8).inverterSizeKw).toBe(10);
  });

  it("ใช้ขนาดอินเวอร์เตอร์ใหญ่สุดถ้าระบบเกินทุกขนาดมาตรฐาน", () => {
    expect(recommendSystem(50).inverterSizeKw).toBe(30);
  });

  it("คำนวณพื้นที่หลังคาที่ใช้ตามอัตรา 7 ตร.ม./kWp", () => {
    const result = recommendSystem(5.6);
    expect(result.roofAreaUsedSqm).toBeCloseTo(39.2, 5);
  });
});
