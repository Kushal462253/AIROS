import type { ResearchProject } from "@/features/workspace";
import type { ExecutionPlan } from "@/features/planner";
import type { PaperResult, PDFDocument, RAGContext } from "@/features/retrieval";

import type { EvidenceItem } from "@/features/evidence";
import type { KnowledgeGraph } from "@/features/knowledge-graph";











export interface CopilotMessage {
  id: string;
  sender: "user" | "copilot";
  content: string;
  timestamp: string;
}

export interface MemoryState {
  projectMetadata: ResearchProject | null;
  plannerOutput: ExecutionPlan | null;
  retrievedPapers: PaperResult[];
  uploadedPdfs: PDFDocument[];
  retrievedContext: RAGContext[];
  
  // Future compatibility slots for downstream agents
  evidence?: EvidenceItem[];
  knowledgeGraph?: KnowledgeGraph;
  copilotConversations?: CopilotMessage[];
  lastUserQuestion?: string;
  lastAiResponse?: string;
  conversationCount?: number;
}

export interface MemoryStatus {
  status: "idle" | "active" | "synced";
  lastUpdated: string;
  objectsCount: number;
  papersCount: number;
  plansCount: number;
}
