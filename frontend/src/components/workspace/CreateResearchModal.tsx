"use client";

import { useCallback, useId, useState } from "react";
import { motion } from "framer-motion";
import Modal from "@/components/ui/Modal";
import PdfUpload from "./PdfUpload";
import type {
  CreateResearchInput,
  ResearchDepth,
} from "@/features/workspace";
import {
  RESEARCH_DEPTH_LABELS,
} from "@/features/workspace";

interface CreateResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: Omit<CreateResearchInput, "researchType"> & { researchType?: any }) => Promise<void>;
  isLoading: boolean;
}

const TITLE_MAX = 100;

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function CreateResearchModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CreateResearchModalProps) {
  const titleId = useId();
  const topicId = useId();
  const descId = useId();
  const depthId = useId();

  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [researchDepth, setResearchDepth] = useState<ResearchDepth>("standard");
  const [uploadedPdfName, setUploadedPdfName] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Research title is required.";
    else if (title.trim().length > TITLE_MAX)
      newErrors.title = `Title must be ${TITLE_MAX} characters or less.`;
    if (!topic.trim()) newErrors.topic = "Research topic is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [title, topic]);

  const isValid = title.trim().length > 0 && title.trim().length <= TITLE_MAX && topic.trim().length > 0;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      await onSubmit({
        title: title.trim(),
        topic: topic.trim(),
        description: description.trim(),
        researchDepth,
        researchType: "general_research",
        uploadedPdfName,
      });

      /* Reset form */
      setTitle("");
      setTopic("");
      setDescription("");
      setResearchDepth("standard");
      setUploadedPdfName(null);
      setErrors({});
    },
    [title, topic, description, researchDepth, uploadedPdfName, validate, onSubmit]
  );

  const handleClose = useCallback(() => {
    if (isLoading) return;
    onClose();
  }, [isLoading, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="border-b border-white/[0.04] px-6 py-5 sm:px-8">
          <motion.h2
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-xl font-bold text-white"
          >
            Create Research Project
          </motion.h2>
          <motion.p
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.05 }}
            className="mt-1 text-sm text-[--text-secondary]"
          >
            Start a new AI-powered research workflow.
          </motion.p>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] space-y-5 overflow-y-auto px-6 py-6 sm:px-8">
          {/* Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor={titleId} className="block text-sm font-medium text-[--text-secondary]">
                Research Title <span className="text-red-400">*</span>
              </label>
              <span className={`text-xs ${title.length > TITLE_MAX ? "text-red-400" : "text-[--text-muted]"}`}>
                {title.length}/{TITLE_MAX}
              </span>
            </div>
            <input
              id={titleId}
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: "" })); }}
              placeholder="Enter research title"
              maxLength={TITLE_MAX + 10}
              disabled={isLoading}
              className={`
                w-full rounded-xl border bg-surface-secondary/50 px-4 py-3 text-sm text-white
                placeholder-[--text-muted] outline-none transition-all duration-200
                ${errors.title ? "border-red-400/40 focus:border-red-400/60 focus:ring-red-400/10" : "border-white/[0.06] focus:border-airos-500/40 focus:ring-2 focus:ring-airos-500/10"}
                focus:bg-surface-secondary/80 disabled:cursor-not-allowed disabled:opacity-50
              `}
            />
            {errors.title && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="alert" className="text-xs text-red-400">
                {errors.title}
              </motion.p>
            )}
          </div>

          {/* Topic */}
          <div className="space-y-1.5">
            <label htmlFor={topicId} className="block text-sm font-medium text-[--text-secondary]">
              Research Topic <span className="text-red-400">*</span>
            </label>
            <textarea
              id={topicId}
              value={topic}
              onChange={(e) => { setTopic(e.target.value); setErrors((p) => ({ ...p, topic: "" })); }}
              placeholder="Describe the research problem or question..."
              rows={3}
              disabled={isLoading}
              className={`
                w-full resize-none rounded-xl border bg-surface-secondary/50 px-4 py-3 text-sm text-white
                placeholder-[--text-muted] outline-none transition-all duration-200
                ${errors.topic ? "border-red-400/40 focus:border-red-400/60 focus:ring-red-400/10" : "border-white/[0.06] focus:border-airos-500/40 focus:ring-2 focus:ring-airos-500/10"}
                focus:bg-surface-secondary/80 disabled:cursor-not-allowed disabled:opacity-50
              `}
            />
            {errors.topic && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="alert" className="text-xs text-red-400">
                {errors.topic}
              </motion.p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor={descId} className="block text-sm font-medium text-[--text-secondary]">
              Description <span className="text-[--text-muted]">(optional)</span>
            </label>
            <textarea
              id={descId}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional context or objectives..."
              rows={2}
              disabled={isLoading}
              className="
                w-full resize-none rounded-xl border border-white/[0.06] bg-surface-secondary/50 px-4 py-3 text-sm text-white
                placeholder-[--text-muted] outline-none transition-all duration-200
                focus:border-airos-500/40 focus:ring-2 focus:ring-airos-500/10 focus:bg-surface-secondary/80
                disabled:cursor-not-allowed disabled:opacity-50
              "
            />
          </div>

          {/* Research Depth */}
          <div className="space-y-1.5">
            <label htmlFor={depthId} className="block text-sm font-medium text-[--text-secondary]">
              Research Depth
            </label>
            <select
              id={depthId}
              value={researchDepth}
              onChange={(e) => setResearchDepth(e.target.value as ResearchDepth)}
              disabled={isLoading}
              className="
                w-full appearance-none rounded-xl border border-white/[0.06] bg-surface-secondary/50 px-4 py-3 text-sm text-white
                outline-none transition-all duration-200
                focus:border-airos-500/40 focus:ring-2 focus:ring-airos-500/10 focus:bg-surface-secondary/80
                disabled:cursor-not-allowed disabled:opacity-50
              "
            >
              {(Object.entries(RESEARCH_DEPTH_LABELS) as [ResearchDepth, string][]).map(
                ([value, label]) => (
                  <option key={value} value={value} className="bg-surface-secondary text-white">
                    {label}
                  </option>
                )
              )}
            </select>
          </div>

          {/* PDF Upload */}
          <div className="space-y-1.5">
            <p className="block text-sm font-medium text-[--text-secondary]">
              PDF Upload <span className="text-[--text-muted]">(optional)</span>
            </p>
            <PdfUpload fileName={uploadedPdfName} onFileSelect={setUploadedPdfName} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-white/[0.04] px-6 py-4 sm:px-8">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="
              rounded-xl border border-white/[0.06] bg-surface-secondary/50 px-5 py-2.5
              text-sm font-medium text-[--text-secondary]
              transition-all duration-200
              hover:bg-surface-secondary/80 hover:text-white
              active:scale-[0.98]
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="
              relative flex items-center gap-2 rounded-xl bg-airos-600 px-5 py-2.5
              text-sm font-semibold text-white
              transition-all duration-200
              hover:bg-airos-500 hover:shadow-lg hover:shadow-airos-600/20
              active:scale-[0.98]
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                Creating...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Create Research
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
