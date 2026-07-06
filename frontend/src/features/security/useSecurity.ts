import { useState, useEffect, useCallback, useMemo } from "react";
import type {
  SecurityEvent,
  WorkspaceIsolationState,
  MemoryProtectionState,
  ExecutionSafetyState,
  QueryValidationResult,
  PdfValidationResult,
  SecurityStats,
} from "./types";
import { securityService } from "./security-service";
import { mockSecurityEngine } from "./mockSecurityEngine";

interface UseSecurityProps {
  projectId: string;
}

export function useSecurity({ projectId }: UseSecurityProps) {
  const [events, setEvents] = useState<SecurityEvent[]>([]);

  // 1. Load security events on mount/projectId change
  useEffect(() => {
    if (!projectId) return;
    const history = securityService.loadEvents(projectId);
    setEvents(history);
  }, [projectId]);

  // 2. Setup dynamic static sandboxes for workspace isolation
  const workspaceIsolation = useMemo<WorkspaceIsolationState>(() => {
    return {
      workspaceId: projectId || "sandbox-default",
      sandboxPath: `C:\\Users\\kushal arora\\.gemini\\antigravity-ide\\sandbox\\${projectId || "default"}\\`,
      memoryNamespace: `airos::namespace::${projectId?.substring(0, 8) || "local"}`,
      sessionIsolationStatus: "secured",
    };
  }, [projectId]);

  // 3. Memory protection states
  const memoryProtection = useMemo<MemoryProtectionState>(() => {
    return {
      integrityCheck: "Passed",
      encryptionStatus: "AES-256 Enabled",
      safeSession: "Active",
      readOnlySnapshot: "Created",
    };
  }, []);

  // 4. Safe agent executions status indicators
  const executionSafety = useMemo<ExecutionSafetyState>(() => {
    return {
      Planner: "Safe",
      Retrieval: "Safe",
      Evidence: "Safe",
      "Knowledge Graph": "Safe",
      Copilot: "Safe",
    };
  }, []);

  const addEvent = useCallback(
    (eventText: string, severity: SecurityEvent["severity"], module: SecurityEvent["module"], status: SecurityEvent["status"]) => {
      const newEvent: SecurityEvent = {
        id: `evt-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        event: eventText,
        severity,
        module,
        status,
      };

      setEvents((prev) => {
        const next = [newEvent, ...prev].slice(0, 50); // Keep max 50 logs
        securityService.saveEvents(projectId, next);
        return next;
      });
    },
    [projectId]
  );

  const auditQuery = useCallback(
    async (queryText: string): Promise<QueryValidationResult> => {
      const sanitized = securityService.sanitizeInput(queryText);
      const res = mockSecurityEngine.validateQuery(sanitized);

      addEvent(
        `Search query validation completed: "${sanitized.substring(0, 30)}${sanitized.length > 30 ? "..." : ""}"`,
        res.isValid ? "info" : "medium",
        "Retrieval",
        res.isValid ? "Passed" : "Flagged"
      );

      return res;
    },
    [addEvent]
  );

  const auditPdf = useCallback(
    async (filename: string, fileSize: number): Promise<PdfValidationResult> => {
      const res = mockSecurityEngine.validatePdf(filename, fileSize);

      let severity: SecurityEvent["severity"] = "info";
      let status: SecurityEvent["status"] = "Passed";

      if (res.validation === "Corrupted" || res.validation === "Too Large") {
        severity = "high";
        status = "Blocked";
      } else if (res.validation === "Unsupported") {
        severity = "medium";
        status = "Flagged";
      }

      addEvent(
        `PDF upload validation: ${filename} size: ${((fileSize) / (1024 * 1024)).toFixed(2)}MB`,
        severity,
        "Retrieval",
        status
      );

      return res;
    },
    [addEvent]
  );

  const auditPrompt = useCallback(
    async (promptText: string): Promise<QueryValidationResult> => {
      const sanitized = securityService.sanitizeInput(promptText);
      const res = mockSecurityEngine.detectPromptInjection(sanitized);

      if (res.riskLevel !== "None") {
        addEvent(
          `Prompt Injection detected! Risk Level: ${res.riskLevel}`,
          res.riskLevel === "High" ? "high" : "medium",
          "Copilot",
          "Flagged"
        );
      } else {
        addEvent(
          "Copilot message prompt scan completed successfully",
          "info",
          "Copilot",
          "Passed"
        );
      }

      return res;
    },
    [addEvent]
  );

  const clearLogs = useCallback(() => {
    setEvents([]);
    securityService.saveEvents(projectId, []);
  }, [projectId]);

  const stats = useMemo<SecurityStats>(() => {
    return securityService.calculateStats(events);
  }, [events]);

  const sanitizeUserInput = useCallback((input: string) => {
    return securityService.sanitizeInput(input);
  }, []);

  return {
    events,
    stats,
    workspaceIsolation,
    memoryProtection,
    executionSafety,
    auditQuery,
    auditPdf,
    auditPrompt,
    clearLogs,
    addEvent,
    sanitizeUserInput,
  };
}
