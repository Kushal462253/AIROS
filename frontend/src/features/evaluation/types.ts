export type SystemStatusType = "Healthy" | "Warning" | "Degraded" | "Offline";

export interface SystemMetrics {
  overallScore: number; // 0 to 100
  pipelineCompletion: number; // 0 to 100
  agentHealth: number; // 0 to 100
  memoryHealth: number; // 0 to 100
  retrievalQuality: number; // 0 to 100
  evidenceQuality: number; // 0 to 100
  kgCoverage: number; // 0 to 100
  copilotReadiness: number; // 0 to 100
  securityStatus: number; // 0 to 100
}

export type ModuleStatusType = "Healthy" | "Running" | "Waiting" | "Complete";

export interface PipelineHealthState {
  Planner: ModuleStatusType;
  Retrieval: ModuleStatusType;
  Evidence: ModuleStatusType;
  "Knowledge Graph": ModuleStatusType;
  "Research Copilot": ModuleStatusType;
}

export interface QualityMetricsState {
  evidenceCoverage: number; // percentage
  paperCoverage: number; // percentage
  memoryCoverage: number; // percentage
  knowledgeConnectivity: number; // connections per node
  avgConfidence: number; // percentage
  avgRetrievalScore: number; // percentage
  avgGraphConnectivity: number; // connections density
}

export interface PerformanceState {
  plannerRuntime: string;
  retrievalRuntime: string;
  evidenceRuntime: string;
  kgRuntime: string;
  avgQueryTime: string;
  memoryAccessTime: string;
  totalExecutionTime: string;
}

export interface ProjectInsightsState {
  objectivesCount: number;
  pdfsCount: number;
  papersCount: number;
  evidenceCount: number;
  kgNodesCount: number;
  kgEdgesCount: number;
  conversationsCount: number;
}
