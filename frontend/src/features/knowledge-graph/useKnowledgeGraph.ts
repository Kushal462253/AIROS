import { useCallback, useState } from "react";
import type { EvidenceItem } from "@/features/evidence";
import type { ExecutionPlan } from "@/features/planner";
import type { KnowledgeGraph, KnowledgeNode, NodeType, EdgeType } from "./types";
import { knowledgeGraphService } from "./knowledge-graph-service";

export interface GraphFilters {
  nodeTypes: NodeType[];
  relationshipTypes: EdgeType[];
  sourcePapers: string[];
  objectives: string[];
  researchQuestions: string[];
}

const DEFAULT_FILTERS: GraphFilters = {
  nodeTypes: [],
  relationshipTypes: [],
  sourcePapers: [],
  objectives: [],
  researchQuestions: [],
};

export function useKnowledgeGraph(initialGraph?: KnowledgeGraph | null) {
  const [graph, setGraph] = useState<KnowledgeGraph | null>(() => initialGraph || null);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generationStage, setGenerationStage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<GraphFilters>({ ...DEFAULT_FILTERS });

  const generateGraph = useCallback(
    async (evidenceItems: EvidenceItem[], plan: ExecutionPlan | null) => {
      if (evidenceItems.length === 0 || !plan) return null;
      setIsGenerating(true);
      setError(null);
      setProgress(0);

      try {
        // Phase 1: Parsing entities
        setGenerationStage("Parsing semantic entities...");
        setProgress(20);
        await new Promise((r) => setTimeout(r, 600));

        // Phase 2: Core objectives
        setGenerationStage("Structuring core objective mappings...");
        setProgress(50);
        await new Promise((r) => setTimeout(r, 700));

        // Phase 3: Relations and weights
        setGenerationStage("Linking relationships & weights...");
        setProgress(80);
        await new Promise((r) => setTimeout(r, 600));

        // Phase 4: Compiling network
        setGenerationStage("Compiling network topology...");
        setProgress(95);
        await new Promise((r) => setTimeout(r, 400));

        const compiled = knowledgeGraphService.compileGraph(evidenceItems, plan);
        setGraph(compiled);
        setProgress(100);
        setGenerationStage("Complete");
        return compiled;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to compile knowledge graph.");
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  const clearGraph = useCallback(() => {
    setGraph(null);
    setSelectedNode(null);
    setProgress(0);
    setGenerationStage("");
    setFilters({ ...DEFAULT_FILTERS });
    setSearchQuery("");
  }, []);

  return {
    graph,
    setGraph,
    selectedNode,
    setSelectedNode,
    isGenerating,
    progress,
    generationStage,
    error,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    generateGraph,
    clearGraph,
  };
}
