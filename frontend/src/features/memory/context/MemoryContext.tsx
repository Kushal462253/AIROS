"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { MemoryState, MemoryStatus } from "../types";
import { memoryService } from "../memory-service";

interface MemoryContextType {
  memoryState: MemoryState;
  memoryStatus: MemoryStatus;
  updateMemory: (updates: Partial<MemoryState>) => void;
  resetMemory: () => void;
  clearMemory: () => void;
}

const DEFAULT_STATE: MemoryState = {
  projectMetadata: null,
  plannerOutput: null,
  retrievedPapers: [],
  uploadedPdfs: [],
  retrievedContext: [],
};

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

export function MemoryProvider({
  projectId,
  children,
}: {
  projectId: string;
  children: React.ReactNode;
}) {
  const [memoryState, setMemoryState] = useState<MemoryState>(() => {
    if (typeof window !== "undefined" && projectId) {
      const saved = memoryService.loadMemory(projectId);
      if (saved) return saved;
    }
    return DEFAULT_STATE;
  });
  const [lastUpdated, setLastUpdated] = useState<string>(() => {
    if (typeof window !== "undefined" && projectId) {
      const saved = memoryService.loadMemory(projectId);
      if (saved) return new Date().toISOString();
    }
    return "";
  });

  // 1. Load memory from LocalStorage on mount/projectId change
  useEffect(() => {
    if (!projectId) return;

    const saved = memoryService.loadMemory(projectId);
    if (saved) {
      setMemoryState(saved);
      setLastUpdated(new Date().toISOString());
    } else {
      setMemoryState({ ...DEFAULT_STATE });
      setLastUpdated(new Date().toISOString());
    }
  }, [projectId]);

  // 2. Helper to persist state to LocalStorage
  const saveState = useCallback(
    (newState: MemoryState) => {
      if (!projectId) return;
      memoryService.saveMemory(projectId, newState);
      setLastUpdated(new Date().toISOString());
    },
    [projectId]
  );

  const updateMemory = useCallback(
    (updates: Partial<MemoryState>) => {
      setMemoryState((prev) => {
        const nextState = { ...prev, ...updates };
        saveState(nextState);
        return nextState;
      });
    },
    [saveState]
  );

  const resetMemory = useCallback(() => {
    setMemoryState((prev) => {
      const nextState = {
        ...DEFAULT_STATE,
        projectMetadata: prev.projectMetadata, // Preserve metadata
      };
      saveState(nextState);
      return nextState;
    });
  }, [saveState]);

  const clearMemory = useCallback(() => {
    if (!projectId) return;
    memoryService.clearMemory(projectId);
    setMemoryState({ ...DEFAULT_STATE });
    setLastUpdated(new Date().toISOString());
  }, [projectId]);

  // 3. Compute MemoryStatus dynamically
  const memoryStatus = useMemo<MemoryStatus>(() => {
    const hasPlan = memoryState.plannerOutput !== null;
    const hasPapers = memoryState.retrievedPapers.length > 0;
    const hasPdfs = memoryState.uploadedPdfs.length > 0;

    let status: MemoryStatus["status"] = "idle";
    if (hasPlan) {
      status = "active";
    }
    if (hasPapers || hasPdfs) {
      status = "synced";
    }

    // Count stored elements
    let objectsCount = 0;
    if (memoryState.projectMetadata) objectsCount++;
    if (memoryState.plannerOutput) objectsCount++;
    objectsCount += memoryState.retrievedPapers.length;
    objectsCount += memoryState.uploadedPdfs.length;
    objectsCount += memoryState.retrievedContext.length;

    // Optional arrays safety check
    if (memoryState.evidence) objectsCount += memoryState.evidence.length;
    if (memoryState.copilotConversations) objectsCount += memoryState.copilotConversations.length;

    return {
      status,
      lastUpdated: lastUpdated || new Date(memoryState.projectMetadata?.createdAt || Date.now()).toISOString(),
      objectsCount,
      papersCount: memoryState.retrievedPapers.length,
      plansCount: hasPlan ? 1 : 0,
    };
  }, [memoryState, lastUpdated]);

  const value = useMemo(
    () => ({
      memoryState,
      memoryStatus,
      updateMemory,
      resetMemory,
      clearMemory,
    }),
    [memoryState, memoryStatus, updateMemory, resetMemory, clearMemory]
  );

  return (
    <MemoryContext.Provider value={value}>{children}</MemoryContext.Provider>
  );
}

export function useMemory(): MemoryContextType {
  const context = useContext(MemoryContext);
  if (context === undefined) {
    throw new Error("useMemory must be used within a MemoryProvider");
  }
  return context;
}
