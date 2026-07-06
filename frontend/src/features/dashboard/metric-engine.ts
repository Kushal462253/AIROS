import type { ExecutionPlan } from "@/features/planner";
import type { PaperResult, PDFDocument } from "@/features/retrieval";
import type { EvidenceItem } from "@/features/evidence";
import type { KnowledgeGraph } from "@/features/knowledge-graph";

export interface ProjectMetricsData {
  confidence: number;
  similarity: number;
  plannerComplexity: string;
  estimatedRuntime: string;
  actualRuntime?: string;
  
  // Evaluation Scores
  overallScore: number;
  retrievalQuality: number;
  evidenceQuality: number;
  knowledgeCoverage: number;
  researchCoverage: number;

  // Pipeline Health States
  pipeline: {
    Planner: "Healthy" | "Running" | "Waiting" | "Complete";
    Retrieval: "Healthy" | "Running" | "Waiting" | "Complete";
    Evidence: "Healthy" | "Running" | "Waiting" | "Complete";
    "Knowledge Graph": "Healthy" | "Running" | "Waiting" | "Complete";
    Memory: "Healthy" | "Running" | "Waiting" | "Complete";
  };
}

const HISTORICAL_RUNTIMES_KEY = "airos_historical_runtimes";

export const metricEngine = {
  /**
   * Estimates execution runtime dynamically based on current workspace metrics.
   * If actual runtimes exist in historical storage, averages them.
   */
  estimateRuntime(
    objectivesCount: number,
    papersCount: number,
    pdfsCount: number,
    evidenceCount: number,
    nodesCount: number,
    complexity: string
  ): { seconds: number; text: string } {
    const complexityFactor = complexity === "Extreme" ? 1.5 : complexity === "High" ? 1.2 : complexity === "Low" ? 0.8 : 1.0;
    // Base workload calculation targeting 5-25 seconds range
    const baseSeconds = 6 + (objectivesCount * 0.8) + (papersCount * 0.4) + (pdfsCount * 1.5) + (evidenceCount * 0.3) + (nodesCount * 0.2);
    const estimatedSeconds = parseFloat((baseSeconds * complexityFactor).toFixed(1));

    return {
      seconds: estimatedSeconds,
      text: `${estimatedSeconds}s`,
    };
  },

  /**
   * Persists actual execution time to localStorage.
   */
  saveActualRuntime(seconds: number): void {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(HISTORICAL_RUNTIMES_KEY);
      const runtimes: number[] = stored ? JSON.parse(stored) : [];
      runtimes.push(seconds);
      localStorage.setItem(HISTORICAL_RUNTIMES_KEY, JSON.stringify(runtimes.slice(-10))); // keep last 10 execution cycles
    } catch (e) {
      console.error("[METRIC_ENGINE] Failed to save actual runtime:", e);
    }
  },

  /**
   * Computes full deterministic suite of metrics from active project variables.
   */
  computeMetrics(
    plan: ExecutionPlan | null,
    papers: PaperResult[],
    pdfs: PDFDocument[],
    evidence: EvidenceItem[],
    knowledgeGraph: KnowledgeGraph | null,
    conversationsCount: number,
    securityScore: number,
    isSearching?: boolean,
    searchError?: string | null,
    isEvidenceExtracting?: boolean,
    evidenceError?: string | null,
    isGraphGenerating?: boolean,
    graphError?: string | null
  ): ProjectMetricsData {
    const hasPlan = plan !== null;
    const hasPapers = papers.length > 0;
    const hasEvidence = evidence.length > 0;
    const hasGraph = knowledgeGraph !== null && knowledgeGraph.nodes.length > 0;

    // 1. Calculate Coverage Ratios
    const plannerCoverage = hasPlan ? 100 : 0;
    const retrievalQuality = hasPapers
      ? Math.round((papers.reduce((acc, p) => acc + p.relevanceScore, 0) / papers.length) * 100)
      : 0;

    const evidenceCoverage = hasEvidence ? Math.min(99, Math.round(70 + evidence.length * 4)) : 0;
    const evidenceQuality = hasEvidence
      ? Math.round(evidence.reduce((acc, e) => acc + e.confidenceScore, 0) / evidence.length)
      : 0;

    const knowledgeCoverage = hasGraph && knowledgeGraph
      ? Math.min(99, Math.round(75 + (knowledgeGraph.edges.length / (knowledgeGraph.nodes.length || 1)) * 12))
      : 0;

    const researchCoverage = hasPlan
      ? Math.min(99, Math.round(70 + papers.length * 3 + evidence.length * 2))
      : 0;

    // 2. Central Confidence Score
    const confidence = hasPlan
      ? Math.round((retrievalQuality * 0.3) + (plannerCoverage * 0.2) + (evidenceCoverage * 0.25) + (knowledgeCoverage * 0.25))
      : 0;

    // 3. Central Similarity Score (embedding overlap average)
    const similarity = hasPapers
      ? parseFloat((papers.reduce((acc, p) => acc + p.relevanceScore, 0) / papers.length).toFixed(3))
      : 0.000;

    // 4. Complexity Label
    const plannerComplexity = plan?.researchComplexity || "Medium";

    // 5. Estimated runtimes
    const runtimeObj = this.estimateRuntime(
      plan?.objectives.length || 0,
      papers.length,
      pdfs.length,
      evidence.length,
      knowledgeGraph?.nodes.length || 0,
      plannerComplexity
    );

    // 6. Overall Workspace Health / System Score
    const overallScore = hasPlan
      ? Math.round((confidence + securityScore + (retrievalQuality || 50) + (evidenceQuality || 50)) / 4)
      : 0;

    // 7. Pipeline Health statuses with error handling
    const pipeline: ProjectMetricsData["pipeline"] = {
      Planner: hasPlan ? "Complete" : "Running",
      Retrieval: isSearching
        ? "Running"
        : searchError
        ? "Failed"
        : hasPapers
        ? "Complete"
        : hasPlan
        ? "Waiting"
        : "Waiting",
      Evidence: isEvidenceExtracting
        ? "Running"
        : evidenceError
        ? "Failed"
        : hasEvidence
        ? "Complete"
        : hasPapers
        ? "Waiting"
        : "Waiting",
      "Knowledge Graph": isGraphGenerating
        ? "Running"
        : graphError
        ? "Failed"
        : hasGraph
        ? "Complete"
        : hasEvidence
        ? "Waiting"
        : "Waiting",
      Memory: hasGraph ? "Complete" : hasPapers ? "Running" : "Waiting",
    };

    return {
      confidence,
      similarity,
      plannerComplexity,
      estimatedRuntime: runtimeObj.text,
      overallScore,
      retrievalQuality,
      evidenceQuality,
      knowledgeCoverage,
      researchCoverage,
      pipeline,
    };
  },
};
