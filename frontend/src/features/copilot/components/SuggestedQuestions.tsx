"use client";

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
  activeTab?: string;
}

const STARTER_QUESTIONS: Record<string, string[]> = {
  overview: [
    "Explain my research objectives",
    "What have we done so far?",
    "Summarize project memory",
  ],
  literature: [
    "Summarize retrieved papers",
    "Explain uploaded manuscript",
    "List search methodologies",
  ],
  evidence: [
    "Show strongest evidence",
    "List validation claims",
    "What parameters are tested?",
  ],
  knowledgeGraph: [
    "Explain the knowledge graph",
    "Which concepts are most connected?",
    "Show clusters of concepts",
  ],
};

export default function SuggestedQuestions({ onSelect, activeTab = "overview" }: SuggestedQuestionsProps) {
  const questions = STARTER_QUESTIONS[activeTab] || STARTER_QUESTIONS.overview;

  return (
    <div className="space-y-2">
      <span className="font-mono text-[9px] text-[--text-muted] uppercase tracking-wider block">
        Suggested Research Queries
      </span>
      <div className="flex flex-wrap gap-2">
        {questions.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="
              text-[10px] text-[--text-secondary] bg-white/[0.02] border border-white/[0.04] hover:border-airos-500/40 hover:bg-white/[0.04] rounded-lg px-2.5 py-1.5 transition-all duration-200 font-mono select-none
            "
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
