import { apiClient } from "@/services";
import type { PaperResult, PDFDocument, RAGContext } from "./types";

export const retrievalService = {
  /**
   * Search publications matching the topic query.
   */
  async searchPublications(query: string, topic?: string, limit: number = 4): Promise<PaperResult[]> {
    const topicParam = topic ? `&topic=${encodeURIComponent(topic)}` : "";
    return apiClient.get<PaperResult[]>(
      `/api/v1/retrieval/search?query=${encodeURIComponent(query)}&limit=${limit}${topicParam}`
    );
  },

  /**
   * Upload PDF document with multipart stream.
   */
  async uploadPdf(
    projectId: string,
    file: File
  ): Promise<{ filename: string; chunks_count: number; status: string }> {
    const formData = new FormData();
    formData.append("projectId", projectId);
    formData.append("file", file);

    return apiClient.post<{ filename: string; chunks_count: number; status: string }>(
      "/api/v1/retrieval/upload-pdf",
      formData
    );
  },

  /**
   * Performs RAG search retrieving context chunks from project collections.
   */
  async searchContext(projectId: string, query: string, limit: number = 5): Promise<RAGContext[]> {
    return apiClient.post<RAGContext[]>("/api/v1/retrieval/rag-search", {
      projectId,
      query,
      limit,
    });
  },

  /**
   * Retrieves list of uploaded PDF files registered inside project collections.
   */
  async listUploadedPdfs(projectId: string): Promise<PDFDocument[]> {
    return apiClient.get<PDFDocument[]>(
      `/api/v1/retrieval/uploaded-pdfs?projectId=${encodeURIComponent(projectId)}`
    );
  },
};
