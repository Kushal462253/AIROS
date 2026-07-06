import type { EvidenceItem } from "@/features/evidence";
import type { ExecutionPlan } from "@/features/planner";
import type { KnowledgeGraph, KnowledgeNode, KnowledgeEdge, GraphStats, NodeType, EdgeType } from "./types";

export const knowledgeGraphService = {
  /**
   * Compiles the Knowledge Graph deterministically from Extracted Evidence and Planner details.
   */
  compileGraph(evidenceItems: EvidenceItem[], plan: ExecutionPlan | null): KnowledgeGraph {
    if (evidenceItems.length === 0 || !plan) {
      return { nodes: [], edges: [] };
    }

    const nodesMap = new Map<string, KnowledgeNode>();
    const edgesList: KnowledgeEdge[] = [];

    const objectives = plan.objectives;
    const researchQuestions = plan.researchQuestions;

    // 1. Add Research Questions as core nodes
    researchQuestions.forEach((rq, idx) => {
      const id = `node-rq-${idx + 1}`;
      nodesMap.set(id, {
        id,
        name: `RQ${idx + 1}: ${rq.substring(0, 35)}...`,
        type: "Research Question",
        description: `Target research inquiry: ${rq}`,
        importanceScore: 90,
        evidenceReferences: [],
        sourcePapers: [],
        plannerReferences: [],
        researchQuestionReferences: [`RQ${idx + 1}`],
      });
    });

    // 2. Add Planner Objectives as core nodes
    objectives.forEach((obj, idx) => {
      const id = `node-obj-${idx + 1}`;
      nodesMap.set(id, {
        id,
        name: `OBJ${idx + 1}: ${obj.substring(0, 35)}...`,
        type: "Planner Objective",
        description: `Execution pipeline objective: ${obj}`,
        importanceScore: 85,
        evidenceReferences: [],
        sourcePapers: [],
        plannerReferences: [obj],
        researchQuestionReferences: [],
      });
    });

    // 3. Helper to get clean alphanumeric ID from text
    const getCleanId = (text: string) => `node-concept-${text.toLowerCase().replace(/[^a-z0-9]/g, "-").substring(0, 25)}`;

    // 4. Process evidence items to generate semantic nodes and edges
    evidenceItems.forEach((evidence, idx) => {
      const paperNodeId = `node-paper-${idx}`;
      
      // Add Paper node
      nodesMap.set(paperNodeId, {
        id: paperNodeId,
        name: evidence.citation,
        type: "Paper",
        description: `Ingested source: "${evidence.sourcePaper}". Category: ${evidence.sourceType}`,
        importanceScore: 75,
        evidenceReferences: [evidence.id],
        sourcePapers: [evidence.sourcePaper],
        plannerReferences: [evidence.relatedObjective],
        researchQuestionReferences: [evidence.relatedResearchQuestion],
      });

      // Map Paper references back to objective and RQ nodes
      const targetRqIdx = researchQuestions.indexOf(evidence.relatedResearchQuestion);
      if (targetRqIdx !== -1) {
        edgesList.push({
          id: `edge-paper-rq-${idx}`,
          source: paperNodeId,
          target: `node-rq-${targetRqIdx + 1}`,
          relationship: "references",
          confidence: 95,
          evidenceIds: [evidence.id],
        });
      }

      const targetObjIdx = objectives.indexOf(evidence.relatedObjective);
      if (targetObjIdx !== -1) {
        edgesList.push({
          id: `edge-paper-obj-${idx}`,
          source: paperNodeId,
          target: `node-obj-${targetObjIdx + 1}`,
          relationship: "supports",
          confidence: 90,
          evidenceIds: [evidence.id],
        });
      }

      // Add Concept nodes dynamically based on claims keywords
      const claim = evidence.extractedClaim.toLowerCase();

      if (claim.includes("cryogenic") || claim.includes("qubit")) {
        const loopId = getCleanId("Cryogenic control loops");
        const arrayId = getCleanId("Superconducting transmon qubit arrays");

        nodesMap.set(loopId, {
          id: loopId,
          name: "Sub-100mK Cryogenic control loops",
          type: "Methodology",
          description: "Thermal management loops optimizing decoherence scaling inside dilution mixing chambers.",
          importanceScore: 88,
          evidenceReferences: [evidence.id],
          sourcePapers: [evidence.sourcePaper],
          plannerReferences: [evidence.relatedObjective],
          researchQuestionReferences: [evidence.relatedResearchQuestion],
        });

        nodesMap.set(arrayId, {
          id: arrayId,
          name: "Superconducting transmon qubit arrays",
          type: "Architecture",
          description: "Solid-state quantum processing architectures utilizing Josephson junctions.",
          importanceScore: 92,
          evidenceReferences: [evidence.id],
          sourcePapers: [evidence.sourcePaper],
          plannerReferences: [evidence.relatedObjective],
          researchQuestionReferences: [evidence.relatedResearchQuestion],
        });

        // Edge: control loop -> improves -> transmon arrays
        edgesList.push({
          id: `edge-loop-array-${idx}`,
          source: loopId,
          target: arrayId,
          relationship: "improves",
          confidence: evidence.confidenceScore,
          evidenceIds: [evidence.id],
        });

        // Edge: Paper -> introduces -> control loop
        edgesList.push({
          id: `edge-paper-loop-${idx}`,
          source: paperNodeId,
          target: loopId,
          relationship: "introduces",
          confidence: 98,
          evidenceIds: [evidence.id],
        });
      }
      else if (claim.includes("pd-1") || claim.includes("car-t")) {
        const blockId = getCleanId("LAG-3 blocking profiles");
        const cellId = getCleanId("CAR-T cell cohorts");

        nodesMap.set(blockId, {
          id: blockId,
          name: "PD-1/LAG-3 ligand blocking profiles",
          type: "Methodology",
          description: "Monoclonal antibody combination dosing to block inhibitory receptors.",
          importanceScore: 86,
          evidenceReferences: [evidence.id],
          sourcePapers: [evidence.sourcePaper],
          plannerReferences: [evidence.relatedObjective],
          researchQuestionReferences: [evidence.relatedResearchQuestion],
        });

        nodesMap.set(cellId, {
          id: cellId,
          name: "CAR-T cell cohorts",
          type: "Concept",
          description: "Chimeric antigen receptor immunotherapies engineered to target specific tumor antigens.",
          importanceScore: 90,
          evidenceReferences: [evidence.id],
          sourcePapers: [evidence.sourcePaper],
          plannerReferences: [evidence.relatedObjective],
          researchQuestionReferences: [evidence.relatedResearchQuestion],
        });

        edgesList.push({
          id: `edge-block-cell-${idx}`,
          source: blockId,
          target: cellId,
          relationship: "supports",
          confidence: evidence.confidenceScore,
          evidenceIds: [evidence.id],
        });

        edgesList.push({
          id: `edge-paper-block-${idx}`,
          source: paperNodeId,
          target: blockId,
          relationship: "introduces",
          confidence: 96,
          evidenceIds: [evidence.id],
        });
      }
      else if (claim.includes("electrolyte") || claim.includes("dendrite")) {
        const solidId = getCleanId("Solid state electrolyte");
        const pathId = getCleanId("Dendrite penetration paths");

        nodesMap.set(solidId, {
          id: solidId,
          name: "Solid-state electrolyte interface",
          type: "Concept",
          description: "Lithium-metal solid state ion-conduction membranes optimizing chemical shear modulus values.",
          importanceScore: 89,
          evidenceReferences: [evidence.id],
          sourcePapers: [evidence.sourcePaper],
          plannerReferences: [evidence.relatedObjective],
          researchQuestionReferences: [evidence.relatedResearchQuestion],
        });

        nodesMap.set(pathId, {
          id: pathId,
          name: "Dendrite penetration paths",
          type: "Limitation",
          description: "Local electrochemical short circuit boundaries caused by uneven lithium ion flows.",
          importanceScore: 82,
          evidenceReferences: [evidence.id],
          sourcePapers: [evidence.sourcePaper],
          plannerReferences: [evidence.relatedObjective],
          researchQuestionReferences: [evidence.relatedResearchQuestion],
        });

        edgesList.push({
          id: `edge-solid-path-${idx}`,
          source: solidId,
          target: pathId,
          relationship: "contradicts",
          confidence: evidence.confidenceScore,
          evidenceIds: [evidence.id],
        });

        edgesList.push({
          id: `edge-paper-solid-${idx}`,
          source: paperNodeId,
          target: solidId,
          relationship: "introduces",
          confidence: 97,
          evidenceIds: [evidence.id],
        });
      }
      else if (claim.includes("attention") || claim.includes("transformer")) {
        const matrixId = getCleanId("Self attention matrix");
        const transId = getCleanId("Transformer model");
        const bleuId = getCleanId("BLEU score");

        nodesMap.set(matrixId, {
          id: matrixId,
          name: "Self-attention matrix computation",
          type: "Algorithm",
          description: "Parallel scaling mechanisms computing similarity matrices across input tokens.",
          importanceScore: 94,
          evidenceReferences: [evidence.id],
          sourcePapers: [evidence.sourcePaper],
          plannerReferences: [evidence.relatedObjective],
          researchQuestionReferences: [evidence.relatedResearchQuestion],
        });

        nodesMap.set(transId, {
          id: transId,
          name: "Transformer architectures",
          type: "Architecture",
          description: "Deep learning models relying completely on attention without recurrent loops.",
          importanceScore: 98,
          evidenceReferences: [evidence.id],
          sourcePapers: [evidence.sourcePaper],
          plannerReferences: [evidence.relatedObjective],
          researchQuestionReferences: [evidence.relatedResearchQuestion],
        });

        nodesMap.set(bleuId, {
          id: bleuId,
          name: "BLEU translation metrics",
          type: "Metric",
          description: "Bilingual evaluation understudy scores evaluating linguistic accuracy.",
          importanceScore: 85,
          evidenceReferences: [evidence.id],
          sourcePapers: [evidence.sourcePaper],
          plannerReferences: [evidence.relatedObjective],
          researchQuestionReferences: [evidence.relatedResearchQuestion],
        });

        edgesList.push({
          id: `edge-trans-matrix-${idx}`,
          source: transId,
          target: matrixId,
          relationship: "uses",
          confidence: 99,
          evidenceIds: [evidence.id],
        });

        edgesList.push({
          id: `edge-trans-bleu-${idx}`,
          source: transId,
          target: bleuId,
          relationship: "evaluates",
          confidence: evidence.confidenceScore,
          evidenceIds: [evidence.id],
        });

        edgesList.push({
          id: `edge-paper-trans-${idx}`,
          source: paperNodeId,
          target: transId,
          relationship: "introduces",
          confidence: 99,
          evidenceIds: [evidence.id],
        });
      }
      else {
        // Fallback default node creation matching citation query
        const conceptName = evidence.sourceType === "PDF" ? "Local boundary verification" : "Methodological baseline validations";
        const fallbackId = getCleanId(conceptName);

        nodesMap.set(fallbackId, {
          id: fallbackId,
          name: conceptName,
          type: "Concept",
          description: `Extracted concept validation from ${evidence.citation}`,
          importanceScore: 70,
          evidenceReferences: [evidence.id],
          sourcePapers: [evidence.sourcePaper],
          plannerReferences: [evidence.relatedObjective],
          researchQuestionReferences: [evidence.relatedResearchQuestion],
        });

        edgesList.push({
          id: `edge-paper-fallback-${idx}`,
          source: paperNodeId,
          target: fallbackId,
          relationship: "related_to",
          confidence: evidence.confidenceScore,
          evidenceIds: [evidence.id],
        });
      }
    });

    return {
      nodes: Array.from(nodesMap.values()),
      edges: edgesList,
    };
  },

  /**
   * Computes graph statistics from Nodes and Edges.
   */
  computeStats(graph: KnowledgeGraph): GraphStats {
    const totalNodes = graph.nodes.length;
    const totalRelationships = graph.edges.length;

    if (totalNodes === 0) {
      return {
        totalNodes: 0,
        totalRelationships: 0,
        mostConnectedConcept: "None",
        avgConnectivity: 0,
        researchDomains: [],
        conceptClusters: [],
      };
    }

    // 1. Calculate connectivity of concepts (excluding Research Questions / Planner Objectives / Papers)
    const connectivityMap = new Map<string, number>();
    graph.edges.forEach((edge) => {
      connectivityMap.set(edge.source, (connectivityMap.get(edge.source) || 0) + 1);
      connectivityMap.set(edge.target, (connectivityMap.get(edge.target) || 0) + 1);
    });

    let mostConnectedConcept = "None";
    let maxConnections = -1;

    graph.nodes.forEach((node) => {
      // Prioritize Concept/Architecture/Algorithm/Methodology/Limitation types for "Most Connected Concept"
      const isConceptType = ["Concept", "Architecture", "Algorithm", "Methodology", "Limitation"].includes(node.type);
      if (isConceptType) {
        const count = connectivityMap.get(node.id) || 0;
        if (count > maxConnections) {
          maxConnections = count;
          mostConnectedConcept = node.name;
        }
      }
    });

    const avgConnectivity = parseFloat((totalRelationships / totalNodes).toFixed(2));

    // 2. Identify research domains dynamically based on node keywords
    const domainsSet = new Set<string>();
    graph.nodes.forEach((node) => {
      const nameLower = node.name.toLowerCase();
      if (nameLower.includes("cryogenic") || nameLower.includes("qubit")) {
        domainsSet.add("Quantum Electronics");
        domainsSet.add("Thermal Engineering");
      } else if (nameLower.includes("pd-1") || nameLower.includes("car-t")) {
        domainsSet.add("Immunology");
        domainsSet.add("Oncology");
      } else if (nameLower.includes("electrolyte") || nameLower.includes("dendrite")) {
        domainsSet.add("Electrochemistry");
        domainsSet.add("Materials Science");
      } else if (nameLower.includes("attention") || nameLower.includes("transformer")) {
        domainsSet.add("Natural Language Processing");
        domainsSet.add("Deep Learning");
      }
    });

    if (domainsSet.size === 0) {
      domainsSet.add("General Scientific Review");
    }

    // 3. Concept clusters
    const clustersSet = new Set<string>();
    graph.nodes.forEach((node) => {
      if (node.type !== "Paper" && node.type !== "Research Question" && node.type !== "Planner Objective") {
        clustersSet.add(node.type);
      }
    });

    // 4. Calculate Connected Components via BFS traversal
    let connectedComponents = 0;
    const visited = new Set<string>();
    const adj = new Map<string, string[]>();
    
    graph.nodes.forEach((n) => adj.set(n.id, []));
    graph.edges.forEach((e) => {
      if (adj.has(e.source) && adj.has(e.target)) {
        adj.get(e.source)!.push(e.target);
        adj.get(e.target)!.push(e.source);
      }
    });

    graph.nodes.forEach((node) => {
      if (!visited.has(node.id)) {
        connectedComponents++;
        const queue = [node.id];
        visited.add(node.id);
        while (queue.length > 0) {
          const curr = queue.shift()!;
          const neighbors = adj.get(curr) || [];
          neighbors.forEach((neigh) => {
            if (!visited.has(neigh)) {
              visited.add(neigh);
              queue.push(neigh);
            }
          });
        }
      }
    });

    const graphDensity = totalNodes > 1 ? parseFloat((totalRelationships / (totalNodes * (totalNodes - 1))).toFixed(4)) : 0;

    return {
      totalNodes,
      totalRelationships,
      mostConnectedConcept,
      avgConnectivity,
      researchDomains: Array.from(domainsSet),
      conceptClusters: Array.from(clustersSet).map((c) => `${c} Nodes`),
      graphDensity,
      connectedComponents,
    };
  },
};
