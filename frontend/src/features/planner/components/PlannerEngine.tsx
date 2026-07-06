"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ResearchProject } from "@/features/workspace";
import { usePlanner } from "../usePlanner";
import PlannerTimeline from "./PlannerTimeline";
import ExecutionPlanView from "./ExecutionPlanView";
import type { ExecutionPlan } from "../types";

interface PlannerEngineProps {
  project: ResearchProject;
  onComplete?: (plan: ExecutionPlan) => void;
  initialPlan?: ExecutionPlan | null;
}

export default function PlannerEngine({ project, onComplete, initialPlan }: PlannerEngineProps) {
  const { stages, isPlanningComplete, executionPlan } = usePlanner(project, initialPlan);
  const hasCalledComplete = useRef(false);

  useEffect(() => {
    if (isPlanningComplete && executionPlan && onComplete && !hasCalledComplete.current) {
      hasCalledComplete.current = true;
      onComplete(executionPlan);
    }
  }, [isPlanningComplete, executionPlan, onComplete]);

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!isPlanningComplete ? (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="py-6"
          >
            <PlannerTimeline stages={stages} />
          </motion.div>
        ) : (
          executionPlan && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <ExecutionPlanView plan={executionPlan} />
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
