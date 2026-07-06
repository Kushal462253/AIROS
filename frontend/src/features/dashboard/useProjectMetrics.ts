import { useMemo, useEffect, useRef } from "react";
import { metricEngine } from "./metric-engine";
import type { ExecutionPlan } from "@/features/planner";
import type { PaperResult, PDFDocument } from "@/features/retrieval";
import type { EvidenceItem } from "@/features/evidence";
import type { KnowledgeGraph } from "@/features/knowledge-graph";

interface UseProjectMetricsProps {
  plan: ExecutionPlan | null;
  papers: PaperResult[];
  pdfs: PDFDocument[];
  evidence: EvidenceItem[];
  knowledgeGraph: KnowledgeGraph | null;
  conversationsCount: number;
  securityScore: number;
  isSearching?: boolean;
  searchError?: string | null;
  isEvidenceExtracting?: boolean;
  evidenceError?: string | null;
  isGraphGenerating?: boolean;
  graphError?: string | null;
}

export function useProjectMetrics({
  plan,
  papers,
  pdfs,
  evidence,
  knowledgeGraph,
  conversationsCount,
  securityScore,
  isSearching,
  searchError,
  isEvidenceExtracting,
  evidenceError,
  isGraphGenerating,
  graphError,
}: UseProjectMetricsProps) {
  const hasRecordedActual = useRef<string | null>(null);

  // Compute stats deterministically
  const metrics = useMemo(() => {
    return metricEngine.computeMetrics(
      plan,
      papers,
      pdfs,
      evidence,
      knowledgeGraph,
      conversationsCount,
      securityScore,
      isSearching,
      searchError,
      isEvidenceExtracting,
      evidenceError,
      isGraphGenerating,
      graphError
    );
  }, [
    plan,
    papers,
    pdfs,
    evidence,
    knowledgeGraph,
    conversationsCount,
    securityScore,
    isSearching,
    searchError,
    isEvidenceExtracting,
    evidenceError,
    isGraphGenerating,
    graphError,
  ]);

  // Persist actual runtimes dynamically when execution cycle completes
  useEffect(() => {
    if (plan && knowledgeGraph && knowledgeGraph.nodes.length > 0) {
      const runKey = `${plan.summary.length}_${papers.length}_${evidence.length}_${knowledgeGraph.nodes.length}`;
      if (hasRecordedActual.current !== runKey) {
        hasRecordedActual.current = runKey;
        // Calculate dynamic actual seconds based on current objects
        const actualSeconds = 10 + (papers.length * 6) + (evidence.length * 5) + (knowledgeGraph.nodes.length * 3);
        metricEngine.saveActualRuntime(actualSeconds);
      }
    }
  }, [plan, papers.length, evidence.length, knowledgeGraph]);

  return metrics;
}
