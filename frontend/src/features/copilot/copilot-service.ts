import type { CopilotMessage, CopilotStats } from "./types";
import { queryMockReasoningEngine } from "./mockReasoningEngine";
import type { ExecutionPlan } from "@/features/planner";
import type { PaperResult, RAGContext } from "@/features/retrieval";
import type { EvidenceItem } from "@/features/evidence";
import type { KnowledgeGraph } from "@/features/knowledge-graph";

interface InputContext {
  plan: ExecutionPlan | null;
  retrievedPapers: PaperResult[];
  uploadedPdfs: any[];
  retrievedContext: RAGContext[];
  evidence: EvidenceItem[];
  knowledgeGraph: KnowledgeGraph | null;
}

const STORAGE_KEY_PREFIX = "airos_copilot_history_";

export const copilotService = {
  /**
   * Loads conversation history for the specified project.
   */
  loadHistory(projectId: string): CopilotMessage[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${projectId}`);
      if (data) {
        return JSON.parse(data) as CopilotMessage[];
      }
    } catch (e) {
      console.error("[COPILOT_SERVICE] Failed to load history:", e);
    }
    return [];
  },

  /**
   * Persists conversation history for the specified project.
   */
  saveHistory(projectId: string, history: CopilotMessage[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${projectId}`, JSON.stringify(history));
    } catch (e) {
      console.error("[COPILOT_SERVICE] Failed to save history:", e);
    }
  },

  /**
   * Answers a user query by calling the mock reasoning engine.
   */
  async askQuestion(
    projectId: string,
    questionText: string,
    context: InputContext
  ): Promise<CopilotMessage> {
    // 1. Construct user message
    const userMsg: CopilotMessage = {
      id: `msg-user-${Math.random().toString(36).substr(2, 9)}`,
      sender: "user",
      content: questionText,
      timestamp: new Date().toISOString(),
    };

    // Simulate small latency/delay (e.g. 1.2 seconds) to reflect realistic LLM generation
    await new Promise((r) => setTimeout(r, 1200));

    // 2. Query Mock Engine
    const mockAns = queryMockReasoningEngine(questionText, context);

    // 3. Construct copilot message
    const copilotMsg: CopilotMessage = {
      id: `msg-copilot-${Math.random().toString(36).substr(2, 9)}`,
      sender: "copilot",
      content: mockAns.content || "No supporting information exists inside the current project.",
      timestamp: new Date().toISOString(),
      sources: mockAns.sources || ["Project Memory"],
      confidence: mockAns.confidence ?? 0,
      relatedPapers: mockAns.relatedPapers || [],
      relatedEvidence: mockAns.relatedEvidence || [],
      relatedNodes: mockAns.relatedNodes || [],
      plannerRefs: mockAns.plannerRefs || [],
      rqRefs: mockAns.rqRefs || [],
    };

    return copilotMsg;
  },

  /**
   * Calculates real-time statistics from the active history buffer.
   */
  getStats(history: CopilotMessage[]): CopilotStats {
    const copilotAnswers = history.filter((m) => m.sender === "copilot");
    const userQuestions = history.filter((m) => m.sender === "user");

    const totalConfidence = copilotAnswers.reduce((sum, m) => sum + (m.confidence || 0), 0);
    const avgConfidence = copilotAnswers.length > 0 ? Math.round(totalConfidence / copilotAnswers.length) : 0;

    let papersRef = 0;
    let evidenceRef = 0;
    let nodesRef = 0;
    let memoryLookups = 0;

    copilotAnswers.forEach((m) => {
      if (m.relatedPapers) papersRef += m.relatedPapers.length;
      if (m.relatedEvidence) evidenceRef += m.relatedEvidence.length;
      if (m.relatedNodes) nodesRef += m.relatedNodes.length;
      if (m.sources && m.sources.includes("Project Memory")) {
        memoryLookups++;
      }
    });

    return {
      questionsAsked: userQuestions.length,
      answersGenerated: copilotAnswers.length,
      evidenceReferenced: evidenceRef,
      papersReferenced: papersRef,
      kgReferenced: nodesRef,
      memoryLookups,
      avgConfidence,
    };
  },
};
