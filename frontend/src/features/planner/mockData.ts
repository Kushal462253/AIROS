import type { ResearchProject } from "@/features/workspace";
import type { ExecutionPlan, SelectedAgent, AIAgentName } from "./types";

// Base agent info
const AGENT_CATALOG: Record<AIAgentName, { purpose: string }> = {
  Planner: {
    purpose: "Synthesizes research intent, coordinates query strategies, and sequences agent tasks.",
  },
  Retrieval: {
    purpose: "Queries academic indexes, parses publication databases, and aggregates source papers.",
  },
  Evidence: {
    purpose: "Extracts key data points, validates experimental claims, and compiles supporting figures.",
  },
  "Knowledge Graph": {
    purpose: "Maps conceptual linkages, citation networks, and thematic relationships visually.",
  },
  Memory: {
    purpose: "Maintains cross-session knowledge, historical project contexts, and user preferences.",
  },
  Copilot: {
    purpose: "Handles human-in-the-loop validation, draft writing, and interactive query refinement.",
  },
};

const AGENT_REASONS: Record<AIAgentName, string> = {
  Planner: "Required to analyze the research intent, decompose it into formal objectives, and map out the multi-agent dependencies.",
  Retrieval: "Necessary for executing high-throughput queries across arXiv, Semantic Scholar, and Web indices to construct the literature baseline.",
  Evidence: "Critical for extracting clinical parameters, statistical data arrays, and empirical validation proofs from source documents.",
  "Knowledge Graph": "Required to construct a visual semantic taxonomy, mapping conceptual links and citation hierarchies.",
  Memory: "Maintains cross-session states, indexing parameters, and query preferences to keep execution context intact.",
  Copilot: "Handles interactive feedback gates, drafts output reports, and resolves real-time human-in-the-loop queries.",
};

// Help select agents based on type and depth, and assign contribution
function selectAgents(
  type: ResearchProject["researchType"],
  depth: ResearchProject["researchDepth"]
): SelectedAgent[] {
  const agents: AIAgentName[] = ["Planner", "Retrieval", "Evidence", "Knowledge Graph", "Copilot"];

  if (depth === "comprehensive") agents.push("Memory");

  const PIPELINE_ORDER: AIAgentName[] = [
    "Planner",
    "Retrieval",
    "Evidence",
    "Knowledge Graph",
    "Memory",
    "Copilot",
  ];

  const AGENT_IMPORTANCE_BASES: Record<AIAgentName, number> = {
    Planner: 25,
    Retrieval: 25,
    Evidence: 25,
    "Knowledge Graph": 25,
    Memory: 10,
    Copilot: 10,
  };

  // Deduplicate and sort by PIPELINE_ORDER
  const uniqueAgents = Array.from(new Set(agents)).sort(
    (a, b) => PIPELINE_ORDER.indexOf(a) - PIPELINE_ORDER.indexOf(b)
  );

  // Derive weights consistently from complexity (depth) and pipeline importance bases
  const rawContributions = uniqueAgents.map((name) => {
    let base = AGENT_IMPORTANCE_BASES[name] || 10;
    // Adjust based on research complexity (depth)
    if (depth === "quick") {
      if (name === "Retrieval" || name === "Planner") base += 5; // prioritise core planning & query
    } else if (depth === "comprehensive") {
      if (name === "Memory" || name === "Knowledge Graph") base += 5; // prioritise deep analysis
    }
    return base;
  });

  const sum = rawContributions.reduce((a, b) => a + b, 0);
  const selectedAgents: SelectedAgent[] = uniqueAgents.map((name, i) => {
    const contribution = Math.round((rawContributions[i] / sum) * 100);
    
    // Status depends on agent
    let status: SelectedAgent["status"] = "idle";
    if (name === "Planner") status = "completed";
    else if (i === 1) status = "active";
    else if (i === 2) status = "initializing";

    return {
      name,
      purpose: AGENT_CATALOG[name].purpose,
      status,
      importanceScore: contribution,
      reasonSelected: AGENT_REASONS[name] || "Selected to coordinate objectives.",
    };
  });

  // Normalize contribution to sum exactly to 100
  const totalPercentage = selectedAgents.reduce((s, a) => s + a.importanceScore, 0);
  if (totalPercentage !== 100 && selectedAgents.length > 0) {
    selectedAgents[0].importanceScore += (100 - totalPercentage);
  }

  return selectedAgents;
}

