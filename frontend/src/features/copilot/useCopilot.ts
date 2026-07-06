import { useState, useEffect, useCallback } from "react";
import type { CopilotMessage, CopilotStats } from "./types";
import { copilotService } from "./copilot-service";
import { useMemory } from "@/features/memory";
import type { EvidenceItem } from "@/features/evidence";
import type { KnowledgeGraph } from "@/features/knowledge-graph";

import { mockSecurityEngine } from "@/features/security/mockSecurityEngine";
import type { QueryValidationResult } from "@/features/security/types";

interface UseCopilotProps {
  projectId: string;
  evidenceItems: EvidenceItem[];
  knowledgeGraph: KnowledgeGraph | null;
  onPromptSend?: (result: QueryValidationResult) => void;
}

export function useCopilot({
  projectId,
  evidenceItems,
  knowledgeGraph,
  onPromptSend,
}: UseCopilotProps) {
  const { memoryState, updateMemory } = useMemory();

  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // 1. Load history from memory on mount / projectId change
  useEffect(() => {
    if (!projectId) return;
    const history = copilotService.loadHistory(projectId);
    setMessages(history);
  }, [projectId]);

  // 2. Sync to local state if memory state changes externally
  useEffect(() => {
    if (memoryState.copilotConversations && memoryState.copilotConversations.length !== messages.length) {
      setMessages(memoryState.copilotConversations);
    }
  }, [memoryState.copilotConversations, messages.length]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !projectId) return;

      // Create user message object
      const userMsg: CopilotMessage = {
        id: `msg-user-${Math.random().toString(36).substr(2, 9)}`,
        sender: "user",
        content: text,
        timestamp: new Date().toISOString(),
      };

      const updatedHistory = [...messages, userMsg];
      setMessages(updatedHistory);
      setIsTyping(true);

      // Call copilotService to ask the question
      const context = {
        plan: memoryState.plannerOutput,
        retrievedPapers: memoryState.retrievedPapers,
        uploadedPdfs: memoryState.uploadedPdfs,
        retrievedContext: memoryState.retrievedContext,
        evidence: evidenceItems,
        knowledgeGraph,
      };

      try {
        if (onPromptSend) {
          const validation = mockSecurityEngine.detectPromptInjection(text);
          onPromptSend(validation);
        }

        const copilotMsg = await copilotService.askQuestion(projectId, text, context);
        const finalHistory = [...updatedHistory, copilotMsg];

        setMessages(finalHistory);
        copilotService.saveHistory(projectId, finalHistory);

        // Update Project Memory fields
        const count = finalHistory.filter((m) => m.sender === "user").length;
        updateMemory({
          copilotConversations: finalHistory,
          lastUserQuestion: userMsg.content,
          lastAiResponse: copilotMsg.content,
          conversationCount: count,
        });
      } catch (e) {
        console.error("[USE_COPILOT] Error sending message:", e);
      } finally {
        setIsTyping(false);
      }
    },
    [messages, projectId, memoryState, evidenceItems, knowledgeGraph, updateMemory]
  );

  const clearHistory = useCallback(() => {
    if (!projectId) return;
    setMessages([]);
    copilotService.saveHistory(projectId, []);
    updateMemory({
      copilotConversations: [],
      lastUserQuestion: undefined,
      lastAiResponse: undefined,
      conversationCount: 0,
    });
  }, [projectId, updateMemory]);

  // Compute live stats
  const stats: CopilotStats = copilotService.getStats(messages);

  return {
    messages,
    isTyping,
    sendMessage,
    clearHistory,
    stats,
  };
}
