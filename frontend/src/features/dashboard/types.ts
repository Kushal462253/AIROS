import type { AIAgentName } from "@/features/planner";

export interface FutureAgent {
  name: AIAgentName;
  purpose: string;
  status: string;
  estimatedRuntime: string;
  dependencies: string[];
  priority: "High" | "Medium" | "Low";
}
