import type { QueryValidationResult, PdfValidationResult, PromptInjectionRisk } from "./types";

export const mockSecurityEngine = {
  /**
   * Evaluates query formatting, symbols, repetitions, and lengths.
   */
  validateQuery(query: string): QueryValidationResult {
    const trimmed = query.trim();
    const violations: string[] = [];
    let riskScore = 0;

    if (!trimmed) {
      violations.push("Empty search request");
      riskScore = 15;
    }

    if (trimmed.length > 150) {
      violations.push(`Oversized input length: ${trimmed.length} characters (Max: 150)`);
      riskScore += 30;
    }

    // Repeated token check
    const words = trimmed.toLowerCase().split(/\s+/);
    const wordCounts: Record<string, number> = {};
    let maxRepetition = 0;
    words.forEach((w) => {
      if (w.length > 2) {
        wordCounts[w] = (wordCounts[w] || 0) + 1;
        if (wordCounts[w] > maxRepetition) {
          maxRepetition = wordCounts[w];
        }
      }
    });

    if (maxRepetition >= 4) {
      violations.push(`Repeated token limit reached: word repeats ${maxRepetition} times`);
      riskScore += 25;
    }

    // Suspicious SQL / command patterns / symbols check
    const suspiciousPatterns = [
      { pattern: /<script/i, label: "Script element injection attempt" },
      { pattern: /select\s+.*\s+from/i, label: "Structured SQL token attempt" },
      { pattern: /union\s+select/i, label: "Structured SQL UNION attempt" },
      { pattern: /--/i, label: "Inline command-line comment sequence" },
      { pattern: /exec\s+\(/i, label: "System execution command call" },
      { pattern: /[\{\}\[\]\<\>]/i, label: "Bracket tags formatting symbols" },
    ];

    suspiciousPatterns.forEach((p) => {
      if (p.pattern.test(trimmed)) {
        violations.push(p.label);
        riskScore += 35;
      }
    });

    // Derive Risk level
    let riskLevel: PromptInjectionRisk = "None";
    if (riskScore >= 70) riskLevel = "High";
    else if (riskScore >= 40) riskLevel = "Medium";
    else if (riskScore > 0) riskLevel = "Low";

    return {
      isValid: violations.length === 0,
      riskScore: Math.min(riskScore, 100),
      riskLevel,
      violations,
      explanation: violations.length > 0
        ? `Found ${violations.length} query pattern discrepancy warnings.`
        : "Query passed all structural integrity and sanitization benchmarks.",
    };
  },

  /**
   * Evaluates prompt text against common prompt injection payloads.
   */
  detectPromptInjection(prompt: string): QueryValidationResult {
    const trimmed = prompt.trim().toLowerCase();
    const violations: string[] = [];
    let riskScore = 0;

    const rules = [
      {
        pattern: /ignore\s+(?:all\s+)?(?:prior\s+|previous\s+)?instructions/i,
        label: "Instruction override payload ('ignore previous instructions')",
        risk: 50,
      },
      {
        pattern: /reveal\s+(?:your\s+)?(?:system\s+)?prompt/i,
        label: "System configuration leak payload ('reveal system prompt')",
        risk: 45,
      },
      {
        pattern: /override\s+planner/i,
        label: "Planner configuration override payload",
        risk: 40,
      },
      {
        pattern: /delete\s+(?:all\s+)?memory/i,
        label: "Memory wipe execution payload",
        risk: 45,
      },
      {
        pattern: /execute\s+arbitrary\s+/i,
        label: "Remote code command payload",
        risk: 60,
      },
      {
        pattern: /pretend\s+to\s+be\s+(?:a\s+)?system/i,
        label: "Role assumption simulation ('pretend to be system')",
        risk: 35,
      },
      {
        pattern: /you\s+are\s+now\s+(?:a\s+)?system/i,
        label: "Role prompt overwrite sequence",
        risk: 35,
      },
    ];

    rules.forEach((rule) => {
      if (rule.pattern.test(trimmed)) {
        violations.push(rule.label);
        riskScore += rule.risk;
      }
    });

    let riskLevel: PromptInjectionRisk = "None";
    if (riskScore >= 75) riskLevel = "High";
    else if (riskScore >= 35) riskLevel = "Medium";
    else if (riskScore > 0) riskLevel = "Low";

    return {
      isValid: violations.length === 0,
      riskScore: Math.min(riskScore, 100),
      riskLevel,
      violations,
      explanation: violations.length > 0
        ? `Adversarial prompts flagged: ${violations.join(", ")}.`
        : "No prompt injection risk patterns detected in user input.",
    };
  },

  /**
   * Validates manuscript constraints such as size, mime-type, and double extensions.
   */
  validatePdf(filename: string, fileSize: number): PdfValidationResult {
    const ext = filename.split(".").pop()?.toLowerCase();
    
    // Check malicious double extensions
    if (filename.toLowerCase().includes(".pdf.exe") || filename.toLowerCase().includes(".pdf.bat")) {
      return {
        filename,
        fileSize,
        validation: "Corrupted",
        details: "Executable disguise payload detected (.pdf.exe / .pdf.bat).",
      };
    }

    if (ext !== "pdf") {
      return {
        filename,
        fileSize,
        validation: "Unsupported",
        details: `Invalid file extension: .${ext} (Only .pdf files are supported).`,
      };
    }

    // Check size limit: 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (fileSize > MAX_SIZE) {
      return {
        filename,
        fileSize,
        validation: "Too Large",
        details: `File size ${((fileSize) / (1024 * 1024)).toFixed(2)}MB exceeds maximum allowed 10.00MB context budget.`,
      };
    }

    return {
      filename,
      fileSize,
      validation: "Safe",
      details: "PDF format and envelope parameters verified as safe.",
    };
  },
};
