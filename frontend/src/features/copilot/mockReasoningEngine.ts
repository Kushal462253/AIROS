import type { CopilotMessage, CopilotSourceType } from "./types";
import type { ExecutionPlan } from "@/features/planner";
import type { PaperResult, PDFDocument, RAGContext } from "@/features/retrieval";
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

export function queryMockReasoningEngine(
  question: string,
  context: InputContext
): Partial<CopilotMessage> {
  const query = question.toLowerCase().trim();

  // 1. Exact or close matches for suggested questions
  if (query === "explain my research objectives") {
    if (!context.plan || context.plan.objectives.length === 0) {
      return {
        content: "No supporting information exists inside the current project.",
        confidence: 0,
        sources: ["Planner"],
      };
    }
    const objectivesList = context.plan.objectives
      .map((obj, i) => `${i + 1}. ${obj}`)
      .join("\n");
    return {
      content: `Here are your research objectives defined by the Planner Engine:\n\n${objectivesList}\n\nThese objectives guide the search and reasoning agents.`,
      confidence: 98,
      sources: ["Planner"],
      plannerRefs: context.plan.objectives,
    };
  }

  if (query === "summarize retrieved papers") {
    if (context.retrievedPapers.length === 0) {
      return {
        content: "No supporting information exists inside the current project.",
        confidence: 0,
        sources: ["Retrieved Papers"],
      };
    }
    const papersSummary = context.retrievedPapers
      .map((p) => `* **${p.title}** (${p.authors.join(", ")}, ${p.year}) - Relevance: ${(p.relevanceScore * 100).toFixed(0)}%`)
      .join("\n");
    return {
      content: `The Retrieval Engine has indexed the following publications for your project context:\n\n${papersSummary}`,
      confidence: 95,
      sources: ["Retrieved Papers"],
      relatedPapers: context.retrievedPapers.map((p) => p.title),
    };
  }

  if (query === "explain uploaded manuscript") {
    if (context.uploadedPdfs.length === 0) {
      return {
        content: "No supporting information exists inside the current project.",
        confidence: 0,
        sources: ["Uploaded PDF"],
      };
    }
    const pdfsList = context.uploadedPdfs
      .map((pdf) => `* **${pdf.filename}** (Uploaded: ${new Date(pdf.uploadedAt).toLocaleDateString()})`)
      .join("\n");
    return {
      content: `The following PDF manuscripts have been ingested and processed into vectorized index chunks:\n\n${pdfsList}`,
      confidence: 97,
      sources: ["Uploaded PDF"],
    };
  }

  if (query === "show strongest evidence") {
    if (context.evidence.length === 0) {
      return {
        content: "No supporting information exists inside the current project.",
        confidence: 0,
        sources: ["Evidence"],
      };
    }
    const evidenceList = context.evidence
      .map(
        (ev) =>
          `* **Claim:** "${ev.claim}"\n  * **Quote:** _"${ev.quote}"_\n  * **Source:** ${ev.paperTitle} (Confidence: ${ev.confidenceScore}%)`
      )
      .join("\n\n");
    return {
      content: `Here is the key evidence compiled from your retrieved literature ledger:\n\n${evidenceList}`,
      confidence: 96,
      sources: ["Evidence"],
      relatedEvidence: context.evidence.map((e) => e.claim),
      relatedPapers: context.evidence.map((e) => e.paperTitle),
    };
  }

  if (query === "explain the knowledge graph") {
    if (!context.knowledgeGraph || context.knowledgeGraph.nodes.length === 0) {
      return {
        content: "No supporting information exists inside the current project.",
        confidence: 0,
        sources: ["Knowledge Graph"],
      };
    }
    const nodesSummary = context.knowledgeGraph.nodes.map((n) => n.label).join(", ");
    const edgesCount = context.knowledgeGraph.edges.length;
    return {
      content: `The Knowledge Graph Agent compiled a connected network with **${context.knowledgeGraph.nodes.length} nodes** and **${edgesCount} relationships**.\n\nCore concepts include: ${nodesSummary}.\n\nThis ontology structure exposes the conceptual map of the project.`,
      confidence: 94,
      sources: ["Knowledge Graph"],
      relatedNodes: context.knowledgeGraph.nodes.map((n) => n.label),
    };
  }

  if (query === "which concepts are most connected?") {
    if (!context.knowledgeGraph || context.knowledgeGraph.nodes.length === 0) {
      return {
        content: "No supporting information exists inside the current project.",
        confidence: 0,
        sources: ["Knowledge Graph"],
      };
    }
    const connections: Record<string, number> = {};
    context.knowledgeGraph.nodes.forEach((n) => {
      connections[n.id] = 0;
    });
    context.knowledgeGraph.edges.forEach((e) => {
      if (connections[e.from] !== undefined) connections[e.from]++;
      if (connections[e.to] !== undefined) connections[e.to]++;
    });

    const sortedNodes = [...context.knowledgeGraph.nodes].sort((a, b) => {
      return (connections[b.id] || 0) - (connections[a.id] || 0);
    });

    const mostConnected = sortedNodes.slice(0, 3);
    const connectionReport = mostConnected
      .map((n) => `* **${n.label}** (${n.type}) - ${connections[n.id] || 0} connections`)
      .join("\n");

    return {
      content: `The concept topology analysis identifies the following highly central nodes:\n\n${connectionReport}`,
      confidence: 96,
      sources: ["Knowledge Graph"],
      relatedNodes: mostConnected.map((n) => n.label),
    };
  }

  if (query === "what have we done so far?") {
    const steps = [];
    if (context.plan) steps.push("1. Synthesized research objectives and questions (Planner Engine)");
    if (context.retrievedPapers.length > 0) steps.push(`2. Searched and indexed ${context.retrievedPapers.length} research papers (Retrieval Engine)`);
    if (context.uploadedPdfs.length > 0) steps.push(`3. Vectorized ${context.uploadedPdfs.length} uploaded PDF manuscripts`);
    if (context.evidence.length > 0) steps.push(`4. Extracted ${context.evidence.length} key scientific evidence items (Evidence Agent)`);
    if (context.knowledgeGraph && context.knowledgeGraph.nodes.length > 0) {
      steps.push(`5. Integrated concept graph with ${context.knowledgeGraph.nodes.length} concepts and ${context.knowledgeGraph.edges.length} relationships`);
    }

    if (steps.length === 0) {
      return {
        content: "No active project data compiled yet. Waiting for Retrieval ingestion.",
        confidence: 90,
        sources: ["Project Memory"],
      };
    }

    return {
      content: `Here is the current workflow timeline completed for this project:\n\n${steps.join("\n")}`,
      confidence: 99,
      sources: ["Project Memory"],
    };
  }

  if (query === "summarize project memory") {
    const memoryDetails = [
      `* **Planner Blueprint:** ${context.plan ? "Synchronized" : "Empty"}`,
      `* **Retrieved Papers:** ${context.retrievedPapers.length} papers stored`,
      `* **Uploaded Documents:** ${context.uploadedPdfs.length} PDFs processed`,
      `* **Ingested RAG Contexts:** ${context.retrievedContext.length} chunk vectors`,
      `* **Evidence Items:** ${context.evidence.length} empirical records`,
      `* **Knowledge Graph Map:** ${context.knowledgeGraph ? context.knowledgeGraph.nodes.length : 0} semantic nodes`,
    ];
    return {
      content: `Project Memory status breakdown:\n\n${memoryDetails.join("\n")}`,
      confidence: 100,
      sources: ["Project Memory"],
    };
  }

  // 2. Keyword Keyword/Intent routing
  // A. Planner questions
  if (
    query.includes("objective") ||
    query.includes("goal") ||
    query.includes("research questions") ||
    query.includes("plan") ||
    query.includes("blueprint") ||
    query.includes("rq") ||
    query.includes("complexity")
  ) {
    if (!context.plan) {
      return {
        content: "No supporting information exists inside the current project.",
        confidence: 0,
        sources: ["Planner"],
      };
    }
    const objectives = context.plan.objectives.map((o) => `* ${o}`).join("\n");
    const questions = context.plan.researchQuestions.map((q, i) => `* **RQ${i + 1}:** ${q}`).join("\n");
    return {
      content: `**Research Plan Summary:**\n${context.plan.summary}\n\n**Objectives:**\n${objectives}\n\n**Research Questions:**\n${questions}\n\n*Complexity: ${context.plan.researchComplexity} | Confidence: ${context.plan.confidenceScore}%*`,
      confidence: 98,
      sources: ["Planner"],
      plannerRefs: context.plan.objectives,
      rqRefs: context.plan.researchQuestions.map((_, i) => `RQ${i + 1}`),
    };
  }

  // B. Paper / Literature questions
  if (
    query.includes("paper") ||
    query.includes("article") ||
    query.includes("literature") ||
    query.includes("scholar") ||
    query.includes("retrieved") ||
    query.includes("publication")
  ) {
    if (context.retrievedPapers.length === 0) {
      return {
        content: "No supporting information exists inside the current project.",
        confidence: 0,
        sources: ["Retrieved Papers"],
      };
    }
    const papers = context.retrievedPapers.slice(0, 5);
    const paperStr = papers
      .map((p) => `* **${p.title}** by ${p.authors.join(", ")} (${p.year}) - relevance: ${(p.relevanceScore * 100).toFixed(0)}%`)
      .join("\n");
    return {
      content: `Retrieved literature containing relevant sources:\n\n${paperStr}\n\nTotal papers in project memory: ${context.retrievedPapers.length}.`,
      confidence: 95,
      sources: ["Retrieved Papers"],
      relatedPapers: papers.map((p) => p.title),
    };
  }

  // C. Evidence / Claim questions
  if (
    query.includes("evidence") ||
    query.includes("claim") ||
    query.includes("finding") ||
    query.includes("empirical") ||
    query.includes("parameter")
  ) {
    if (context.evidence.length === 0) {
      return {
        content: "No supporting information exists inside the current project.",
        confidence: 0,
        sources: ["Evidence"],
      };
    }
    const items = context.evidence.slice(0, 3);
    const evStr = items
      .map((e) => `* **Claim:** ${e.claim}\n  * **Quote:** "${e.quote}"\n  * **Source:** ${e.paperTitle}`)
      .join("\n\n");
    return {
      content: `Extracted clinical and empirical evidence records:\n\n${evStr}`,
      confidence: 96,
      sources: ["Evidence"],
      relatedEvidence: items.map((e) => e.claim),
      relatedPapers: items.map((e) => e.paperTitle),
    };
  }

  // D. Knowledge Graph questions
  if (
    query.includes("knowledge graph") ||
    query.includes("graph") ||
    query.includes("concept") ||
    query.includes("node") ||
    query.includes("relation") ||
    query.includes("link") ||
    query.includes("ontology")
  ) {
    if (!context.knowledgeGraph || context.knowledgeGraph.nodes.length === 0) {
      return {
        content: "No supporting information exists inside the current project.",
        confidence: 0,
        sources: ["Knowledge Graph"],
      };
    }
    const nodeSamples = context.knowledgeGraph.nodes.slice(0, 6).map((n) => n.label).join(", ");
    const relations = context.knowledgeGraph.edges.slice(0, 3).map((e) => `* ${e.from} → [${e.label}] → ${e.to}`).join("\n");
    return {
      content: `**Concept topology network:**\n\nNodes: ${nodeSamples}...\nTotal nodes: ${context.knowledgeGraph.nodes.length}\nTotal relationships: ${context.knowledgeGraph.edges.length}\n\n**Sample Relationships:**\n${relations}`,
      confidence: 94,
      sources: ["Knowledge Graph"],
      relatedNodes: context.knowledgeGraph.nodes.map((n) => n.label),
    };
  }

  // E. PDF questions
  if (
    query.includes("pdf") ||
    query.includes("manuscript") ||
    query.includes("document") ||
    query.includes("upload")
  ) {
    if (context.uploadedPdfs.length === 0) {
      return {
        content: "No supporting information exists inside the current project.",
        confidence: 0,
        sources: ["Uploaded PDF"],
      };
    }
    const pdfs = context.uploadedPdfs
      .map((p) => `* **${p.filename}** (Processed successfully)`)
      .join("\n");
    return {
      content: `Processed and indexed manuscripts:\n\n${pdfs}`,
      confidence: 97,
      sources: ["Uploaded PDF"],
    };
  }

  // F. Memory questions
  if (query.includes("memory") || query.includes("history") || query.includes("so far") || query.includes("done")) {
    const memoryBreakdown = [
      `* Blueprint status: ${context.plan ? "Compiled" : "Missing"}`,
      `* Papers loaded: ${context.retrievedPapers.length}`,
      `* PDF items: ${context.uploadedPdfs.length}`,
      `* Extracted claims: ${context.evidence.length}`,
      `* Graph nodes: ${context.knowledgeGraph ? context.knowledgeGraph.nodes.length : 0}`,
    ];
    return {
      content: `Project sandbox memory state overview:\n\n${memoryBreakdown.join("\n")}`,
      confidence: 100,
      sources: ["Project Memory"],
    };
  }

  // default fallback if query has no relevance/unsupported
  return {
    content: "No supporting information exists inside the current project.",
    confidence: 0,
    sources: ["Project Memory"],
  };
}
