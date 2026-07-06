"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import RouteGuard from "@/features/auth/guards/RouteGuard";
import {
  WorkspaceLayout,
  ContentHeader,
  EmptyState,
  CreateResearchModal,
} from "@/components/workspace";
import type { WorkspaceSection, CreateResearchInput, ResearchDepth } from "@/features/workspace";
import { useResearch } from "@/features/workspace";
import { collectionsService, type Collection } from "@/services/collections-service";
import Magnetic from "@/components/ui/Magnetic";

/* ── Section config ── */

interface SectionConfig {
  title: string;
  subtitle: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction?: string;
}

const sections: Record<WorkspaceSection, SectionConfig> = {
  research: {
    title: "My Research",
    subtitle: "Coordinate and query your AI research projects pipelines.",
    emptyTitle: "No projects active",
    emptyDescription: "Initialize a new project to start scanning publications.",
    emptyAction: "Create Research",
  },
  collections: {
    title: "Collections",
    subtitle: "Organize publications and projects into workspace directories.",
    emptyTitle: "No collections configured",
    emptyDescription: "Group research nodes to map specific technology domains.",
    emptyAction: "Create Collection",
  },
  favorites: {
    title: "Favorites",
    subtitle: "Quick access to your most important pinned research projects.",
    emptyTitle: "No favorites starred",
    emptyDescription: "Click the context menu (⋮) on any card to star it.",
  },
  archived: {
    title: "Archived Projects",
    subtitle: "Audit historical research workspace runs.",
    emptyTitle: "No archived projects found",
    emptyDescription: "Archived projects will appear here for reference.",
  },
  settings: {
    title: "Settings",
    subtitle: "Configure your research credentials and API quotas.",
    emptyTitle: "Settings Profile",
    emptyDescription: "Workspace user configuration is loaded.",
  },
};

