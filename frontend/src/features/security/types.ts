export interface SecurityEvent {
  id: string;
  timestamp: string;
  event: string;
  severity: "info" | "low" | "medium" | "high";
  module: "Planner" | "Retrieval" | "Evidence" | "Knowledge Graph" | "Copilot" | "Memory" | "Workspace" | "Security";
  status: "Passed" | "Blocked" | "Flagged" | "Verified";
}

export interface WorkspaceIsolationState {
  workspaceId: string;
  sandboxPath: string;
  memoryNamespace: string;
  sessionIsolationStatus: "active" | "secured";
}

export interface MemoryProtectionState {
  integrityCheck: "Passed" | "Failed";
  encryptionStatus: "AES-256 Enabled" | "Disabled";
  safeSession: "Active" | "Inactive";
  readOnlySnapshot: "Created" | "Pending";
}

export interface ExecutionSafetyState {
  Planner: "Safe" | "Warning" | "Blocked";
  Retrieval: "Safe" | "Warning" | "Blocked";
  Evidence: "Safe" | "Warning" | "Blocked";
  "Knowledge Graph": "Safe" | "Warning" | "Blocked";
  Copilot: "Safe" | "Warning" | "Blocked";
}

export type PromptInjectionRisk = "None" | "Low" | "Medium" | "High";

export interface QueryValidationResult {
  isValid: boolean;
  riskScore: number; // 0 to 100
  riskLevel: PromptInjectionRisk;
  violations: string[];
  explanation: string;
}

export interface PdfValidationResult {
  filename: string;
  fileSize: number; // in bytes
  validation: "Safe" | "Unsupported" | "Too Large" | "Corrupted";
  details: string;
}

export interface SecurityStats {
  queriesValidated: number;
  pdfsValidated: number;
  threatsDetected: number;
  injectionAttempts: number;
  safeExecutions: number;
  workspaceChecks: number;
  overallSecurityScore: number; // 0 to 100
}
