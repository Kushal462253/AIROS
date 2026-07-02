"use client";

import { motion } from "framer-motion";

interface SidebarItemProps {
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  badge?: number;
  onClick: () => void;
  collapsed?: boolean;
}

export default function SidebarItem({
  label,
  icon,
  isActive = false,
  badge,
  onClick,
  collapsed = false,
}: SidebarItemProps) {
  return (
    <motion.button
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
      className={`
        group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5
        text-sm font-medium transition-all duration-200
        ${collapsed ? "justify-center" : ""}
        ${
          isActive
            ? "bg-airos-500/10 text-white"
            : "text-[--text-secondary] hover:bg-white/[0.03] hover:text-white"
        }
      `}
    >
      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-airos-500"
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      )}

      <span className={`flex-shrink-0 ${isActive ? "text-airos-400" : "text-[--text-muted] group-hover:text-[--text-secondary]"}`}>
        {icon}
      </span>

      {!collapsed && (
        <motion.span
          initial={false}
          animate={{ opacity: 1 }}
          className="truncate"
        >
          {label}
        </motion.span>
      )}

      {!collapsed && badge !== undefined && badge > 0 && (
        <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-airos-500/15 px-1.5 text-xs font-medium text-airos-400">
          {badge}
        </span>
      )}
    </motion.button>
  );
}
