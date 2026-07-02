"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface AuthFooterProps {
  text: string;
  linkText: string;
  linkHref: string;
}

const footerItem = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, delay: 0.4 },
  },
};

export default function AuthFooter({
  text,
  linkText,
  linkHref,
}: AuthFooterProps) {
  return (
    <motion.p
      variants={footerItem}
      initial="hidden"
      animate="visible"
      className="mt-6 text-center text-sm text-[--text-muted]"
    >
      {text}{" "}
      <Link
        href={linkHref}
        className="font-medium text-airos-400 transition-colors duration-200 hover:text-airos-300"
      >
        {linkText}
      </Link>
    </motion.p>
  );
}
