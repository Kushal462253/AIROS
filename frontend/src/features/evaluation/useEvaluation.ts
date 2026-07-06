import { useMemo } from "react";
import { evaluationService } from "./evaluation-service";
import type { ExecutionPlan } from "@/features/planner";
import type { PaperResult } from "@/features/retrieval";
import type { EvidenceItem } from "@/features/evidence";
import type { KnowledgeGraph } from "@/features/knowledge-graph";

interface UseEvaluationProps {
  plan: ExecutionPlan | null;
  papers: PaperResult[];
  pdfs: any[];
  evidence: EvidenceItem[];
  knowledgeGraph: KnowledgeGraph | null;
  conversations: any[];
  securityScore: number;
}

export function useEvaluation({
  plan,
  papers,
  pdfs,
  evidence,
  knowledgeGraph,
  conversations,
  securityScore,
}: UseEvaluationProps) {
  return useMemo(() => {
    return evaluationService.getSystemEvaluation({
      plan,
      papers,
      pdfs,
      evidence,
      knowledgeGraph,
      conversations,
      securityScore,
    });
  }, [
    plan,
    papers,
    pdfs,
    evidence,
    knowledgeGraph,
    conversations,
    securityScore,
  ]);
}
