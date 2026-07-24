import { CONFIG, STANDARD_INVERTER_SIZES_KW } from "../config/constants";
import type { SystemRecommendation } from "../types";

export function recommendSystem(finalKwp: number): SystemRecommendation {
  const panelCount = Math.ceil((finalKwp * 1000) / CONFIG.PANEL_WATTAGE_W);
  const inverterSizeKw =
    STANDARD_INVERTER_SIZES_KW.find((size) => size >= finalKwp) ??
    STANDARD_INVERTER_SIZES_KW[STANDARD_INVERTER_SIZES_KW.length - 1];
  const roofAreaUsedSqm = finalKwp * CONFIG.ROOF_AREA_SQM_PER_KWP;

  return { panelCount, panelWattageW: CONFIG.PANEL_WATTAGE_W, inverterSizeKw, roofAreaUsedSqm };
}
