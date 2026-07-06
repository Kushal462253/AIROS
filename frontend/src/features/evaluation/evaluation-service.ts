import { mockEvaluationEngine } from "./mockEvaluationEngine";
import type { ExecutionPlan } from "@/features/planner";
import type { PaperResult } from "@/features/retrieval";
import type { EvidenceItem } from "@/features/evidence";
import type { KnowledgeGraph } from "@/features/knowledge-graph";

interface InputState {
  plan: ExecutionPlan | null;
  papers: PaperResult[];
  pdfs: any[];
  evidence: EvidenceItem[];
  knowledgeGraph: KnowledgeGraph | null;
  conversations: any[];
  securityScore: number;
}

export const evaluationService = {
  /**
   * Retrieves full system diagnostics.
   */
  getSystemEvaluation(input: InputState) {
    return mockEvaluationEngine.evaluateSystem(input);
  },
};
