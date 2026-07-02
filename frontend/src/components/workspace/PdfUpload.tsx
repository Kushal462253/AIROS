"use client";

import { useCallback, useId, useState } from "react";
import { motion } from "framer-motion";

interface PdfUploadProps {
  fileName: string | null;
  onFileSelect: (fileName: string | null) => void;
}

export default function PdfUpload({ fileName, onFileSelect }: PdfUploadProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        onFileSelect(file.name);
      }
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    onFileSelect(null);
  }, [onFileSelect]);

  if (fileName) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 rounded-xl border border-airos-500/20 bg-airos-500/[0.04] px-4 py-3"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        </svg>
        <span className="min-w-0 flex-1 truncate text-sm text-white">
          {fileName}
        </span>
        <button
          type="button"
          onClick={handleRemove}
          aria-label="Remove file"
          className="flex-shrink-0 rounded-lg p-1 text-[--text-muted] transition-colors hover:bg-white/[0.04] hover:text-white"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </motion.div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        relative flex cursor-pointer flex-col items-center justify-center
        rounded-xl border-2 border-dashed px-4 py-6
        transition-all duration-200
        ${
          isDragging
            ? "border-airos-500/40 bg-airos-500/[0.04]"
            : "border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02]"
        }
      `}
    >
      <input
        id={inputId}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleInputChange}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label="Upload PDF file"
      />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isDragging ? "#818cf8" : "#6b6b80"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      <p className="text-xs text-[--text-secondary]">
        <span className="font-medium text-airos-400">Browse</span> or drag & drop
      </p>
      <p className="mt-1 text-[10px] text-[--text-muted]">PDF files only</p>
    </div>
  );
}
