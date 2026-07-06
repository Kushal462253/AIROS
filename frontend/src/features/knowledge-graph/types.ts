export type NodeType =
  | "Concept"
  | "Architecture"
  | "Algorithm"
  | "Methodology"
  | "Dataset"
  | "Benchmark"
  | "Metric"
  | "Finding"
  | "Limitation"
  | "Future Work"
  | "Paper"
  | "Research Question"
  | "Planner Objective";

export type EdgeType =
  | "supports"
  | "uses"
  | "extends"
  | "evaluates"
  | "compares"
  | "improves"
  | "depends_on"
  | "introduces"
  | "validated_by"
  | "contradicts"
  | "inspired_by"
  | "related_to"
  | "references";

export interface KnowledgeNode {
  id: string;
  name: string;
  type: NodeType;
  description: string;
  importanceScore: number; // 0-100
  evidenceReferences: string[]; // evidence item IDs
  sourcePapers: string[]; // paper titles
  plannerReferences: string[]; // objective descriptions
  researchQuestionReferences: string[]; // e.g., ["RQ1", "RQ2"]
}

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  relationship: EdgeType;
  confidence: number; // 0-100
  evidenceIds: string[]; // evidence item IDs
}

export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}

export interface GraphStats {
  totalNodes: number;
  totalRelationships: number;
  mostConnectedConcept: string;
  avgConnectivity: number;
  researchDomains: string[];
  conceptClusters: string[];
  graphDensity?: number;
  connectedComponents?: number;
}
