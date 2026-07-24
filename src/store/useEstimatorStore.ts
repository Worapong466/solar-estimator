import { create } from "zustand";
import type { DetailedAssessmentAnswers, LeadInfo, QuickEstimateInput } from "../types";

export type WizardStep = "quickEstimate" | "leadCapture" | "detailedAssessment" | "results";

interface EstimatorState {
  step: WizardStep;
  quickEstimate: QuickEstimateInput | null;
  lead: LeadInfo | null;
  leadId: string | null;
  assessment: DetailedAssessmentAnswers | null;
  requestSubmitted: boolean;
  setQuickEstimate: (input: QuickEstimateInput) => void;
  resetQuickEstimate: () => void;
  goToLeadCapture: () => void;
  backToQuickEstimate: () => void;
  submitLead: (lead: LeadInfo, leadId: string) => void;
  submitAssessment: (answers: DetailedAssessmentAnswers) => void;
  backToLeadCapture: () => void;
  submitRequest: () => void;
}

export const useEstimatorStore = create<EstimatorState>((set) => ({
  step: "quickEstimate",
  quickEstimate: null,
  lead: null,
  leadId: null,
  assessment: null,
  requestSubmitted: false,
  setQuickEstimate: (input) => set({ quickEstimate: input }),
  resetQuickEstimate: () => set({ quickEstimate: null }),
  goToLeadCapture: () => set({ step: "leadCapture" }),
  backToQuickEstimate: () => set({ step: "quickEstimate" }),
  submitLead: (lead, leadId) => set({ lead, leadId, step: "detailedAssessment" }),
  submitAssessment: (answers) => set({ assessment: answers, step: "results" }),
  backToLeadCapture: () => set({ step: "leadCapture" }),
  submitRequest: () => set({ requestSubmitted: true }),
}));
