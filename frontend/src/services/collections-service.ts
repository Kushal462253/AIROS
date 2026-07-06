import type { PaperResult } from "@/features/retrieval";

export interface Collection {
  id: string;
  name: string;
  papers: PaperResult[];
  projectIds?: string[];
  createdAt: string;
}

const COLLECTIONS_KEY = "airos_collections";

export const collectionsService = {
  getCollections(): Collection[] {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(COLLECTIONS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load collections:", e);
      return [];
    }
  },

  saveCollections(collections: Collection[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
      window.dispatchEvent(new CustomEvent("airos:collectionsUpdated"));
    } catch (e) {
      console.error("Failed to save collections:", e);
    }
  },

  createCollection(name: string): Collection {
    const collections = this.getCollections();
    const newCollection: Collection = {
      id: crypto.randomUUID(),
      name,
      papers: [],
      projectIds: [],
      createdAt: new Date().toISOString(),
    };
    collections.push(newCollection);
    this.saveCollections(collections);
    return newCollection;
  },

  renameCollection(id: string, newName: string): Collection[] {
    const collections = this.getCollections();
    const updated = collections.map((c) =>
      c.id === id ? { ...c, name: newName } : c
    );
    this.saveCollections(updated);
    return updated;
  },

  deleteCollection(id: string): Collection[] {
    const collections = this.getCollections();
    const updated = collections.filter((c) => c.id !== id);
    this.saveCollections(updated);
    return updated;
  },

  addPaperToCollection(collectionId: string, paper: PaperResult): Collection[] {
    const collections = this.getCollections();
    const updated = collections.map((c) => {
      if (c.id === collectionId) {
        const exists = c.papers.some((p) => p.title === paper.title);
        if (!exists) {
          return { ...c, papers: [...c.papers, paper] };
        }
      }
      return c;
    });
    this.saveCollections(updated);
    return updated;
  },

  removePaperFromCollection(collectionId: string, paperTitle: string): Collection[] {
    const collections = this.getCollections();
    const updated = collections.map((c) => {
      if (c.id === collectionId) {
        return {
          ...c,
          papers: c.papers.filter((p) => p.title !== paperTitle),
        };
      }
      return c;
    });
    this.saveCollections(updated);
    return updated;
  },

  addProjectToCollection(collectionId: string, projectId: string): Collection[] {
    const collections = this.getCollections();
    const updated = collections.map((c) => {
      if (c.id === collectionId) {
        const projectIds = c.projectIds || [];
        if (!projectIds.includes(projectId)) {
          return { ...c, projectIds: [...projectIds, projectId] };
        }
      }
      return c;
    });
    this.saveCollections(updated);
    return updated;
  },

  removeProjectFromCollection(collectionId: string, projectId: string): Collection[] {
    const collections = this.getCollections();
    const updated = collections.map((c) => {
      if (c.id === collectionId) {
        const projectIds = c.projectIds || [];
        return {
          ...c,
          projectIds: projectIds.filter((id) => id !== projectId),
        };
      }
      return c;
    });
    this.saveCollections(updated);
    return updated;
  },
};
