"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  CreateResearchInput,
  ResearchProject,
} from "../types";

const MOCK_DELAY = 600;

interface ResearchContextType {
  projects: ResearchProject[];
  getProject: (id: string) => ResearchProject | undefined;
  createProject: (input: CreateResearchInput) => Promise<ResearchProject>;
  updateProject: (id: string, updates: Partial<ResearchProject>) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  isCreating: boolean;
}

const ResearchContext = createContext<ResearchContextType | undefined>(
  undefined
);

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function ResearchProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<ResearchProject[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("airos_projects");
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        console.error("Failed to load projects:", e);
      }
    }
    return [];
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("airos_projects", JSON.stringify(projects));
      } catch (e) {
        console.error("Failed to save projects:", e);
      }
    }
  }, [projects]);

  const getProject = useCallback(
    (id: string) => projects.find((p) => p.id === id),
    [projects]
  );

  const createProject = useCallback(
    async (input: CreateResearchInput): Promise<ResearchProject> => {
      setIsCreating(true);
      await delay(MOCK_DELAY);

      const project: ResearchProject = {
        id: crypto.randomUUID(),
        title: input.title,
        topic: input.topic,
        description: input.description,
        researchDepth: input.researchDepth,
        researchType: input.researchType,
        uploadedPdfName: input.uploadedPdfName,
        status: "planning",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paperCount: 0,
        tags: [],
        favorite: false,
        pinned: false,
        archived: false,
        collectionIds: [],
      };

      setProjects((prev) => [project, ...prev]);
      setIsCreating(false);
      return project;
    },
    []
  );

  const updateProject = useCallback((id: string, updates: Partial<ResearchProject>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...updates, updatedAt: new Date().toISOString() }
          : p
      )
    );
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    try {
      localStorage.removeItem(`airos_memory_${id}`);
    } catch (e) {
      console.error("Failed to clear project storage:", e);
    }
  }, []);

  const duplicateProject = useCallback((id: string) => {
    setProjects((prev) => {
      const original = prev.find((p) => p.id === id);
      if (!original) return prev;

      const copy: ResearchProject = {
        ...original,
        id: crypto.randomUUID(),
        title: `${original.title} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        favorite: false,
        pinned: false,
        archived: false,
        collectionIds: [...(original.collectionIds || [])],
      };

      try {
        const originalMemory = localStorage.getItem(`airos_memory_${original.id}`);
        if (originalMemory) {
          const parsed = JSON.parse(originalMemory);
          parsed.projectMetadata = copy;
          localStorage.setItem(`airos_memory_${copy.id}`, JSON.stringify(parsed));
        }
      } catch (e) {
        console.error("Failed to copy project storage:", e);
      }

      return [copy, ...prev];
    });
  }, []);

  const value = useMemo<ResearchContextType>(
    () => ({
      projects,
      getProject,
      createProject,
      updateProject,
      deleteProject,
      duplicateProject,
      isCreating,
    }),
    [projects, getProject, createProject, updateProject, deleteProject, duplicateProject, isCreating]
  );

  return (
    <ResearchContext.Provider value={value}>
      {children}
    </ResearchContext.Provider>
  );
}

export function useResearch(): ResearchContextType {
  const context = useContext(ResearchContext);
  if (context === undefined) {
    throw new Error("useResearch must be used within a ResearchProvider");
  }
  return context;
}
