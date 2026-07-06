"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";

export default function Magnetic({ children }: { children: React.ReactElement }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    
    // Magnetic pull: limit pull range to 2-4px towards cursor
    setPosition({ x: distanceX * 0.16, y: distanceY * 0.16 });
    
    // Calculate tilt angles based on cursor offset from button center
    const tiltX = (distanceY / (height / 2)) * -5;
    const tiltY = (distanceX / (width / 2)) * 5;
    setRotate({ x: tiltX, y: tiltY });
    setScale(1.02);
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setRotate({ x: 0, y: 0 });
    setScale(1);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: position.x,
        y: position.y,
        rotateX: rotate.x,
        rotateY: rotate.y,
        scale: scale,
      }}
      transition={{ type: "spring", stiffness: 180, damping: 14, mass: 0.1 }}
      className="inline-block"
      style={{ transformStyle: "preserve-3d", perspective: 600 }}
    >
      {children}
    </motion.div>
  );
}
