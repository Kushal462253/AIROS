"use client";

import { useEvaluation } from "../useEvaluation";
import type { ExecutionPlan } from "@/features/planner";
import type { PaperResult } from "@/features/retrieval";
import type { EvidenceItem } from "@/features/evidence";
import type { KnowledgeGraph } from "@/features/knowledge-graph";

import MetricCard from "./MetricCard";
import PipelineHealth from "./PipelineHealth";
import PerformanceStats from "./PerformanceStats";
import QualityMetrics from "./QualityMetrics";
import SystemStatus from "./SystemStatus";
import HealthOverview from "./HealthOverview";

interface EvaluationPanelProps {
  plan: ExecutionPlan | null;
  papers: PaperResult[];
  pdfs: any[];
  evidence: EvidenceItem[];
  knowledgeGraph: KnowledgeGraph | null;
  conversations: any[];
  securityScore: number;
}

export default function EvaluationPanel({
  plan,
  papers,
  pdfs,
  evidence,
  knowledgeGraph,
  conversations,
  securityScore,
}: EvaluationPanelProps) {
  const { metrics, pipelineHealth, quality, performance, insights, systemStatus } = useEvaluation({
    plan,
    papers,
    pdfs,
    evidence,
    knowledgeGraph,
    conversations,
    securityScore,
  });

  const hasGraph = knowledgeGraph !== null && knowledgeGraph.nodes.length > 0;

  const activity = {
    agentActive: plan !== null,
    memorySynced: papers.length > 0 || pdfs.length > 0,
    retrievalReady: papers.length > 0,
    graphReady: hasGraph,
    copilotReady: hasGraph,
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-bold text-white tracking-wide uppercase font-mono tracking-widest">
            System Evaluation & Health
          </h3>
          <p className="text-xs text-[--text-secondary]">
            Real-time diagnostic benchmarks, latency analysis, and quality matrix indicators.
          </p>
        </div>
      </div>

      {/* Grid: Diagnostics Score Card + Metrics counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <MetricCard label="System Score" value={`${metrics.overallScore}%`} progress={metrics.overallScore} colorClass="text-gradient-airos" />
        <MetricCard label="Pipeline Completion" value={`${metrics.pipelineCompletion}%`} progress={metrics.pipelineCompletion} />
        <MetricCard label="Agent Core Health" value={`${metrics.agentHealth}%`} progress={metrics.agentHealth} />
        <MetricCard label="Memory Sync Level" value={`${metrics.memoryHealth}%`} progress={metrics.memoryHealth} colorClass="text-violet-400" />
        <MetricCard label="Retrieval Quality" value={`${metrics.retrievalQuality}%`} progress={metrics.retrievalQuality} colorClass="text-blue-400" />
        <MetricCard label="Evidence Quality" value={`${metrics.evidenceQuality}%`} progress={metrics.evidenceQuality} colorClass="text-emerald-400" />
        <MetricCard label="Graph Coverage" value={`${metrics.kgCoverage}%`} progress={metrics.kgCoverage} colorClass="text-cyan-400" />
      </div>

      {/* Secondary Panels Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Diagnostics status rings + health checks list */}
        <div className="space-y-6 lg:col-span-1">
          <SystemStatus status={systemStatus} score={metrics.overallScore} />
          <HealthOverview activity={activity} />
        </div>

        {/* Middle Column: Quality metrics + pipeline stages status list */}
        <div className="space-y-6 lg:col-span-1">
          <QualityMetrics quality={quality} />
          <PipelineHealth pipeline={pipelineHealth} />
        </div>

        {/* Right Column: performance runtimes + project insights counters */}
        <div className="space-y-6 lg:col-span-1">
          <PerformanceStats performance={performance} />
          
          {/* Project Ingest Insights Card */}
          <div className="glass-panel border border-white/[0.04] bg-surface-secondary/20 rounded-2xl p-5 space-y-4 flex flex-col justify-between h-full font-mono text-[10px]">
            <span className="text-[--text-muted] uppercase tracking-widest block border-b border-white/[0.04] pb-2 mb-1">
              // PROJECT_SANDBOX_INSIGHTS
            </span>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="flex justify-between items-center p-2 rounded border border-white/[0.02] bg-white/[0.01]">
                <span className="text-[8px] text-[--text-muted] uppercase">Objectives</span>
                <span className="text-white text-xs font-bold">{insights.objectivesCount}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded border border-white/[0.02] bg-white/[0.01]">
                <span className="text-[8px] text-[--text-muted] uppercase">Indexed PDFs</span>
                <span className="text-white text-xs font-bold">{insights.pdfsCount}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded border border-white/[0.02] bg-white/[0.01]">
                <span className="text-[8px] text-[--text-muted] uppercase">Retrieved papers</span>
                <span className="text-white text-xs font-bold">{insights.papersCount}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded border border-white/[0.02] bg-white/[0.01]">
                <span className="text-[8px] text-[--text-muted] uppercase">Claims</span>
                <span className="text-white text-xs font-bold">{insights.evidenceCount}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded border border-white/[0.02] bg-white/[0.01]">
                <span className="text-[8px] text-[--text-muted] uppercase">Nodes</span>
                <span className="text-white text-xs font-bold">{insights.kgNodesCount}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded border border-white/[0.02] bg-white/[0.01]">
                <span className="text-[8px] text-[--text-muted] uppercase">Relations</span>
                <span className="text-white text-xs font-bold">{insights.kgEdgesCount}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded border border-white/[0.02] bg-white/[0.01] col-span-2">
                <span className="text-[8px] text-[--text-muted] uppercase">Conversations history</span>
                <span className="text-white text-xs font-bold">{insights.conversationsCount} messages</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
