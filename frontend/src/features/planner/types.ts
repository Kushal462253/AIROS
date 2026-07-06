export type StageStatus = "pending" | "running" | "completed";

export interface PlanningStage {
  id: string;
  name: string;
  status: StageStatus;
}

export type AIAgentName =
  | "Planner"
  | "Retrieval"
  | "Evidence"
  | "Knowledge Graph"
  | "Memory"
  | "Copilot";

export interface SelectedAgent {
  name: AIAgentName;
  purpose: string;
  status: "idle" | "active" | "completed" | "initializing";
  importanceScore: number; // percentage (0 - 100)
  reasonSelected: string;
}

export interface ExecutionPlan {
  summary: string;
  objectives: string[];
  researchQuestions: string[];
  searchStrategy: {
    keywords: string[];
    suggestedSources: string[];
    searchPriority: "High" | "Medium" | "Low";
    expectedEvidence: string;
  };
  estimatedRuntime: string;
  researchComplexity: "Low" | "Medium" | "High" | "Extreme";
  confidenceScore: number; // percentage (0 - 100)
  selectedAgents: SelectedAgent[];
}