function WorkspaceContent() {
  const router = useRouter();
  const {
    projects,
    createProject,
    updateProject,
    deleteProject,
    duplicateProject,
    isCreating,
  } = useResearch();
  
  const [modalOpen, setModalOpen] = useState(false);

  // Collections state
  const [collections, setCollections] = useState<Collection[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [editName, setEditName] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  // Context Menu & Project Actions states
  const [openMenuProjectId, setOpenMenuProjectId] = useState<string | null>(null);
  const [activeSubmenuId, setActiveSubmenuId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const [detailsEditingProject, setDetailsEditingProject] = useState<any | null>(null);
  const [detailsTitle, setDetailsTitle] = useState("");
  const [detailsTopic, setDetailsTopic] = useState("");
  const [detailsDesc, setDetailsDesc] = useState("");
  const [detailsDepth, setDetailsDepth] = useState<ResearchDepth>("standard");

  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

  // Sync collections and listen for update triggers
  useEffect(() => {
    setCollections(collectionsService.getCollections());
    const handleUpdate = () => {
      setCollections(collectionsService.getCollections());
    };
    window.addEventListener("airos:collectionsUpdated", handleUpdate);
    return () => window.removeEventListener("airos:collectionsUpdated", handleUpdate);
  }, []);

  // Listen to left navigation collection select filters
  useEffect(() => {
    const handleSelectCol = (e: any) => {
      setSelectedCollectionId(e.detail);
    };
    window.addEventListener("airos:selectCollection", handleSelectCol);
    return () => window.removeEventListener("airos:selectCollection", handleSelectCol);
  }, []);

  // Close context menu on click outside
  useEffect(() => {
    const closeMenu = () => {
      setOpenMenuProjectId(null);
      setActiveSubmenuId(null);
    };
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const handleCreate = useCallback(
    async (input: CreateResearchInput) => {
      const project = await createProject(input);
      setModalOpen(false);
      router.push(`/workspace/project/${project.id}`);
    },
    [createProject, router]
  );

  const handleCardClick = (e: React.MouseEvent, projectId: string) => {
    const target = e.target as HTMLElement;
    if (target.closest(".menu-trigger") || target.closest(".menu-container")) {
      return;
    }
    router.push(`/workspace/project/${projectId}`);
  };

  return (
    <>
      <WorkspaceLayout>
        {({ activeSection }) => {
          const config = sections[activeSection];

          // Filter and sort projects based on active filter tab
          let filteredProjects = [...projects];

          if (activeSection === "research") {
            filteredProjects = projects.filter((p) => {
              if (p.archived) return false;
              if (selectedCollectionId) {
                return p.collectionIds?.includes(selectedCollectionId);
              }
              return true;
            });
          } else if (activeSection === "favorites") {
            filteredProjects = projects.filter((p) => p.favorite && !p.archived);
          } else if (activeSection === "archived") {
            filteredProjects = projects.filter((p) => p.archived);
          }

          // Sorting priority: Pinned -> Favorites -> Normal
          filteredProjects.sort((a, b) => {
            const pinA = a.pinned ? 1 : 0;
            const pinB = b.pinned ? 1 : 0;
            if (pinA !== pinB) return pinB - pinA;

            const favA = a.favorite ? 1 : 0;
            const favB = b.favorite ? 1 : 0;
            if (favA !== favB) return favB - favA;

            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });

          const showEmpty =
            activeSection === "research"
              ? filteredProjects.length === 0
              : activeSection === "collections"
                ? collections.length === 0
                : activeSection === "favorites"
                  ? filteredProjects.length === 0
                  : activeSection === "archived"
                    ? filteredProjects.length === 0
                    : true;

          const currentCollectionName = selectedCollectionId
            ? collections.find((c) => c.id === selectedCollectionId)?.name
            : null;

          return (
            <>
              <ContentHeader
                title={config.title}
                subtitle={
                  selectedCollectionId
                    ? `Showing projects in collection "${currentCollectionName}"`
                    : config.subtitle
                }
              />
              <div className="px-6 lg:px-8">
                {selectedCollectionId && activeSection === "research" && (
                  <div className="mb-4 flex items-center">
                    <button
                      onClick={() => setSelectedCollectionId(null)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 border border-indigo-500/20 text-[10px] font-mono text-indigo-300 hover:bg-indigo-500/20 transition-all"
                    >
                      <span>Collection: {currentCollectionName}</span>
                      <span className="font-bold">×</span>
                    </button>
                  </div>
                )}

                {showEmpty ? (
                  <EmptyState
                    title={config.emptyTitle}
                    description={config.emptyDescription}
                    actionLabel={config.emptyAction}
                    onAction={
                      activeSection === "research"
                        ? () => setModalOpen(true)
                        : activeSection === "collections"
                          ? () => setCreateModalOpen(true)
                          : undefined
                    }
                  />
                ) : (
                  <>
                    {/* Render standard projects grid for My Research, Favorites, Archived */}
                    {(activeSection === "research" || activeSection === "favorites" || activeSection === "archived") && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold tracking-wider text-[--text-muted] uppercase font-mono">
                            {activeSection === "research"
                              ? "Active Projects"
                              : activeSection === "favorites"
                                ? "Favorite Projects"
                                : "Archived Projects"}{" "}
                            ({filteredProjects.length})
                          </h4>
                          {activeSection === "research" && (
                            <Magnetic>
                              <button
                                onClick={() => setModalOpen(true)}
                                className="rounded-xl bg-airos-600 hover:bg-airos-500 text-white font-semibold text-xs px-4 py-2 transition-all duration-200 shadow-md hover:shadow-airos-600/20 animate-fadeIn"
                              >
                                Create Research
                              </button>
                            </Magnetic>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-8">
                          <AnimatePresence mode="popLayout">
                            {filteredProjects.map((project) => (
                              <motion.div
                                key={project.id}
                                layout
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                              >
                                <div
                                  onClick={(e) => handleCardClick(e, project.id)}
                                  className="glass-panel card-lift-hover p-5 rounded-2xl border border-white/[0.04] bg-surface-secondary/20 hover:bg-surface-secondary/35 relative group cursor-pointer h-40 flex flex-col justify-between"
                                >
                                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-airos-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  
                                  <div>
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        {project.pinned && <span title="Pinned" className="text-xs">📌</span>}
                                        {project.favorite && <span title="Favorite" className="text-xs">⭐</span>}
                                        <h5 className="text-sm font-bold text-white tracking-wide leading-snug group-hover:text-airos-400 transition-colors truncate">
                                          {project.title}
                                        </h5>
                                      </div>
                                      
                                      {/* Project Card Context Menu Trigger */}
                                      <div className="relative menu-trigger shrink-0">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenMenuProjectId(openMenuProjectId === project.id ? null : project.id);
                                          }}
                                          className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 p-1 rounded hover:bg-white/[0.06] text-[--text-muted] hover:text-white transition-opacity duration-200"
                                        >
                                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <circle cx="12" cy="12" r="1.5" />
                                            <circle cx="12" cy="5" r="1.5" />
                                            <circle cx="12" cy="19" r="1.5" />
                                          </svg>
                                        </button>

                                        {/* Dropdown Menu */}
                                        {openMenuProjectId === project.id && (
                                          <div
                                            onClick={(e) => e.stopPropagation()}
                                            className="absolute right-0 top-6 z-30 w-44 rounded-xl border border-white/[0.08] bg-[#0c0c14]/95 backdrop-blur-md p-1.5 shadow-2xl font-mono text-[9px] menu-container animate-premium-slide"
                                          >
                                            <button
                                              onClick={() => {
                                                router.push(`/workspace/project/${project.id}`);
                                                setOpenMenuProjectId(null);
                                              }}
                                              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04] text-white transition-colors"
                                            >
                                              Open Project
                                            </button>
                                            
                                            <button
                                              onClick={() => {
                                                updateProject(project.id, { favorite: !project.favorite });
                                                setOpenMenuProjectId(null);
                                              }}
                                              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04] text-white transition-colors"
                                            >
                                              {project.favorite ? "⭐ Unfavorite" : "⭐ Favorite"}
                                            </button>

                                            <button
                                              onClick={() => {
                                                updateProject(project.id, { pinned: !project.pinned });
                                                setOpenMenuProjectId(null);
                                              }}
                                              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04] text-white transition-colors"
                                            >
                                              {project.pinned ? "📌 Unpin Project" : "📌 Pin Project"}
                                            </button>

                                            <div className="relative group/sub">
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setActiveSubmenuId(activeSubmenuId === project.id ? null : project.id);
                                                }}
                                                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04] text-white transition-colors flex items-center justify-between"
                                              >
                                                <span>📂 Add to Collection</span>
                                                <span>&gt;</span>
                                              </button>
                                              <div className={`absolute left-full top-0 z-40 pl-2 ${activeSubmenuId === project.id ? "block" : "hidden lg:group-hover/sub:block"}`}>
                                                <div className="w-40 rounded-lg border border-white/[0.08] bg-[#0c0c14] p-1.5 shadow-xl">
                                                  {collections.length === 0 ? (
                                                    <div className="px-2 py-1 text-[--text-muted] text-center text-[8px]">
                                                      No collections
                                                    </div>
                                                  ) : (
                                                    <div className="space-y-0.5">
                                                      {collections.map((col) => {
                                                        const inCol = col.projectIds?.includes(project.id);
                                                        return (
                                                          <button
                                                            key={col.id}
                                                            onClick={(e) => {
                                                              e.stopPropagation();
                                                              if (inCol) {
                                                                collectionsService.removeProjectFromCollection(col.id, project.id);
                                                              } else {
                                                                collectionsService.addProjectToCollection(col.id, project.id);
                                                              }
                                                              setCollections(collectionsService.getCollections());
                                                            }}
                                                            className="w-full text-left px-2 py-1 rounded hover:bg-white/[0.04] text-white transition-colors flex items-center justify-between text-[8px]"
                                                          >
                                                            <span className="truncate">{col.name}</span>
                                                            {inCol && <span className="text-emerald-400 font-bold">✓</span>}
                                                          </button>
                                                        );
                                                      })}
                                                    </div>
                                                  )}
                                                  <div className="h-px bg-white/[0.04] my-1" />
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      const name = prompt("Enter new collection name:");
                                                      if (name && name.trim()) {
                                                        const newCol = collectionsService.createCollection(name.trim());
                                                        collectionsService.addProjectToCollection(newCol.id, project.id);
                                                        setCollections(collectionsService.getCollections());
                                                      }
                                                    }}
                                                    className="w-full text-left px-2 py-1 rounded hover:bg-indigo-500/10 text-indigo-400 font-bold transition-colors text-[8px]"
                                                  >
                                                    + Create Collection
                                                  </button>
                                                </div>
                                              </div>
                                            </div>

                                            <div className="h-px bg-white/[0.04] my-1" />

                                            <button
                                              onClick={() => {
                                                setEditingProject(project);
                                                setEditTitle(project.title);
                                                setOpenMenuProjectId(null);
                                              }}
                                              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04] text-white transition-colors"
                                            >
                                              ✏ Rename
                                            </button>

                                            <button
                                              onClick={() => {
                                                setDetailsEditingProject(project);
                                                setDetailsTitle(project.title);
                                                setDetailsTopic(project.topic);
                                                setDetailsDesc(project.description || "");
                                                setDetailsDepth(project.researchDepth);
                                                setOpenMenuProjectId(null);
                                              }}
                                              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04] text-white transition-colors"
                                            >
                                              📝 Edit Details
                                            </button>

                                            <button
                                              onClick={() => {
                                                duplicateProject(project.id);
                                                setOpenMenuProjectId(null);
                                              }}
                                              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04] text-white transition-colors"
                                            >
                                              📋 Duplicate
                                            </button>

                                            <div className="h-px bg-white/[0.04] my-1" />

                                            <button
                                              onClick={() => {
                                                updateProject(project.id, { archived: !project.archived });
                                                setOpenMenuProjectId(null);
                                              }}
                                              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04] text-white transition-colors"
                                            >
                                              📦 {project.archived ? "Restore" : "Archive"}
                                            </button>

                                            <button
                                              onClick={() => {
                                                setDeletingProjectId(project.id);
                                                setOpenMenuProjectId(null);
                                              }}
                                              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 transition-colors"
                                            >
                                              🗑 Delete
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <p className="text-xs text-[--text-secondary] leading-relaxed line-clamp-2 mb-2">
                                      {project.description || project.topic}
                                    </p>
                                  </div>

                                  <div className="flex items-center justify-between border-t border-white/[0.03] pt-3 text-[9px] font-mono text-[--text-muted]">
                                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                    <span className="inline-flex items-center rounded bg-indigo-500/5 px-2 py-0.5 border border-indigo-500/10 font-mono text-[8px] font-bold text-indigo-400 uppercase tracking-wider">
                                      {project.researchDepth}
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}

                    {/* Collections View Panel */}
                    {activeSection === "collections" && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold tracking-wider text-[--text-muted] uppercase font-mono">
                            My Collections ({collections.length})
                          </h4>
                          <Magnetic>
                            <button
                              onClick={() => setCreateModalOpen(true)}
                              className="rounded-xl bg-airos-600 hover:bg-airos-500 text-white font-semibold text-xs px-4 py-2 transition-all duration-200 shadow-md"
                            >
                              Create Collection
                            </button>
                          </Magnetic>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-8">
                          {collections.map((col) => (
                            <div
                              key={col.id}
                              className="border border-white/[0.04] bg-[#0c0c14]/20 hover:bg-[#0c0c14]/30 p-5 rounded-2xl relative overflow-hidden transition-all duration-300 group cursor-pointer"
                              onClick={() => setSelectedCollection(col)}
                            >
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <h5 className="text-sm font-bold text-white tracking-wide leading-snug group-hover:text-airos-400 transition-colors">
                                  {col.name}
                                </h5>
                                <div className="flex gap-2">
                                  <span className="inline-flex items-center rounded bg-indigo-500/5 px-2 py-0.5 border border-indigo-500/10 font-mono text-[8px] font-bold text-indigo-400">
                                    {col.projectIds?.length || 0} PROJECTS
                                  </span>
                                  <span className="inline-flex items-center rounded bg-indigo-500/5 px-2 py-0.5 border border-indigo-500/10 font-mono text-[8px] font-bold text-indigo-400">
                                    {col.papers.length} PAPERS
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-[--text-secondary] leading-relaxed mb-4">
                                Created on {new Date(col.createdAt).toLocaleDateString()}
                              </p>
                              <div className="flex items-center justify-end gap-2 border-t border-white/[0.03] pt-3 text-[10px] font-mono">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingCollection(col);
                                    setEditName(col.name);
                                  }}
                                  className="text-[--text-secondary] hover:text-white transition-colors"
                                >
                                  Rename
                                </button>
                                <span className="text-white/10">|</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const updated = collectionsService.deleteCollection(col.id);
                                    setCollections(updated);
                                    if (selectedCollection?.id === col.id) {
                                      setSelectedCollection(null);
                                    }
                                  }}
                                  className="text-rose-400 hover:text-rose-300 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Selected Collection Detail Drawer Panel */}
                        {selectedCollection && (
                          <div className="border-t border-white/[0.04] pt-6 space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <h3 className="text-base font-bold text-white tracking-tight">
                                  Collection: {selectedCollection.name}
                                </h3>
                                <p className="text-xs text-[--text-secondary]">
                                  Auditing projects and papers saved inside this collection.
                                </p>
                              </div>
                              <button
                                onClick={() => setSelectedCollection(null)}
                                className="text-xs font-mono text-[--text-muted] hover:text-white transition-colors"
                              >
                                [CLOSE DETAILS]
                              </button>
                            </div>

                            {/* Projects inside collection */}
                            <div className="space-y-2">
                              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                                Projects in Collection
                              </h4>
                              {projects.filter(p => selectedCollection.projectIds?.includes(p.id)).length === 0 ? (
                                <div className="text-[10px] text-[--text-muted] font-mono italic">
                                  No projects added to this collection.
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {projects.filter(p => selectedCollection.projectIds?.includes(p.id)).map((p) => (
                                    <div
                                      key={p.id}
                                      onClick={() => router.push(`/workspace/project/${p.id}`)}
                                      className="border border-white/[0.04] bg-[#0c0c14]/10 rounded-xl p-4 flex items-center justify-between hover:border-indigo-500/20 cursor-pointer transition-all"
                                    >
                                      <div>
                                        <h5 className="text-xs font-bold text-white">{p.title}</h5>
                                        <p className="text-[9px] text-[--text-muted]">{p.topic}</p>
                                      </div>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          collectionsService.removeProjectFromCollection(selectedCollection.id, p.id);
                                          const refreshed = collectionsService.getCollections().find(c => c.id === selectedCollection.id) || null;
                                          setSelectedCollection(refreshed);
                                          setCollections(collectionsService.getCollections());
                                        }}
                                        className="text-[9px] font-mono text-rose-400 hover:text-rose-300"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Papers inside collection */}
                            <div className="space-y-2 pt-4">
                              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                                Papers in Collection
                              </h4>
                              {selectedCollection.papers.length === 0 ? (
                                <div className="text-[10px] text-[--text-muted] font-mono italic">
                                  No papers added to this collection.
                                </div>
                              ) : (
                                <div className="flex flex-col border border-white/[0.04] bg-[#0c0c14]/10 rounded-xl px-5 divide-y divide-white/[0.03]">
                                  {selectedCollection.papers.map((paper, idx) => (
                                    <div key={paper.title + idx} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                      <div className="space-y-1 min-w-0 flex-1">
                                        <h5 className="text-xs font-bold text-white leading-relaxed truncate">
                                          {paper.title}
                                        </h5>
                                        <p className="text-[10px] text-[--text-muted] truncate">
                                          {paper.authors} · {paper.publicationYear}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-3 shrink-0">
                                        {paper.url && (
                                          <a
                                            href={paper.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300"
                                          >
                                            View Paper
                                          </a>
                                        )}
                                        <button
                                          onClick={() => {
                                            const updated = collectionsService.removePaperFromCollection(
                                              selectedCollection.id,
                                              paper.title
                                            );
                                            setCollections(updated);
                                            const refreshed = updated.find((c) => c.id === selectedCollection.id) || null;
                                            setSelectedCollection(refreshed);
                                          }}
                                          className="text-[10px] font-mono text-rose-400 hover:text-rose-300"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          );
        }}
      </WorkspaceLayout>

      <CreateResearchModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        isLoading={isCreating}
      />

      {/* Create Collection Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md border border-white/[0.06] bg-[#0c0c14] p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Create New Collection
            </h3>
            <input
              type="text"
              placeholder="Collection name..."
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="w-full rounded bg-white/[0.02] border border-white/[0.08] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-airos-500/40"
            />
            <div className="flex justify-end gap-2 text-xs font-semibold">
              <button
                onClick={() => {
                  setCreateModalOpen(false);
                  setNewCollectionName("");
                }}
                className="px-4 py-2 text-[--text-muted] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!newCollectionName.trim()}
                onClick={() => {
                  if (newCollectionName.trim()) {
                    collectionsService.createCollection(newCollectionName.trim());
                    setCollections(collectionsService.getCollections());
                    setCreateModalOpen(false);
                    setNewCollectionName("");
                  }
                }}
                className="px-4 py-2 bg-airos-600 hover:bg-airos-500 text-white rounded transition-colors disabled:opacity-40"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Collection Modal */}
      {editingCollection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md border border-white/[0.06] bg-[#0c0c14] p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Rename Collection
            </h3>
            <input
              type="text"
              placeholder="New name..."
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full rounded bg-white/[0.02] border border-white/[0.08] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-airos-500/40"
            />
            <div className="flex justify-end gap-2 text-xs font-semibold">
              <button
                onClick={() => setEditingCollection(null)}
                className="px-4 py-2 text-[--text-muted] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!editName.trim()}
                onClick={() => {
                  if (editName.trim() && editingCollection) {
                    const updated = collectionsService.renameCollection(editingCollection.id, editName.trim());
                    setCollections(updated);
                    if (selectedCollection?.id === editingCollection.id) {
                      setSelectedCollection(updated.find((c) => c.id === editingCollection.id) || null);
                    }
                    setEditingCollection(null);
                  }
                }}
                className="px-4 py-2 bg-airos-600 hover:bg-airos-500 text-white rounded transition-colors disabled:opacity-40"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md border border-white/[0.06] bg-[#0c0c14] p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Rename Project
            </h3>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full rounded bg-white/[0.02] border border-white/[0.08] px-3.5 py-2 text-xs text-white focus:outline-none focus:border-airos-500/40"
            />
            <div className="flex justify-end gap-2 text-xs font-semibold">
              <button
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 text-[--text-muted] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!editTitle.trim()}
                onClick={() => {
                  if (editTitle.trim() && editingProject) {
                    updateProject(editingProject.id, { title: editTitle.trim() });
                    setEditingProject(null);
                  }
                }}
                className="px-4 py-2 bg-airos-600 hover:bg-airos-500 text-white rounded transition-colors disabled:opacity-40"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Details Project Modal */}
      {detailsEditingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md border border-white/[0.06] bg-[#0c0c14] p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Edit Project Details
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] text-[--text-muted] uppercase font-mono mb-1">Title</label>
                <input
                  type="text"
                  value={detailsTitle}
                  onChange={(e) => setDetailsTitle(e.target.value)}
                  className="w-full rounded bg-white/[0.02] border border-white/[0.08] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-airos-500/40"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[--text-muted] uppercase font-mono mb-1">Topic</label>
                <input
                  type="text"
                  value={detailsTopic}
                  onChange={(e) => setDetailsTopic(e.target.value)}
                  className="w-full rounded bg-white/[0.02] border border-white/[0.08] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-airos-500/40"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[--text-muted] uppercase font-mono mb-1">Description</label>
                <textarea
                  value={detailsDesc}
                  onChange={(e) => setDetailsDesc(e.target.value)}
                  rows={3}
                  className="w-full rounded bg-white/[0.02] border border-white/[0.08] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-airos-500/40"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[--text-muted] uppercase font-mono mb-1">Research Depth</label>
                <select
                  value={detailsDepth}
                  onChange={(e) => setDetailsDepth(e.target.value as ResearchDepth)}
                  className="w-full rounded bg-[#10101a] border border-white/[0.08] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-airos-500/40"
                >
                  <option value="quick">Quick</option>
                  <option value="standard">Standard</option>
                  <option value="comprehensive">Comprehensive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 text-xs font-semibold">
              <button
                onClick={() => setDetailsEditingProject(null)}
                className="px-4 py-2 text-[--text-muted] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!detailsTitle.trim() || !detailsTopic.trim()}
                onClick={() => {
                  if (detailsEditingProject) {
                    updateProject(detailsEditingProject.id, {
                      title: detailsTitle.trim(),
                      topic: detailsTopic.trim(),
                      description: detailsDesc.trim(),
                      researchDepth: detailsDepth,
                    });
                    setDetailsEditingProject(null);
                  }
                }}
                className="px-4 py-2 bg-airos-600 hover:bg-airos-500 text-white rounded transition-colors disabled:opacity-40"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Project Modal */}
      {deletingProjectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm border border-white/[0.06] bg-[#0c0c14] p-6 rounded-2xl space-y-4 text-center">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Delete Project?
            </h3>
            <p className="text-xs text-[--text-secondary] leading-relaxed">
              This action permanently removes:<br />
              • Project Memory<br />
              • Evidence<br />
              • Knowledge Graph<br />
              • Retrieval Results<br /><br />
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4 text-xs font-semibold pt-2">
              <button
                onClick={() => setDeletingProjectId(null)}
                className="px-4 py-2 text-[--text-muted] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteProject(deletingProjectId);
                  setDeletingProjectId(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function WorkspacePage() {
  return (
    <RouteGuard requireAuth>
      <WorkspaceContent />
    </RouteGuard>
  );
}
