export type GraphNodeStatus = "pending" | "running" | "completed" | "failed";

export interface GraphNode {
  id: string;
  name: string;
  status: GraphNodeStatus;
  statusText?: string;
  estimatedRuntime: string;
  executionOrder: number;
  dependencies: string[]; // Predecessor node IDs (names/IDs of agents)
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  status: "inactive" | "active" | "completed";
}
