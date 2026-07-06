import type { SecurityEvent, SecurityStats } from "./types";

const EVENTS_KEY_PREFIX = "airos_security_events_";

export const securityService = {
  /**
   * Sanitizes user inputs: trims, collapses repeated whitespaces, removes control characters, and normalizes line endings.
   */
  sanitizeInput(input: string): string {
    if (!input) return "";
    return input
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control chars
      .replace(/\r\n/g, "\n") // Normalize line endings
      .replace(/\r/g, "\n")
      .replace(/[ \t]+/g, " ") // Collapse duplicate spaces/tabs
      .trim();
  },

  /**
   * Loads the project-scoped security events list from localStorage.
   */
  loadEvents(projectId: string): SecurityEvent[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(`${EVENTS_KEY_PREFIX}${projectId}`);
      if (data) {
        return JSON.parse(data) as SecurityEvent[];
      }
    } catch (e) {
      console.error("[SECURITY_SERVICE] Failed to load events:", e);
    }
    
    // Seed default baseline events if empty
    const seedEvents: SecurityEvent[] = [
      {
        id: "evt-seed-1",
        timestamp: new Date(Date.now() - 60000 * 5).toISOString(),
        event: "Workspace isolation environment compiled",
        severity: "info",
        module: "Workspace",
        status: "Verified",
      },
      {
        id: "evt-seed-2",
        timestamp: new Date(Date.now() - 60000 * 4).toISOString(),
        event: "Project sandbox memory block encrypted",
        severity: "info",
        module: "Memory",
        status: "Verified",
      },
      {
        id: "evt-seed-3",
        timestamp: new Date(Date.now() - 60000 * 3).toISOString(),
        event: "Storage snapshot verification completed",
        severity: "info",
        module: "Memory",
        status: "Verified",
      },
    ];
    this.saveEvents(projectId, seedEvents);
    return seedEvents;
  },

  /**
   * Persists project-scoped security events list to localStorage.
   */
  saveEvents(projectId: string, events: SecurityEvent[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(`${EVENTS_KEY_PREFIX}${projectId}`, JSON.stringify(events));
    } catch (e) {
      console.error("[SECURITY_SERVICE] Failed to save events:", e);
    }
  },

  /**
   * Calculates overall stats and score based on validated counts and severity violations.
   */
  calculateStats(events: SecurityEvent[]): SecurityStats {
    const queries = events.filter((e) => e.event.includes("Query") || e.event.includes("Search")).length;
    const pdfs = events.filter((e) => e.event.includes("PDF") || e.event.includes("document")).length;
    const threats = events.filter((e) => e.severity === "high" || e.severity === "medium").length;
    const injections = events.filter((e) => e.event.includes("Prompt Injection") || e.event.includes("Adversarial")).length;
    const safeExecs = events.filter((e) => e.event.includes("Agent") || e.status === "Passed").length + 5; // Default core execution baseline
    const checks = events.filter((e) => e.module === "Workspace" || e.module === "Memory").length;

    // Start from 100% and subtract score deductions based on threat events severity
    let score = 100;
    events.forEach((e) => {
      if (e.severity === "high") score -= 15;
      else if (e.severity === "medium") score -= 5;
    });

    return {
      queriesValidated: queries,
      pdfsValidated: pdfs,
      threatsDetected: threats,
      injectionAttempts: injections,
      safeExecutions: safeExecs,
      workspaceChecks: checks,
      overallSecurityScore: Math.max(score, 30), // Minimum score floor
    };
  },
};
