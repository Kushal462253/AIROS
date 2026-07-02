"use client";

import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import SidebarItem from "./SidebarItem";
import UserMenu from "./UserMenu";
import type { WorkspaceSection } from "@/features/workspace";

interface SidebarProps {
  activeSection: WorkspaceSection;
  onSectionChange: (section: WorkspaceSection) => void;
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

/* ── Icon components ── */

const ResearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const CollectionsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const FavoritesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ArchivedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="5" x="2" y="3" rx="1" />
    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
    <path d="M10 12h4" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CollapseIcon = ({ collapsed }: { collapsed: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
  >
    <path d="M11 17l-5-5 5-5" />
    <path d="M18 17l-5-5 5-5" />
  </svg>
);

/* ── Navigation config ── */

interface NavConfig {
  section: WorkspaceSection;
  label: string;
  icon: React.ReactNode;
}

const mainNav: NavConfig[] = [
  { section: "research", label: "My Research", icon: <ResearchIcon /> },
  { section: "collections", label: "Collections", icon: <CollectionsIcon /> },
  { section: "favorites", label: "Favorites", icon: <FavoritesIcon /> },
  { section: "archived", label: "Archived", icon: <ArchivedIcon /> },
];

const bottomNav: NavConfig[] = [
  { section: "settings", label: "Settings", icon: <SettingsIcon /> },
];

/* ── Sidebar animations ── */

const sidebarVariants = {
  expanded: { width: 260 },
  collapsed: { width: 72 },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const mobileSlide = {
  hidden: { x: -280 },
  visible: { x: 0 },
};

/* ── Component ── */

export default function Sidebar({
  activeSection,
  onSectionChange,
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const handleSelect = useCallback(
    (section: WorkspaceSection) => {
      onSectionChange(section);
      onMobileClose();
    },
    [onSectionChange, onMobileClose]
  );

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className={`flex items-center border-b border-white/[0.04] p-4 ${collapsed ? "justify-center" : "gap-3"}`}>
        <Link href="/" aria-label="AIROS Home" className="flex-shrink-0">
          <Logo size={28} />
        </Link>
        {!collapsed && (
          <motion.span
            initial={false}
            animate={{ opacity: 1 }}
            className="text-lg font-bold tracking-tight text-white"
          >
            AIROS
          </motion.span>
        )}
        {!collapsed && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggle}
            aria-label="Collapse sidebar"
            className="ml-auto rounded-lg p-1.5 text-[--text-muted] transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            <CollapseIcon collapsed={false} />
          </motion.button>
        )}
        {collapsed && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggle}
            aria-label="Expand sidebar"
            className="absolute right-0 top-4 translate-x-1/2 rounded-full border border-white/[0.06] bg-surface-secondary p-1 text-[--text-muted] shadow-lg transition-colors hover:text-white"
          >
            <CollapseIcon collapsed />
          </motion.button>
        )}
      </div>

      {/* Main navigation */}
      <nav className="flex-1 space-y-1 p-3" aria-label="Workspace navigation">
        {!collapsed && (
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-[--text-muted]">
            Workspace
          </p>
        )}
        {mainNav.map((item) => (
          <SidebarItem
            key={item.section}
            label={item.label}
            icon={item.icon}
            isActive={activeSection === item.section}
            onClick={() => handleSelect(item.section)}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Bottom navigation */}
      <div className="space-y-1 p-3">
        {bottomNav.map((item) => (
          <SidebarItem
            key={item.section}
            label={item.label}
            icon={item.icon}
            isActive={activeSection === item.section}
            onClick={() => handleSelect(item.section)}
            collapsed={collapsed}
          />
        ))}
      </div>

      {/* User menu */}
      <UserMenu collapsed={collapsed} />
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial={false}
        animate={collapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative hidden h-screen flex-shrink-0 border-r border-white/[0.04] bg-surface-secondary/40 backdrop-blur-xl md:flex md:flex-col"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile overlay + drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={onMobileClose}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              variants={mobileSlide}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed inset-y-0 left-0 z-50 w-[260px] border-r border-white/[0.04] bg-surface-secondary/95 backdrop-blur-xl md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
