export type {
  NavItem,
  ResearchProject,
  ResearchDepth,
  ResearchType,
  ProjectStatus,
  CreateResearchInput,
  WorkspaceSection,
} from "./types";

export {
  RESEARCH_DEPTH_LABELS,
  RESEARCH_TYPE_LABELS,
} from "./types";

export { ResearchProvider, useResearch } from "./context/research-context";
