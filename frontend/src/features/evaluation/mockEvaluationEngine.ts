import type {
  SystemMetrics,
  PipelineHealthState,
  QualityMetricsState,
  PerformanceState,
  ProjectInsightsState,
  SystemStatusType,
  ModuleStatusType,
} from "./types";
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

export const mockEvaluationEngine = {
  /**
   * Evaluates overall system scores based on completed phases.
   */
  evaluateSystem(input: InputState) {
    const hasPlan = input.plan !== null;
    const hasPapers = input.papers.length > 0;
    const hasEvidence = input.evidence.length > 0;
    const hasGraph = input.knowledgeGraph !== null && input.knowledgeGraph.nodes.length > 0;

    // 1. Pipeline Completion
    let pipelineCompletion = 0;
    if (hasPlan) pipelineCompletion += 20;
    if (hasPapers) pipelineCompletion += 20;
    if (hasEvidence) pipelineCompletion += 20;
    if (hasGraph) pipelineCompletion += 20;
    if (hasGraph && input.conversations.length > 0) pipelineCompletion += 20;
    else if (hasGraph) pipelineCompletion += 10;

    // 2. Health allocations
    const plannerStatus: ModuleStatusType = hasPlan ? "Complete" : "Running";
    const retrievalStatus: ModuleStatusType = hasPapers ? "Complete" : hasPlan ? "Running" : "Waiting";
    const evidenceStatus: ModuleStatusType = hasEvidence ? "Complete" : hasPapers ? "Running" : "Waiting";
    const kgStatus: ModuleStatusType = hasGraph ? "Complete" : hasEvidence ? "Running" : "Waiting";
    const copilotStatus: ModuleStatusType = hasGraph ? (input.conversations.length > 0 ? "Complete" : "Healthy") : "Waiting";

    const pipelineHealth: PipelineHealthState = {
      Planner: plannerStatus,
      Retrieval: retrievalStatus,
      Evidence: evidenceStatus,
      "Knowledge Graph": kgStatus,
      "Research Copilot": copilotStatus,
    };

    // 3. System Status
    let systemStatus: SystemStatusType = "Offline";
    if (hasPlan) {
      systemStatus = "Healthy";
    } else {
      systemStatus = "Degraded";
    }

    // 4. System Metrics
    const agentHealth = hasGraph ? 98 : hasEvidence ? 95 : hasPlan ? 90 : 70;
    const memoryHealth = hasGraph ? 99 : hasPapers ? 96 : 85;
    
    // Average relevance score of papers
    const retrievalQuality = hasPapers
      ? Math.round((input.papers.reduce((acc, p) => acc + p.relevanceScore, 0) / input.papers.length) * 100)
      : 0;

    // Average evidence confidence
    const evidenceQuality = hasEvidence
      ? Math.round(input.evidence.reduce((acc, e) => acc + e.confidenceScore, 0) / input.evidence.length)
      : 0;

    // Graph coverage ratio based on connectedness
    const kgCoverage = hasGraph && input.knowledgeGraph
      ? Math.min(99, Math.round(75 + (input.knowledgeGraph.edges.length / (input.knowledgeGraph.nodes.length || 1)) * 12))
      : 0;

    const copilotReadiness = hasGraph ? 100 : 0;
    
    const overallScore = Math.round(
      (pipelineCompletion + agentHealth + memoryHealth + input.securityScore + (retrievalQuality || 50) + (evidenceQuality || 50)) / 6
    );

    const metrics: SystemMetrics = {
      overallScore: Math.min(overallScore, 100),
      pipelineCompletion,
      agentHealth,
      memoryHealth,
      retrievalQuality,
      evidenceQuality,
      kgCoverage,
      copilotReadiness,
      securityStatus: input.securityScore,
    };

    // 5. Quality Metrics
    const evidenceCoverage = hasEvidence ? Math.min(98, Math.round(65 + input.evidence.length * 3.5)) : 0;
    const paperCoverage = hasPapers ? Math.min(98, Math.round(70 + input.papers.length * 2.5)) : 0;
    
    let slotsFilled = 0;
    if (hasPlan) slotsFilled++;
    if (hasPapers) slotsFilled++;
    if (input.pdfs.length > 0) slotsFilled++;
    if (hasEvidence) slotsFilled++;
    if (hasGraph) slotsFilled++;
    if (input.conversations.length > 0) slotsFilled++;
    const memoryCoverage = Math.round((slotsFilled / 6) * 100);
    
    let knowledgeConnectivity = 0;
    if (hasGraph && input.knowledgeGraph) {
      const nodesCount = input.knowledgeGraph.nodes.length;
      const edgesCount = input.knowledgeGraph.edges.length;
      knowledgeConnectivity = nodesCount > 0 ? parseFloat((edgesCount * 2 / nodesCount).toFixed(2)) : 0;
    }

    const quality: QualityMetricsState = {
      evidenceCoverage,
      paperCoverage,
      memoryCoverage,
      knowledgeConnectivity,
      avgConfidence: hasEvidence ? evidenceQuality : hasPlan ? 85 : 0,
      avgRetrievalScore: hasPapers ? retrievalQuality : 0,
      avgGraphConnectivity: hasGraph && input.knowledgeGraph
        ? parseFloat((input.knowledgeGraph.edges.length / (input.knowledgeGraph.nodes.length * (input.knowledgeGraph.nodes.length - 1) || 1)).toFixed(3))
        : 0,
    };

    // 6. Performance state (dynamic calculations based on workload sizes)
    const plannerRuntime = "0m 05s";
    
    const retTime = hasPapers ? Math.round(15 + input.papers.length * 8) : 0;
    const retrievalRuntime = `0m ${retTime.toString().padStart(2, "0")}s`;
    
    const evTime = hasEvidence ? Math.round(12 + input.evidence.length * 6) : 0;
    const evidenceRuntime = `0m ${evTime.toString().padStart(2, "0")}s`;
    
    const kgTime = hasGraph && input.knowledgeGraph ? Math.round(25 + input.knowledgeGraph.nodes.length * 6) : 0;
    const kgRuntime = `${Math.floor(kgTime / 60)}m ${(kgTime % 60).toString().padStart(2, "0")}s`;
    
    const avgQueryTime = hasPapers ? `${(1.2 + input.papers.length * 0.08).toFixed(1)}s` : "0.0s";
    const memoryAccessTime = `${(1.5 + slotsFilled * 0.15).toFixed(1)}ms`;
    
    const totalSecs = 5 + retTime + evTime + kgTime;
    const totalExecutionTime = `${Math.floor(totalSecs / 60)}m ${(totalSecs % 60).toString().padStart(2, "0")}s`;

    const performance: PerformanceState = {
      plannerRuntime,
      retrievalRuntime,
      evidenceRuntime,
      kgRuntime,
      avgQueryTime,
      memoryAccessTime,
      totalExecutionTime,
    };

    // 7. Project Insights counts
    const insights: ProjectInsightsState = {
      objectivesCount: input.plan ? input.plan.objectives.length : 0,
      pdfsCount: input.pdfs.length,
      papersCount: input.papers.length,
      evidenceCount: input.evidence.length,
      kgNodesCount: input.knowledgeGraph ? input.knowledgeGraph.nodes.length : 0,
      kgEdgesCount: input.knowledgeGraph ? input.knowledgeGraph.edges.length : 0,
      conversationsCount: input.conversations.length,
    };

    return {
      metrics,
      pipelineHealth,
      quality,
      performance,
      insights,
      systemStatus,
    };
  },
};
