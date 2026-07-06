"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PDFDocument } from "../types";

interface PdfUploaderProps {
  pdfs: PDFDocument[];
  isUploading: boolean;
  uploadProgress: number;
  onUpload: (file: File) => void;
  onClear?: (id: string) => void;
}

export default function PdfUploader({
  pdfs,
  isUploading,
  uploadProgress,
  onUpload,
  onClear,
}: PdfUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type === "application/pdf") {
        onUpload(file);
      }
    },
    [onUpload]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type === "application/pdf") {
        onUpload(file);
      }
    },
    [onUpload]
  );

  if (pdfs.length > 0) {
    const pdf = pdfs[0];
    return (
      <div className="space-y-3">
        <h4 className="font-mono text-[10px] font-semibold text-[--text-secondary] uppercase tracking-wider">
          PDF Pipeline & Storage
        </h4>

        <div className="border border-emerald-500/20 bg-emerald-500/[0.02] p-4 rounded-lg relative overflow-hidden space-y-3">
          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            </svg>
            <div className="min-w-0 flex-1">
              <h5 className="text-xs font-bold text-white truncate">{pdf.filename}</h5>
              <p className="text-[9px] font-mono text-emerald-400 mt-0.5">MANUSCRIPT VECTORIZED</p>
            </div>
          </div>

          <div className="space-y-2 font-mono text-[9px] text-[--text-secondary] border-t border-white/[0.04] pt-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[--text-muted] uppercase">Status</span>
              <span className="font-bold text-emerald-400">✓ Vectorized</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[--text-muted] uppercase">Chunks</span>
              <span className="text-white font-bold">{pdf.chunks_count} Paragraphs</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[--text-muted] uppercase">Format</span>
              <span className="text-white font-bold">1536-dim (Chroma)</span>
            </div>
          </div>

          <div className="flex gap-2">
            <label className="flex-1 flex items-center justify-center cursor-pointer rounded bg-white/[0.02] hover:bg-indigo-500/10 text-white font-semibold text-[10px] py-1.5 border border-white/[0.06] transition-all duration-200 text-center">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              Replace PDF
            </label>
            {onClear && (
              <button
                onClick={() => onClear(pdf.id)}
                className="flex-1 rounded bg-white/[0.02] hover:bg-rose-500/10 text-rose-400 font-semibold text-[10px] py-1.5 border border-white/[0.06] transition-all duration-200 text-center"
              >
                Remove PDF
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-mono text-[10px] font-semibold text-[--text-secondary] uppercase tracking-wider">
        PDF Pipeline & Storage
      </h4>

      {/* Drag & Drop Ingest Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center cursor-pointer transition-all duration-200 min-h-[110px]
          ${
            isDragging
              ? "border-airos-400 bg-airos-500/[0.02]"
              : "border-white/[0.06] bg-white/[0.01] hover:border-white/[0.12] hover:bg-white/[0.02]"
          }
        `}
      >
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={isUploading}
          className="absolute inset-0 cursor-pointer opacity-0"
        />

        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isDragging ? "#818cf8" : "#6b6b80"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>

        <p className="text-xs text-[--text-secondary]">
          <span className="font-semibold text-airos-400">Browse</span> or drag PDF here
        </p>
        <p className="mt-1 text-[9px] text-[--text-muted]">MANUSCRIPT INDEXING TO CHROMADB</p>
      </div>

      {/* Uploading Progress Panel */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel rounded-xl border border-airos-500/20 bg-airos-500/[0.03] p-4 relative overflow-hidden space-y-3.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white inline-flex items-center gap-2">
                <svg className="animate-spin h-3 w-3 text-airos-400" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing Manuscript
              </span>
              <span className="font-mono text-xs text-airos-300 font-bold">{uploadProgress}%</span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-airos-600 to-airos-400 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>

            {/* Pipeline Stages */}
            <div className="space-y-1.5 font-mono text-[9px] border-t border-white/[0.04] pt-2.5">
              <div className="flex items-center justify-between">
                <span className={uploadProgress >= 10 ? "text-white" : "text-[--text-muted]"}>
                  [STAGE 1] Ingest & Extract
                </span>
                <span className={uploadProgress >= 35 ? "text-emerald-400" : uploadProgress >= 10 ? "text-indigo-400 animate-pulse" : "text-[--text-muted]"}>
                  {uploadProgress >= 35 ? "DONE" : uploadProgress >= 10 ? "RUNNING" : "PENDING"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={uploadProgress >= 40 ? "text-white" : "text-[--text-muted]"}>
                  [STAGE 2] Tokenize & Paragraph Chunk
                </span>
                <span className={uploadProgress >= 75 ? "text-emerald-400" : uploadProgress >= 40 ? "text-indigo-400 animate-pulse" : "text-[--text-muted]"}>
                  {uploadProgress >= 75 ? "DONE" : uploadProgress >= 40 ? "RUNNING" : "PENDING"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={uploadProgress >= 80 ? "text-white" : "text-[--text-muted]"}>
                  [STAGE 3] Vectorize & Index (ChromaDB)
                </span>
                <span className={uploadProgress >= 100 ? "text-emerald-400" : uploadProgress >= 80 ? "text-indigo-400 animate-pulse" : "text-[--text-muted]"}>
                  {uploadProgress >= 100 ? "DONE" : uploadProgress >= 80 ? "RUNNING" : "PENDING"}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
