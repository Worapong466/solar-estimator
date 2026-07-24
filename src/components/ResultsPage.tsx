import { useEstimatorStore } from "../store/useEstimatorStore";
import { calculateFullSizing } from "../lib/sizing";
import { calculateFinancials, calculate25YearProjection } from "../lib/financial";
import { calculateConfidence } from "../lib/confidence";
import { recommendSystem } from "../lib/systemRecommendation";
import { recommendBattery } from "../lib/battery";
import { CalculationExplainerCard } from "./results/CalculationExplainerCard";
import { RecommendedSystemCard } from "./results/RecommendedSystemCard";
import { FinancialBenefitsCard } from "./results/FinancialBenefitsCard";
import { YearlyComparisonChart } from "./results/YearlyComparisonChart";
import { CarbonExcessCard } from "./results/CarbonExcessCard";
import { BatteryRecommendationCard } from "./results/BatteryRecommendationCard";
import { SubmitRequestButton } from "./results/SubmitRequestButton";

export function ResultsPage() {
  const quickEstimate = useEstimatorStore((s) => s.quickEstimate)!;
  const assessment = useEstimatorStore((s) => s.assessment)!;

  const sizing = calculateFullSizing(quickEstimate.monthlyBillBaht, assessment);
  const financial = calculateFinancials(sizing.finalKwp, quickEstimate.monthlyBillBaht, sizing.kWhMonthly, assessment.daytimeUsagePct);
  const projection = calculate25YearProjection(financial.annualProductionKwh, quickEstimate.monthlyBillBaht, financial.savingsPerMonthBaht);
  const confidence = calculateConfidence(quickEstimate, assessment);
  const systemRec = recommendSystem(sizing.finalKwp);
  const batteryRec = recommendBattery(assessment);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <CalculationExplainerCard confidence={confidence} sizing={sizing} quickEstimate={quickEstimate} assessment={assessment} />
      <RecommendedSystemCard sizing={sizing} systemRec={systemRec} financial={financial} />
      <FinancialBenefitsCard financial={financial} projection={projection} />
      <YearlyComparisonChart projection={projection} />
      <CarbonExcessCard financial={financial} />
      <BatteryRecommendationCard battery={batteryRec} />
      <SubmitRequestButton />
    </div>
  );
}
