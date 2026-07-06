"use client";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  progress?: number;
  colorClass?: string;
}

export default function MetricCard({
  label,
  value,
  subtext,
  progress,
  colorClass = "text-white",
}: MetricCardProps) {
  return (
    <div className="glass-panel border border-white/[0.04] bg-surface-secondary/20 rounded-2xl p-4 flex flex-col justify-between font-mono text-[10px] h-full">
      <span className="text-[--text-muted] uppercase block tracking-wider">{label}</span>
      
      <div className="mt-3.5 space-y-2">
        <span className={`text-lg font-bold block ${colorClass}`}>{value}</span>
        
        {progress !== undefined && (
          <div className="space-y-1">
            <div className="h-1 w-full bg-white/[0.04] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-airos-600 to-airos-400 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            {subtext && (
              <span className="text-[8px] text-[--text-muted] uppercase block">
                {subtext}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
