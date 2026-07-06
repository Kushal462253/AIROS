export type CopilotSourceType =
  | "Planner"
  | "Evidence"
  | "Knowledge Graph"
  | "Retrieved Papers"
  | "Uploaded PDF"
  | "Project Memory";

export interface CopilotMessage {
  id: string;
  sender: "user" | "copilot";
  content: string;
  timestamp: string;
  sources?: CopilotSourceType[];
  confidence?: number; // percentage (0 - 100)
  relatedPapers?: string[];
  relatedEvidence?: string[];
  relatedNodes?: string[];
  plannerRefs?: string[];
  rqRefs?: string[];
}

export interface CopilotStats {
  questionsAsked: number;
  answersGenerated: number;
  evidenceReferenced: number;
  papersReferenced: number;
  kgReferenced: number;
  memoryLookups: number;
  avgConfidence: number;
}