export function generateExecutionPlan(project: ResearchProject): ExecutionPlan {
  const titleLower = project.title.toLowerCase() + " " + project.topic.toLowerCase() + " " + project.description.toLowerCase();
  
  let summary = "";
  let objectives: string[] = [];
  let researchQuestions: string[] = [];
  let searchStrategy: ExecutionPlan["searchStrategy"] = {
    keywords: [],
    suggestedSources: [],
    searchPriority: "Medium",
    expectedEvidence: "",
  };
  let estimatedRuntime = "";
  let researchComplexity: ExecutionPlan["researchComplexity"] = "Medium";
  let confidenceScore = 0;



  // Keyword Matching logic
  if (titleLower.includes("quantum") || titleLower.includes("physics") || titleLower.includes("qubit")) {
    summary = `This research project examines quantum computational principles, evaluating physical implementations, noise mitigation techniques, or quantum error correction (QEC) protocols to overcome decoherence constraints in modern hardware architectures.`;
    objectives = [
      "Analyze current gate fidelity metrics and physical qubit limitations in superconducting vs. ion-trap systems.",
      "Compare the resource overhead of Surface Codes and Low-Density Parity-Check (LDPC) codes.",
      "Identify optimal error mitigation frameworks suitable for Noisy Intermediate-Scale Quantum (NISQ) devices."
    ];
    researchQuestions = [
      "What are the physical decoherence thresholds required for fault-tolerant logical qubits under superconducting physical hardware architectures?",
      "How does the state-preparation-and-measurement (SPAM) error rate scale relative to total physical overhead in topological quantum codes?",
      "To what extent can hybrid classical-quantum algorithms (like VQE or QAOA) maintain quantum advantage in the presence of thermal noise?"
    ];
    searchStrategy = {
      keywords: ["quantum error correction", "topological codes overhead", "gate fidelity thresholds", "NISQ mitigation"],
      suggestedSources: ["arXiv (quant-ph)", "IEEE Transactions on Quantum Engineering", "Nature Physics"],
      searchPriority: "High",
      expectedEvidence: "Decoherence threshold values, logical vs. physical qubit ratios, and cryo-thermal energy consumption benchmarks."
    };
  } else if (titleLower.includes("cancer") || titleLower.includes("tumor") || titleLower.includes("immunotherapy") || titleLower.includes("oncology")) {
    summary = `A targeted investigation into molecular oncological path-vectors, focusing on immunological microenvironment modulations, immune checkpoints, or personalized therapeutic resistance pathways (e.g. CAR-T or CRISPR interventions).`;
    objectives = [
      "Map ligand-receptor interactions responsible for T-cell exhaustion within solid tumor microenvironments.",
      "Assess clinical efficacy and toxicity profiles of dual-targeting CAR-T cell construct revisions.",
      "Synthesize genomic markers indicative of tumor resistance to anti-PD-1/anti-PD-L1 checkpoint inhibitors."
    ];
    researchQuestions = [
      "What specific cell-surface phenotypes correlate with the suppression of antigen presentation in metastatic tumor niches?",
      "By what mechanisms do cancer cells exploit alternative checkpoints (e.g., LAG-3, TIM-3) following primary PD-1 blockades?",
      "How do patient-specific HLA genotypes influence the neoantigen presentation quality in response to personalized mRNA cancer vaccines?"
    ];
    searchStrategy = {
      keywords: ["solid tumor microenvironment", "CAR-T cell exhaustion markers", "dual-checkpoint resistance pathways"],
      suggestedSources: ["PubMed", "Nature Medicine", "Journal of Clinical Oncology"],
      searchPriority: "High",
      expectedEvidence: "Immunological marker density profiles, cell-surface phenotypes, and patient HLA genetic distributions."
    };
  } else if (titleLower.includes("climate") || titleLower.includes("carbon") || titleLower.includes("battery") || titleLower.includes("energy") || titleLower.includes("solar")) {
    summary = `An analysis of modern sustainable energy infrastructure and decarbonization mechanisms, examining energy storage kinetics, solar conversion efficiencies, or carbon capture scalability parameters under varying climate scenarios.`;
    objectives = [
      "Evaluate ion-transport kinetics and solid-electrolyte interface (SEI) stability in solid-state battery cells.",
      "Model grid-stability dynamics under 80%+ variable renewable energy (VRE) integration configurations.",
      "Perform a technoeconomic comparison of amine-based direct air capture (DAC) technologies vs. mineral carbonation."
    ];
    researchQuestions = [
      "What electrochemical interfaces maximize ionic conductivity while minimizing dendrite propagation in lithium metal anodes?",
      "What are the optimal localized storage capacities required to prevent curtailment in large-scale solar/wind grids?",
      "How does ambient moisture content impact the thermodynamic regeneration energy required for synthetic sorbents in DAC units?"
    ];
    searchStrategy = {
      keywords: ["solid-state battery SEI passivation", "grid curtailment mitigation", "direct air capture regeneration enthalpy"],
      suggestedSources: ["Energy & Environmental Science", "Journal of Power Sources", "IPCC Reviews"],
      searchPriority: "Medium",
      expectedEvidence: "SEI transport kinetics equations, localized battery storage models, and thermodynamic regeneration values."
    };
  } else if (titleLower.includes("ai") || titleLower.includes("llm") || titleLower.includes("learning") || titleLower.includes("neural") || titleLower.includes("transformer") || titleLower.includes("gpt") || titleLower.includes("model")) {
    summary = `An investigation into deep learning architectures, focusing on scalability, efficiency, optimization algorithms, retrieval mechanisms, or alignment methodologies for Large Language Models (LLMs).`;
    objectives = [
      "Assess parameter efficiency and trade-offs of low-rank adaptation (LoRA) versus full model fine-tuning.",
      "Analyze the impact of retrieval-augmented generation (RAG) context lengths on model attention allocation.",
      "Compare security profiles and robustness of reinforcement learning from human feedback (RLHF) vs. direct preference optimization (DPO)."
    ];
    researchQuestions = [
      "How do deep transformer layers compress context representations during long-document token ingestion?",
      "What is the mathematical threshold at which retrieval augmentation degrades reasoning capacity due to irrelevant prompt insertions?",
      "Through what mechanistic pathways do fine-tuned models bypass alignment guardrails under adversarial prompting?"
    ];
    searchStrategy = {
      keywords: ["transformer needle in a haystack", "parameter efficient fine tuning", "RAG attention degradation"],
      suggestedSources: ["arXiv (cs.CL, cs.LG)", "NeurIPS", "ICLR databases"],
      searchPriority: "High",
      expectedEvidence: "Attention weights degradation thresholds, LoRA mathematical boundaries, and jailbreak guardrail pathways."
    };
  } else if (titleLower.includes("finance") || titleLower.includes("blockchain") || titleLower.includes("market") || titleLower.includes("crypto") || titleLower.includes("defi")) {
    summary = `An evaluation of decentralized financial (DeFi) protocols, market liquidity dynamics, tokenomic stability mechanisms, and systemic risks associated with smart contract dependency networks.`;
    objectives = [
      "Model smart contract execution states and automated market maker (AMM) slippage tolerances.",
      "Assess capital efficiency and liquidation cascades under extreme market volatility scenarios.",
      "Map cross-chain bridging vulnerabilities and consensus security vectors."
    ];
    researchQuestions = [
      "How do liquidity provider (LP) fee structures influence impermanent loss scaling under non-Gaussian asset distributions?",
      "What are the predictive leading indicators of a liquidation cascade in decentralized overcollateralized lending protocols?",
      "Through what cryptographic attack vectors can validators collude to perform MEV (Maximal Extractable Value) arbitrage on layer-2 scaling chains?"
    ];
    searchStrategy = {
      keywords: ["AMM impermanent loss", "DeFi liquidation cascade trigger points", "MEV cross-chain arbitrage"],
      suggestedSources: ["ACM CCS", "Journal of Finance", "DeFi Security Alliance"],
      searchPriority: "High",
      expectedEvidence: "AMM slippage tolerance calculations, lending protocol cascade indicators, and validator arbitrage datasets."
    };
  } else {
    // Default fallback based on type
    const typeLabel = (project.researchType || "general_research").replace("_", " ");
    summary = `A rigorous ${typeLabel} project addressing the topic of "${project.title}". The study systematically establishes the research framework, organizes relevant literature databases, and structures agent validation pipelines.`;
    objectives = [
      `Structure the primary scope of the literature search surrounding "${project.topic || project.title}".`,
      "Deconstruct core findings from top-tier peer-reviewed papers into comparative parameter matrix sheets.",
      "Synthesize conflicting studies to determine areas of high scientific consensus vs. active debate."
    ];
    researchQuestions = [
      `What are the foundational paradigms governing the current literature on ${project.topic || project.title}?`,
      `How do methodological variances between major researchers in this area explain differences in reported findings?`,
      "What theoretical frameworks have the highest explanatory power for the empirical data gathered so far?"
    ];
    searchStrategy = {
      keywords: [project.topic, `${project.title} state of the art`, "empirical analysis methodology"],
      suggestedSources: ["Google Scholar", "Scopus", "IEEE Xplore"],
      searchPriority: "Medium",
      expectedEvidence: "Peer-reviewed comparative parameter charts and empirical verification datasets."
    };
  }

  // Add specific details for upload PDF if it exists
  if (project.uploadedPdfName) {
    summary += ` Additionally, the execution strategy integrates contextual parameters extracted from the uploaded seed document: "${project.uploadedPdfName}".`;
    objectives.unshift(`Extract and index the core methodologies, data arrays, and figures from "${project.uploadedPdfName}".`);
    researchQuestions.unshift(`How do the empirical findings outlined in "${project.uploadedPdfName}" align with or challenge standard industry benchmarks?`);
  }

  // Derive complexity dynamically
  let complexityScore = 5;
  if (project.researchDepth === "comprehensive") complexityScore += 5;
  if (project.researchDepth === "quick") complexityScore -= 2;
  complexityScore += objectives.length + researchQuestions.length;
  
  const topicComplexityKeywords = ["quantum", "cancer", "solid-state", "cryo-thermal", "kinetics", "hla", "megastructures", "decarbonization"];
  topicComplexityKeywords.forEach((kw) => {
    if (titleLower.includes(kw)) complexityScore += 2;
  });

  if (complexityScore >= 16) researchComplexity = "Extreme";
  else if (complexityScore >= 12) researchComplexity = "High";
  else if (complexityScore <= 7) researchComplexity = "Low";
  else researchComplexity = "Medium";

  // Derive estimated runtime dynamically
  const runtimeSecs = 40 + (project.topic.length * 0.25) + (objectives.length * 15) + (researchQuestions.length * 18);
  const mins = Math.floor(runtimeSecs / 60);
  const secs = Math.round(runtimeSecs % 60);
  estimatedRuntime = `${mins}m ${secs.toString().padStart(2, "0")}s`;

  // Derive confidence score dynamically
  confidenceScore = Math.min(
    99,
    Math.max(
      70,
      85 + (objectives.length * 2) + (researchQuestions.length * 1.5) - (researchComplexity === "Extreme" ? 8 : researchComplexity === "High" ? 4 : 0)
    )
  );

  const selectedAgents = selectAgents(project.researchType, project.researchDepth);

  return {
    summary,
    objectives,
    researchQuestions,
    searchStrategy,
    estimatedRuntime,
    researchComplexity,
    confidenceScore,
    selectedAgents,
  };
}
