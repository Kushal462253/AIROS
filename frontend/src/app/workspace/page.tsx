"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import RouteGuard from "@/features/auth/guards/RouteGuard";
import {
  WorkspaceLayout,
  ContentHeader,
  EmptyState,
  CreateResearchModal,
} from "@/components/workspace";
import type { WorkspaceSection, CreateResearchInput } from "@/features/workspace";
import { useResearch } from "@/features/workspace";

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
    subtitle: "Manage and organize your research projects.",
    emptyTitle: "No research projects yet",
    emptyDescription:
      "Create your first AI-powered research project to get started.",
    emptyAction: "Create Research",
  },
  collections: {
    title: "Collections",
    subtitle: "Organize papers and findings into collections.",
    emptyTitle: "No collections yet",
    emptyDescription:
      "Create collections to organize your research papers and findings.",
    emptyAction: "Create Collection",
  },
  favorites: {
    title: "Favorites",
    subtitle: "Your starred papers and research items.",
    emptyTitle: "No favorites yet",
    emptyDescription:
      "Star papers and research items to save them here for quick access.",
  },
  archived: {
    title: "Archived",
    subtitle: "Previously archived research projects.",
    emptyTitle: "No archived projects",
    emptyDescription:
      "Archived research projects and collections will appear here.",
  },
  settings: {
    title: "Settings",
    subtitle: "Manage your account and workspace preferences.",
    emptyTitle: "Settings coming soon",
    emptyDescription:
      "Account settings, workspace preferences, and integrations will be available here.",
  },
};

/* ── Page ── */

function WorkspaceContent() {
  const router = useRouter();
  const { projects, createProject, isCreating } = useResearch();
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreate = useCallback(
    async (input: CreateResearchInput) => {
      const project = await createProject(input);
      setModalOpen(false);
      router.push(`/workspace/project/${project.id}`);
    },
    [createProject, router]
  );

  return (
    <>
      <WorkspaceLayout>
        {({ activeSection }) => {
          const config = sections[activeSection];
          const showEmpty = activeSection === "research" ? projects.length === 0 : true;

          return (
            <>
              <ContentHeader
                title={config.title}
                subtitle={config.subtitle}
              />
              <div className="px-6 lg:px-8">
                {showEmpty && (
                  <EmptyState
                    title={config.emptyTitle}
                    description={config.emptyDescription}
                    actionLabel={config.emptyAction}
                    onAction={
                      activeSection === "research"
                        ? () => setModalOpen(true)
                        : config.emptyAction
                          ? () => { /* Future implementation */ }
                          : undefined
                    }
                  />
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
