import { useCallback, useEffect, useState, useRef } from "react";
import type { PaperResult, PDFDocument, RAGContext, SearchState } from "./types";
import { retrievalService } from "./retrieval-service";

export function useRetrieval(
  projectId: string | undefined,
  initialState?: {
    papers?: PaperResult[];
    pdfs?: PDFDocument[];
    contexts?: RAGContext[];
    searchState?: SearchState;
    projectTopic?: string;
    projectTitle?: string;
    plannerSummary?: string;
    plannerObjectives?: string[];
    researchQuestions?: string[];
  }
) {
  const [query, setQuery] = useState("");
  const [searchState, setSearchState] = useState<SearchState>(
    () => initialState?.searchState || "idle"
  );
  const [papers, setPapers] = useState<PaperResult[]>(
    () => initialState?.papers || []
  );
  const [pdfs, setPdfs] = useState<PDFDocument[]>(
    () => initialState?.pdfs || []
  );
  const [retrievedContext, setRetrievedContext] = useState<RAGContext[]>(
    () => initialState?.contexts || []
  );
  
  const [searchProgress, setSearchProgress] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const hasInitialized = useRef(false);

  const fetchUploadedPdfs = useCallback(async () => {
    if (!projectId) return;
    try {
      const data = await retrievalService.listUploadedPdfs(projectId);
      setPdfs(data);
    } catch (err) {
      logger.error("Failed to load project PDFs:", err instanceof Error ? err.message : String(err));
    }
  }, [projectId]);

  // Load project documents on mount
  useEffect(() => {
    if (!projectId || hasInitialized.current) return;
    hasInitialized.current = true;
    fetchUploadedPdfs();
  }, [projectId, fetchUploadedPdfs]);

  const search = useCallback(
    async (queryText: string) => {
      if (!projectId || !queryText.trim()) return;
      
      setIsSearching(true);
      setError(null);
      setSearchState("searching");
      setSearchProgress(10);

      // Build context query keywords to avoid cross-domain mismatches
      const titleTerms = (initialState?.projectTitle || "").toLowerCase().split(/\s+/).filter((w) => w.length > 4);
      const topicTerms = (initialState?.projectTopic || "").toLowerCase().split(/\s+/).filter((w) => w.length > 4);
      const planTerms = (initialState?.plannerSummary || "").toLowerCase().split(/\s+/).filter((w) => w.length > 4);
      const objectivesTerms = (initialState?.plannerObjectives || []).join(" ").toLowerCase().split(/\s+/).filter((w) => w.length > 4);
      
      const allContextTerms = Array.from(new Set([
        ...titleTerms,
        ...topicTerms,
        ...planTerms,
        ...objectivesTerms,
      ])).slice(0, 5);

      const expandedQuery = `${queryText} ${allContextTerms.join(" ")}`.trim();

      // Concurrently start backend queries with expanded context query
      const searchPromise = retrievalService.searchPublications(expandedQuery, initialState?.projectTopic);
      const contextPromise = retrievalService.searchContext(projectId, queryText);
 
      // Sequence animations with dynamic intervals
      const states: SearchState[] = ["searching", "retrieving", "ranking", "deduplicating", "preparing"];
      let stepIndex = 0;
      
      const interval = setInterval(() => {
        stepIndex++;
        if (stepIndex < states.length) {
          setSearchState(states[stepIndex]);
          setSearchProgress((stepIndex + 1) * 18);
        } else {
          clearInterval(interval);
        }
      }, 700);

      try {
        // Await results
        const [papersData, contextData] = await Promise.all([
          searchPromise,
          contextPromise
        ]);

        clearInterval(interval);

        // Project Disciplinary Domain Classifier
        let projectDomain = "General";
        const projectTokens = `${initialState?.projectTitle} ${initialState?.projectTopic} ${initialState?.plannerSummary}`.toLowerCase();
        
        if (projectTokens.match(/(transformer|llm|learning|neural|attention|ai|gpt|language)/)) {
          projectDomain = "AI";
        } else if (projectTokens.match(/(quantum|physics|qubit|decoherence|transmon|quark)/)) {
          projectDomain = "Physics";
        } else if (projectTokens.match(/(cancer|tumor|immunotherapy|hla|cell|oncology)/)) {
          projectDomain = "Medicine";
        } else if (projectTokens.match(/(battery|carbon|solar|electrolyte|dendrite|energy)/)) {
          projectDomain = "Energy";
        }

        // Calculate dynamic similarity scores deterministically
        const evaluatedPapers = papersData.map((paper) => {
          // Identify paper domain
          let paperDomain = "General";
          const paperTokens = `${paper.title} ${paper.abstract}`.toLowerCase();
          
          if (paperTokens.match(/(transformer|llm|learning|neural|attention|ai|gpt|language)/)) {
            paperDomain = "AI";
          } else if (paperTokens.match(/(quantum|physics|qubit|decoherence|transmon|quark)/)) {
            paperDomain = "Physics";
          } else if (paperTokens.match(/(cancer|tumor|immunotherapy|hla|cell|oncology)/)) {
            paperDomain = "Medicine";
          } else if (paperTokens.match(/(battery|carbon|solar|electrolyte|dendrite|energy)/)) {
            paperDomain = "Energy";
          }

          // Query keyword overlap
          const queryWords = queryText.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
          const titleWords = paper.title.toLowerCase().split(/\s+/);
          const abstractWords = paper.abstract.toLowerCase().split(/\s+/);
          
          let overlapCount = 0;
          queryWords.forEach((qw) => {
            if (titleWords.includes(qw)) overlapCount += 2;
            if (abstractWords.includes(qw)) overlapCount += 1;
          });

          // Objectives overlap
          let objectiveOverlap = 0;
          const objectives = initialState?.plannerObjectives || [];
          objectives.forEach((obj) => {
            const objWords = obj.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
            objWords.forEach((ow) => {
              if (paperTokens.includes(ow)) objectiveOverlap++;
            });
          });

          // Research Questions overlap
          let rqOverlap = 0;
          const questions = initialState?.researchQuestions || [];
          questions.forEach((q) => {
            const qWords = q.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
            qWords.forEach((qw) => {
              if (paperTokens.includes(qw)) rqOverlap++;
            });
          });

          // Discipline Penalties
          let domainFactor = 1.0;
          if (projectDomain !== "General" && paperDomain !== "General") {
            if (projectDomain === paperDomain) {
              domainFactor = 1.15;
            } else {
              domainFactor = 0.20; // HEAVY penalization of off-domain topics!
            }
          }

          const sourceMultiplier = paper.source === "arXiv" ? 0.95 : paper.source === "Semantic Scholar" ? 0.98 : 0.90;
          const baseRelevance = 0.50 + (overlapCount * 0.05) + (objectiveOverlap * 0.03) + (rqOverlap * 0.02);
          const calculatedScore = Math.min(0.99, Math.max(0.04, baseRelevance * domainFactor * sourceMultiplier));
          
          return {
            ...paper,
            relevanceScore: parseFloat(calculatedScore.toFixed(3)),
          };
        });

        const evaluatedContext = contextData.map((ctx, idx) => {
          const queryWords = queryText.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
          const docWords = ctx.document.toLowerCase().split(/\s+/);
          
          let overlapCount = 0;
          queryWords.forEach((qw) => {
            if (docWords.includes(qw)) overlapCount += 1;
          });
          
          const calculatedScore = Math.min(0.99, Math.max(0.50, 0.65 + (overlapCount * 0.04) - (idx * 0.02)));
          
          return {
            ...ctx,
            score: parseFloat(calculatedScore.toFixed(3)),
          };
        });

        const sortedPapers = evaluatedPapers.sort((a, b) => b.relevanceScore - a.relevanceScore);

        setSearchProgress(100);
        setPapers(sortedPapers);
        setRetrievedContext(evaluatedContext);
        setSearchState("complete");
      } catch (err) {
        clearInterval(interval);
        setError(err instanceof Error ? err.message : "An unexpected error occurred during search.");
        setSearchState("idle");
        setSearchProgress(0);
      } finally {
        setIsSearching(false);
      }
    },
    [projectId, initialState?.projectTopic, initialState?.projectTitle, initialState?.plannerSummary, initialState?.plannerObjectives, initialState?.researchQuestions]
  );

  const uploadPDF = useCallback(
    async (file: File) => {
      if (!projectId) return;
      
      setIsUploading(true);
      setUploadProgress(10);
      setError(null);

      // Simple upload progress simulation interval
      const progressTimer = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressTimer);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      try {
        await retrievalService.uploadPdf(projectId, file);
        clearInterval(progressTimer);
        setUploadProgress(100);
        
        // Short delay at 100% before updating lists
        await new Promise((r) => setTimeout(r, 500));
        await fetchUploadedPdfs();
      } catch (err) {
        clearInterval(progressTimer);
        setError(err instanceof Error ? err.message : "Failed to upload and process document.");
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [projectId, fetchUploadedPdfs]
  );

  const clearResults = useCallback(() => {
    setPapers([]);
    setRetrievedContext([]);
    setSearchState("idle");
  }, []);

  const clearPDF = useCallback(() => {
    setPdfs([]);
  }, []);
 
  return {
  papers,
  setPapers,

  pdfs,
  setPdfs,

  retrievedContext,
  setRetrievedContext,

  query,
  setQuery,

  searchState,
  searchProgress,
  isSearching,
  isUploading,
  uploadProgress,
  error,

  search,
  uploadPDF,

  clearResults,
  clearPDF,
  fetchUploadedPdfs,
  };
}

// Logger helper in client hooks
const logger = {
  error: (...args: unknown[]) => console.error("[RETRIEVAL_HOOK_ERROR]", ...args),
};
