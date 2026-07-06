import { useEffect, useState, useRef } from "react";
import type { ResearchProject } from "@/features/workspace";
import type { PlanningStage, ExecutionPlan } from "./types";
import { generateExecutionPlan } from "./mockData";

const INITIAL_STAGES: PlanningStage[] = [
  { id: "intent", name: "Understanding Research Intent", status: "pending" },
  { id: "objectives", name: "Identifying Objectives", status: "pending" },
  { id: "questions", name: "Extracting Research Questions", status: "pending" },
  { id: "agents", name: "Selecting Required AI Agents", status: "pending" },
  { id: "plan", name: "Building Execution Plan", status: "pending" },
  { id: "complexity", name: "Estimating Research Complexity", status: "pending" },
  { id: "runtime", name: "Estimating Runtime", status: "pending" },
  { id: "complete", name: "Execution Plan Ready", status: "pending" },
];

export interface UsePlannerOptions {
  stepDurationMs?: number;
}

export function usePlanner(
  project: ResearchProject | undefined,
  initialPlan?: ExecutionPlan | null,
  options?: UsePlannerOptions
) {
  const [stages, setStages] = useState<PlanningStage[]>(() => {
    if (initialPlan) {
      return INITIAL_STAGES.map((s) => ({ ...s, status: "completed" }));
    }
    return INITIAL_STAGES;
  });
  const [isPlanningComplete, setIsPlanningComplete] = useState(
    () => initialPlan !== null && initialPlan !== undefined
  );
  const [executionPlan, setExecutionPlan] = useState<ExecutionPlan | null>(
    () => initialPlan || null
  );
  const hasStarted = useRef(false);

  useEffect(() => {
    if (initialPlan) {
      setStages(INITIAL_STAGES.map((s) => ({ ...s, status: "completed" })));
      setIsPlanningComplete(true);
      setExecutionPlan(initialPlan);
      hasStarted.current = true;
      return;
    }

    if (!project || hasStarted.current) return;
    hasStarted.current = true;

    // Reset state
    setStages(INITIAL_STAGES.map((s) => ({ ...s, status: "pending" })));
    setIsPlanningComplete(false);
    setExecutionPlan(null);

    const stepDuration = options?.stepDurationMs ?? 700; // time in ms for each stage run
    let currentStep = 0;

    // Step 0 starts running immediately
    setStages((prev) =>
      prev.map((s, idx) => (idx === 0 ? { ...s, status: "running" } : s))
    );

    const interval = setInterval(() => {
      currentStep++;

      if (currentStep < INITIAL_STAGES.length) {
        setStages((prev) =>
          prev.map((s, idx) => {
            if (idx === currentStep - 1) {
              return { ...s, status: "completed" };
            }
            if (idx === currentStep) {
              return { ...s, status: "running" };
            }
            return s;
          })
        );
      } else {
        // Planning complete
        clearInterval(interval);
        setStages((prev) =>
          prev.map((s) => ({ ...s, status: "completed" }))
        );
        
        // Generate mock plan
        const plan = generateExecutionPlan(project);
        setExecutionPlan(plan);
        setIsPlanningComplete(true);
      }
    }, stepDuration);

    return () => {
      clearInterval(interval);
      hasStarted.current = false;
    };
  }, [project, initialPlan]);

  return {
    stages,
    isPlanningComplete,
    executionPlan,
  };
}
