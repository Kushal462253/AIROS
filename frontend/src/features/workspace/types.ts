export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: number;
}

export type ResearchDepth = "quick" | "standard" | "comprehensive";

export type ProjectStatus = "planning" | "active" | "completed" | "archived";

export interface ResearchProject {
  id: string;
  title: string;
  topic: string;
  description: string;
  researchDepth: ResearchDepth;
  researchType?: string;
  uploadedPdfName: string | null;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  paperCount: number;
  tags: string[];
  favorite?: boolean;
  pinned?: boolean;
  archived?: boolean;
  collectionIds?: string[];
}

export interface CreateResearchInput {
  title: string;
  topic: string;
  description: string;
  researchDepth: ResearchDepth;
  researchType?: string;
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
