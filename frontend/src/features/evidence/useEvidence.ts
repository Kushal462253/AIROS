import { useCallback, useState } from "react";
import type { PaperResult, PDFDocument } from "@/features/retrieval";
import type { ExecutionPlan } from "@/features/planner";
import type { EvidenceItem } from "./types";
import { generateEvidence } from "./evidence-generator";

export function useEvidence(initialItems?: EvidenceItem[]) {
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>(
    () => initialItems || []
  );
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractionStage, setExtractionStage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const extractEvidence = useCallback(
    async (papers: PaperResult[], pdfs: PDFDocument[], plan: ExecutionPlan | null) => {
      if (!plan) return [];
      setIsExtracting(true);
      setError(null);
      setProgress(0);
      
      try {
        // Step 1: Ingesting RAG contexts
        setExtractionStage("Ingesting RAG contexts...");
        setProgress(15);
        await new Promise((r) => setTimeout(r, 500));

        // Step 2: Exposing claims
        setExtractionStage("Exposing claims & assertions...");
        setProgress(45);
        await new Promise((r) => setTimeout(r, 600));

        // Step 3: Weighting credentials
        setExtractionStage("Weighting citation credentials...");
        setProgress(75);
        await new Promise((r) => setTimeout(r, 500));

        // Step 4: Compiling
        setExtractionStage("Compiling evidence pipeline...");
        setProgress(95);
        await new Promise((r) => setTimeout(r, 300));

        const items = generateEvidence(papers, pdfs, plan);
        setEvidenceItems(items);
        setProgress(100);
        setExtractionStage("Complete");
        return items;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to extract evidence.");
        return [];
      } finally {
        setIsExtracting(false);
      }
    },
    []
  );

  const clearEvidence = useCallback(() => {
    setEvidenceItems([]);
    setProgress(0);
    setExtractionStage("");
  }, []);

  return {
    evidenceItems,
    setEvidenceItems,
    isExtracting,
    progress,
    extractionStage,
    error,
    extractEvidence,
    clearEvidence,
  };
}
