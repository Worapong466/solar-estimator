import type { FutureLoadOption, RoofSize } from "../types";

// ทุกค่าคงที่ในการคำนวณ — แก้ตรงนี้ที่เดียว ดูที่มาของแต่ละค่าใน solar-estimator-spec.md
export const CONFIG = {
  ELECTRICITY_RATE_BAHT_PER_KWH: 4.2,
  KWH_PER_KWP_MONTH: 130,
  PRICE_PER_KWP_BAHT: 25000,
  PEAK_SUN_HOURS: 4.5,
  FEED_IN_TARIFF_BAHT_PER_KWH: 2.2,
  EMISSION_FACTOR_KG_CO2_PER_KWH: 0.5,
  INFLATION_RATE: 0.03,
  PANEL_DEGRADATION_RATE: 0.006,
  FUTURE_LOAD_CAP: 0.3,
  EV_PLANNED_BONUS: 0.1,
  BATTERY_PAYBACK_EXTENSION: 0.15,
  DEFAULT_DAYTIME_PCT: 50, // ใช้ตอน Quick Estimate ที่ยังไม่มีคำตอบแบบประเมินละเอียด
  PANEL_WATTAGE_W: 550,
  ROOF_AREA_SQM_PER_KWP: 7, // สอดคล้องกับที่มาของ ROOF_MAX_KWP ด้านล่าง
} as const;

export const STANDARD_INVERTER_SIZES_KW = [3, 5, 6, 8, 10, 15, 20, 30] as const;

export const ROOF_MAX_KWP: Record<RoofSize, number> = {
  small: 7,
  medium: 10,
  large: 20,
};

export const FUTURE_LOAD_INCREMENTS: Record<FutureLoadOption, number> = {
  aircon: 0.08,
  extension: 0.1,
  business: 0.12,
  machinery: 0.15,
};

export function daytimeMultiplier(daytimePct: number): number {
  return 0.5 + 0.006 * daytimePct;
}

export function selfConsumptionPct(daytimePct: number): number {
  const pct = 30 + 0.4 * daytimePct;
  return Math.min(70, Math.max(30, pct)) / 100;
}
