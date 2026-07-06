export type SourceType = "arXiv" | "Semantic Scholar" | "Web" | "PDF";

export type EvidenceStrength = "Strong" | "Moderate" | "Weak";

export type EvidenceCategory =
  | "Methodology"
  | "Experimental Result"
  | "Benchmark"
  | "Dataset"
  | "Observation"
  | "Statistical Result"
  | "Theoretical Finding"
  | "Limitation"
  | "Future Work";

export interface EvidenceItem {
  id: string;
  title: string;
  sourcePaper: string;
  sourceType: SourceType;
  citation: string;
  extractedClaim: string;
  supportingEvidence: string;
  confidenceScore: number;
  evidenceStrength: EvidenceStrength;
  evidenceCategory: EvidenceCategory;
  relatedObjective: string;
  relatedResearchQuestion: string;
  extractionTimestamp: string;
  status: "extracted" | "pending" | "processing";
}
