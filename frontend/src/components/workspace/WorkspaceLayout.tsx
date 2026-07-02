"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import type { WorkspaceSection } from "@/features/workspace";

interface WorkspaceLayoutProps {
  children: (props: {
    activeSection: WorkspaceSection;
    onSectionChange: (section: WorkspaceSection) => void;
  }) => React.ReactNode;
}

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const [activeSection, setActiveSection] =
    useState<WorkspaceSection>("research");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggle = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  const handleMobileClose = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const handleMobileOpen = useCallback(() => {
    setMobileOpen(true);
  }, []);

  /* Close mobile sidebar on Escape */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  return (
    <div className="flex h-screen bg-surface-primary">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={collapsed}
        onToggle={handleToggle}
        mobileOpen={mobileOpen}
        onMobileClose={handleMobileClose}
      />

      {/* Main content */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="flex items-center border-b border-white/[0.04] px-4 py-3 md:hidden">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleMobileOpen}
            aria-label="Open navigation"
            className="rounded-lg p-2 text-[--text-muted] transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </motion.button>
          <span className="ml-3 text-sm font-semibold text-white">AIROS</span>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          {children({
            activeSection,
            onSectionChange: setActiveSection,
          })}
        </div>
      </main>
    </div>
  );
}
