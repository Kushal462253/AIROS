"use client";

import {
  createContext,
  useCallback,
  useContext,
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
  isCreating: boolean;
}

const ResearchContext = createContext<ResearchContextType | undefined>(
  undefined
);

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function ResearchProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [isCreating, setIsCreating] = useState(false);

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
      };

      setProjects((prev) => [project, ...prev]);
      setIsCreating(false);
      return project;
    },
    []
  );

  const value = useMemo<ResearchContextType>(
    () => ({ projects, getProject, createProject, isCreating }),
    [projects, getProject, createProject, isCreating]
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
