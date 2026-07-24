import { useEstimatorStore } from "./store/useEstimatorStore";
import { QuickEstimateWidget } from "./components/QuickEstimateWidget";
import { LeadCaptureForm } from "./components/LeadCaptureForm";
import { DetailedAssessmentForm } from "./components/DetailedAssessmentForm";
import { ResultsPage } from "./components/ResultsPage";

export default function App() {
  const step = useEstimatorStore((s) => s.step);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <header className="mx-auto mb-8 max-w-xl text-center">
        <h1 className="text-2xl font-bold text-slate-900">Solar Estimator</h1>
        <p className="mt-1 text-sm text-slate-500">ประเมินขนาดระบบโซลาร์เซลล์และผลตอบแทนการลงทุน</p>
      </header>

      {step === "quickEstimate" && <QuickEstimateWidget />}
      {step === "leadCapture" && <LeadCaptureForm />}
      {step === "detailedAssessment" && <DetailedAssessmentForm />}
      {step === "results" && <ResultsPage />}
    </div>
  );
}
