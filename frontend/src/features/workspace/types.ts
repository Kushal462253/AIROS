export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: number;
}

export type ResearchDepth = "quick" | "standard" | "comprehensive";

export type ResearchType =
  | "literature_review"
  | "comparison"
  | "hypothesis_generation"
  | "research_gap_analysis"
  | "general_research";

export type ProjectStatus = "planning" | "active" | "completed" | "archived";

export interface ResearchProject {
  id: string;
  title: string;
  topic: string;
  description: string;
  researchDepth: ResearchDepth;
  researchType: ResearchType;
  uploadedPdfName: string | null;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  paperCount: number;
  tags: string[];
}

export interface CreateResearchInput {
  title: string;
  topic: string;
  description: string;
  researchDepth: ResearchDepth;
  researchType: ResearchType;
  uploadedPdfName: string | null;
}

export type WorkspaceSection =
  | "research"
  | "collections"
  | "favorites"
  | "archived"
  | "settings";

export const RESEARCH_DEPTH_LABELS: Record<ResearchDepth, string> = {
  quick: "Quick",
  standard: "Standard",
  comprehensive: "Comprehensive",
};

export const RESEARCH_TYPE_LABELS: Record<ResearchType, string> = {
  literature_review: "Literature Review",
  comparison: "Comparison",
  hypothesis_generation: "Hypothesis Generation",
  research_gap_analysis: "Research Gap Analysis",
  general_research: "General Research",
};
