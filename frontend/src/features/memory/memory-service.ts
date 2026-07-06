import type { MemoryState } from "./types";

const MEMORY_KEY_PREFIX = "airos_memory_";

export const memoryService = {
  /**
   * Loads the project-scoped memory state from localStorage.
   */
  loadMemory(projectId: string): MemoryState | null {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem(`${MEMORY_KEY_PREFIX}${projectId}`);
      if (data) {
        return JSON.parse(data) as MemoryState;
      }
    } catch (e) {
      console.error("[MEMORY_SERVICE] Failed to load memory:", e);
    }
    return null;
  },

  /**
   * Persists the project-scoped memory state to localStorage.
   */
  saveMemory(projectId: string, state: MemoryState): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        `${MEMORY_KEY_PREFIX}${projectId}`,
        JSON.stringify(state)
      );
    } catch (e) {
      console.error("[MEMORY_SERVICE] Failed to save memory:", e);
    }
  },

  /**
   * Clears the project memory storage.
   */
  clearMemory(projectId: string): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(`${MEMORY_KEY_PREFIX}${projectId}`);
    } catch (e) {
      console.error("[MEMORY_SERVICE] Failed to clear memory:", e);
    }
  },
};
