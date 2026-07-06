import { useMemo } from "react";
import type { ExecutionPlan, AIAgentName } from "../types";
import type { GraphNode, GraphEdge, GraphNodeStatus } from "./types";
import type { EvidenceItem } from "@/features/evidence";
import type { KnowledgeGraph } from "@/features/knowledge-graph";

const PIPELINE_ORDER: AIAgentName[] = [
  "Planner",
  "Retrieval",
  "Evidence",
  "Knowledge Graph",
  "Copilot",
];

export function useGraphSimulation(
  plan: ExecutionPlan | null,
  searchState: string = "idle",
  hasPapers: boolean = false,
  projectTitle: string = "Default Title",
  projectTopic: string = "Default Topic",
  researchType: string = "general_research",
  plannerSummary: string = "",
  evidenceItems: EvidenceItem[] = [],
  isEvidenceExtracting: boolean = false,
  knowledgeGraph: KnowledgeGraph | null = null,
  isGraphGenerating: boolean = false,
  stageRuntimes?: Record<string, number>
) {
  return useMemo(() => {
    if (!plan) {
      return { nodes: [], edges: [], logs: [] };
    }

    const isRetrievalComplete = searchState === "complete" || hasPapers;
    const isEvidenceComplete = evidenceItems.length > 0;
    const isGraphComplete = knowledgeGraph !== null && knowledgeGraph.nodes.length > 0;

    // Filter out Planner from selected agents to prevent duplication in graph nodes
    const sortedAgents = [...plan.selectedAgents]
      .filter((agent) => agent.name !== "Planner")
      .filter((agent) => PIPELINE_ORDER.includes(agent.name))
      .sort((a, b) => PIPELINE_ORDER.indexOf(a.name) - PIPELINE_ORDER.indexOf(b.name));

    // 1. Construct static Nodes from plan with realistic runtimes
    const nodes: GraphNode[] = [
      {
        id: "Planner",
        name: "Planner",
        status: "completed",
        estimatedRuntime: stageRuntimes?.Planner ? `${stageRuntimes.Planner}s` : "0.3s",
        executionOrder: 1,
        dependencies: [],
      },
    ];

    sortedAgents.forEach((agent, index) => {
      let runtime = "1.5s";
      if (agent.name === "Retrieval") {
        runtime = stageRuntimes?.Retrieval ? `${stageRuntimes.Retrieval}s` : "1.2s";
      } else if (agent.name === "Evidence") {
        runtime = stageRuntimes?.Evidence ? `${stageRuntimes.Evidence}s` : "0.7s";
      } else if (agent.name === "Knowledge Graph") {
        runtime = stageRuntimes?.["Knowledge Graph"] ? `${stageRuntimes["Knowledge Graph"]}s` : "0.5s";
      } else if (agent.name === "Copilot") {
        runtime = "Ready";
      }

      // Compute dynamic status & statusText
      let status: GraphNodeStatus = "pending";
      let statusText = "Waiting";
      
      if (agent.name === "Retrieval") {
        if (isRetrievalComplete) {
          status = "completed";
          statusText = "Completed";
        } else if (searchState !== "idle") {
          status = "running";
          if (searchState === "searching") statusText = "Initializing";
          else if (searchState === "preparing") statusText = "Finalizing";
          else statusText = "Running";
        }
      } else if (agent.name === "Evidence") {
        if (isEvidenceComplete) {
          status = "completed";
          statusText = "Completed";
        } else if (isEvidenceExtracting) {
          status = "running";
          statusText = "Running";
        } else if (isRetrievalComplete) {
          status = "running";
          statusText = "Initializing";
        }
      } else if (agent.name === "Knowledge Graph") {
        if (isGraphComplete) {
          status = "completed";
          statusText = "Completed";
        } else if (isGraphGenerating) {
          status = "running";
          statusText = "Running";
        } else if (isEvidenceComplete) {
          status = "running";
          statusText = "Initializing";
        }
      } else if (agent.name === "Copilot") {
        if (isGraphComplete) {
          status = "completed";
          statusText = "Ready";
        }
      }

      nodes.push({
        id: agent.name,
        name: agent.name,
        status,
        statusText,
        estimatedRuntime: runtime,
        executionOrder: index + 2,
        dependencies: [index === 0 ? "Planner" : sortedAgents[index - 1].name],
      });
    });

    // 2. Construct static Edges
    const edges: GraphEdge[] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      const fromNode = nodes[i];
      const toNode = nodes[i + 1];

      let status: GraphEdge["status"] = "inactive";
      if (fromNode.status === "completed") {
        if (toNode.status === "completed") {
          status = "completed";
        } else if (toNode.status === "running") {
          status = "active";
        }
      }

      edges.push({
        id: `${fromNode.id}-${toNode.id}`,
        from: fromNode.id,
        to: toNode.id,
        status,
      });
    }

    // 3. Construct clean static logs
    const logs = [
      `[SYSTEM] Workspace synchronized: "${projectTitle}"`,
      `[SYSTEM] Research intent parsed for topic: "${projectTopic}"`,
      `[SYSTEM] Research type identified: "${researchType.replace("_", " ").toUpperCase()}"`,
      "[SYSTEM] Planner blueprint generated successfully.",
      `[SYSTEM] Computed 1 Execution Plan containing ${plan.selectedAgents.length} target agent roles.`,
      `[SYSTEM] Retrieved agent topology: Planner, ${sortedAgents.map((a) => a.name).join(", ")}.`,
      "[SYSTEM] Agent execution pipeline compiled.",
    ];

    if (plannerSummary) {
      logs.splice(4, 0, `[SYSTEM] Blueprint summary: "${plannerSummary}"`);
    }

    if (isRetrievalComplete) {
      logs.push("[SUCCESS] Retrieval completed successfully. Context active.");
    } else {
      logs.push("[SYSTEM] Waiting for Retrieval Engine...");
    }

    if (isEvidenceExtracting) {
      logs.push(
        "[RUNNING] Evidence Agent active. Ingesting RAG context chunks...",
        "[RUNNING] Evidence Agent active. Exposing claims & parsing citations..."
      );
    } else if (isEvidenceComplete) {
      logs.push(
        `[SUCCESS] Evidence Agent completed. Extracted ${evidenceItems.length} structured evidence cards.`,
        "[RESOLVED] Downstream reasoning pipelines unlocked. Knowledge Graph waiting."
      );
    }

    if (isGraphGenerating) {
      logs.push(
        "[RUNNING] Knowledge Graph Agent compiling semantic entities...",
        "[RUNNING] Knowledge Graph Agent structuring ontology relationships..."
      );
    } else if (isGraphComplete) {
      logs.push(
        `[SUCCESS] Knowledge Graph Agent complete. Compiled ${knowledgeGraph.nodes.length} nodes and ${knowledgeGraph.edges.length} relationships.`,
        "[SYSTEM] Execution pipeline completed at Knowledge Graph."
      );
    }

    return {
      nodes,
      edges,
      logs,
    };
  }, [
    plan,
    searchState,
    hasPapers,
    projectTitle,
    projectTopic,
    researchType,
    plannerSummary,
    evidenceItems,
    isEvidenceExtracting,
    knowledgeGraph,
    isGraphGenerating,
  ]);
}
