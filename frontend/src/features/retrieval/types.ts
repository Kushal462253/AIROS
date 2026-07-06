export type SourceType = "arXiv" | "Semantic Scholar" | "Web" | "PDF";

export interface PaperResult {
  title: string;
  authors: string;
  source: string;
  abstract: string;
  publicationYear: number;
  relevanceScore: number;
  sourceType: SourceType;
  url?: string;
}

export interface PDFDocument {
  filename: string;
  chunks_count: number;
  status: "processed" | "failed" | "processing";
  progress?: number; // Visual uploads state
}

export interface RAGContext {
  id: string;
  document: string;
  metadata: {
    source: string;
    chunk_index: number;
    project_id: string;
    total_chunks: number;
    [key: string]: string | number | boolean | null | undefined;
  };
  score: number;
}

export type SearchState = "idle" | "searching" | "retrieving" | "ranking" | "deduplicating" | "preparing" | "complete";
