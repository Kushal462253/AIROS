"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isBrainNode?: boolean;
  pulseProgress?: number;
}

interface Synapse {
  from: Node;
  to: Node;
  pulses: number[]; // Array of pulse progress (0 to 1)
}

interface ResearchDrawing {
  x: number;
  y: number;
  type: "dna" | "attention" | "molecule" | "formula" | "vector";
  angle: number;
  speed: number;
  scale: number;
}

const FORMULAS = [
  "f(x) = W^T x + b",
  "Attention(Q,K,V)",
  "p(θ|D) = p(D|θ)p(θ)/p(D)",
  "L_G = E_{x,y}[log D(x,y)]",
  "cos(θ) = A·B / ||A||||B||",
];

export default function InteractiveResearchBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });
  const activeTabRef = useRef<string>("overview");

  useEffect(() => {
    // Listen to workspace tab shifts to light up different canvas neural coordinate zones
    const handleTabChange = (e: any) => {
      activeTabRef.current = e.detail || "overview";
    };
    window.addEventListener("airos:activeTab", handleTabChange);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Parallax values
    let parallaxX = 0;
    let parallaxY = 0;

    // 1. Generate thousands of background dust particles
    const dustParticles: { x: number; y: number; size: number; alpha: number; speed: number }[] = [];
    const dustCount = Math.min(220, Math.floor((width * height) / 8000));
    for (let i = 0; i < dustCount; i++) {
      dustParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 0.8 + 0.4,
        alpha: Math.random() * 0.15 + 0.05,
        speed: Math.random() * 0.05 + 0.02,
      });
    }

    // 2. Generate Neurons & Brain Node points
    const nodes: Node[] = [];
    const nodeCount = 50;
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        radius: Math.random() * 1.5 + 1,
        isBrainNode: Math.random() > 0.82,
      });
    }

    // Connect synapses
    const synapses: Synapse[] = [];
    for (let i = 0; i < nodes.length; i++) {
      let connections = 0;
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 180 && connections < 3) {
          synapses.push({
            from: nodes[i],
            to: nodes[j],
            pulses: [],
          });
          connections++;
        }
      }
    }

    // 3. Generate drifting research objects
    const drawings: ResearchDrawing[] = [];
    const drawingCount = 6;
    const types: ResearchDrawing["type"][] = ["dna", "attention", "molecule", "formula", "vector"];
    for (let i = 0; i < drawingCount; i++) {
      drawings.push({
        x: Math.random() * width,
        y: Math.random() * height,
        type: types[i % types.length],
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.08 + 0.03,
        scale: Math.random() * 0.3 + 0.7,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Pulse spawner
    let frame = 0;

    // Drawing Helpers
    const drawDNA = (c: CanvasRenderingContext2D, x: number, y: number, angle: number, scale: number) => {
      c.save();
      c.translate(x, y);
      c.rotate(angle);
      c.strokeStyle = "rgba(129, 140, 248, 0.02)";
      c.lineWidth = 1;
      
      const length = 70 * scale;
      const amplitude = 12 * scale;
      const frequency = 0.08;

      for (let i = -length / 2; i < length / 2; i += 2) {
        const y1 = Math.sin(i * frequency) * amplitude;
        const y2 = -Math.sin(i * frequency) * amplitude;

        c.beginPath();
        c.moveTo(i, y1);
        c.lineTo(i, y2);
        c.stroke();

        // Nodes
        if (i % 8 === 0) {
          c.fillStyle = "rgba(99, 102, 241, 0.03)";
          c.beginPath();
          c.arc(i, y1, 2, 0, Math.PI * 2);
          c.arc(i, y2, 2, 0, Math.PI * 2);
          c.fill();
        }
      }
      c.restore();
    };

    const drawAttention = (c: CanvasRenderingContext2D, x: number, y: number, scale: number) => {
      c.save();
      c.translate(x, y);
      const points = [
        { x: -20, y: -20 }, { x: 20, y: -20 },
        { x: -30, y: 15 }, { x: 30, y: 15 },
        { x: 0, y: 30 }
      ];
      c.strokeStyle = "rgba(99, 102, 241, 0.015)";
      c.lineWidth = 0.5;
      
      // Connect all lines
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          c.beginPath();
          c.moveTo(points[i].x * scale, points[i].y * scale);
          c.lineTo(points[j].x * scale, points[j].y * scale);
          c.stroke();
        }
      }
      c.restore();
    };

    const drawMolecule = (c: CanvasRenderingContext2D, x: number, y: number, scale: number) => {
      c.save();
      c.translate(x, y);
      c.strokeStyle = "rgba(165, 180, 252, 0.015)";
      c.fillStyle = "rgba(165, 180, 252, 0.015)";
      c.lineWidth = 1;

      const atoms = [
        { x: 0, y: 0, r: 6 },
        { x: -20, y: -15, r: 4 },
        { x: 25, y: -10, r: 4.5 },
        { x: -10, y: 25, r: 3 },
      ];

      // Draw bonds
      c.beginPath();
      c.moveTo(atoms[0].x * scale, atoms[0].y * scale);
      c.lineTo(atoms[1].x * scale, atoms[1].y * scale);
      c.moveTo(atoms[0].x * scale, atoms[0].y * scale);
      c.lineTo(atoms[2].x * scale, atoms[2].y * scale);
      c.moveTo(atoms[0].x * scale, atoms[0].y * scale);
      c.lineTo(atoms[3].x * scale, atoms[3].y * scale);
      c.stroke();

      // Draw atoms
      atoms.forEach((a) => {
        c.beginPath();
        c.arc(a.x * scale, a.y * scale, a.r * scale, 0, Math.PI * 2);
        c.fill();
      });
      c.restore();
    };

    // Animation Loop
    const draw = () => {
      frame++;
      
      // Apply smooth mouse parallax shift
      parallaxX += (mouseRef.current.targetX - width / 2 - parallaxX) * 0.05;
      parallaxY += (mouseRef.current.targetY - height / 2 - parallaxY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Save context to apply offset translations (Parallax)
      ctx.save();
      // Drift background elements opposite to cursor motion
      ctx.translate(-parallaxX * 0.035, -parallaxY * 0.035);

      // Render dust particles
      dustParticles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < 0) p.y = height;
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      // Render drifting research assets
      drawings.forEach((d, idx) => {
        d.x += Math.sin(frame * 0.005 + idx) * d.speed;
        d.y -= d.speed * 0.45;
        d.angle += 0.001;

        if (d.y < -100) d.y = height + 100;
        if (d.x < -100) d.x = width + 100;
        if (d.x > width + 100) d.x = -100;

        if (d.type === "dna") drawDNA(ctx, d.x, d.y, d.angle, d.scale);
        else if (d.type === "attention") drawAttention(ctx, d.x, d.y, d.scale);
        else if (d.type === "molecule") drawMolecule(ctx, d.x, d.y, d.scale);
        else if (d.type === "formula") {
          ctx.fillStyle = "rgba(165, 180, 252, 0.018)";
          ctx.font = "10px var(--font-jetbrains-mono), monospace";
          ctx.fillText(FORMULAS[idx % FORMULAS.length], d.x, d.y);
        } else if (d.type === "vector") {
          ctx.strokeStyle = "rgba(129, 140, 248, 0.015)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x + 30 * d.scale, d.y - 30 * d.scale);
          ctx.stroke();
          // Draw arrowhead
          ctx.fillStyle = "rgba(129, 140, 248, 0.015)";
          ctx.beginPath();
          ctx.arc(d.x + 30 * d.scale, d.y - 30 * d.scale, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Spawn random pulses across synapses
      if (frame % 40 === 0 && synapses.length > 0) {
        const randomSynapse = synapses[Math.floor(Math.random() * synapses.length)];
        // Only spawn if not saturated
        if (randomSynapse.pulses.length < 2) {
          randomSynapse.pulses.push(0);
        }
      }

      // Determine active zone coordinate bias to light up on tab transitions
      let activeX = width / 2;
      let activeY = height / 2;
      if (activeTabRef.current === "overview") {
        activeX = width * 0.25;
        activeY = height * 0.4;
      } else if (activeTabRef.current === "literature") {
        activeX = width * 0.75;
        activeY = height * 0.3;
      } else if (activeTabRef.current === "evidence") {
        activeX = width * 0.3;
        activeY = height * 0.7;
      } else if (activeTabRef.current === "knowledgeGraph") {
        activeX = width * 0.55;
        activeY = height * 0.55;
      }

      // Render Synapse Edges
      synapses.forEach((s) => {
        const dx = s.from.x - s.to.x;
        const dy = s.from.y - s.to.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Dynamic edge lighting based on current active workspace coordinates
        const centerDistToFrom = Math.sqrt((s.from.x - activeX) ** 2 + (s.from.y - activeY) ** 2);
        const isHighlight = centerDistToFrom < 320;

        const maxAlpha = isHighlight ? 0.075 : 0.03;
        const alpha = (1 - Math.min(1, dist / 180)) * maxAlpha;

        ctx.strokeStyle = isHighlight ? `rgba(129, 140, 248, ${alpha * 1.5})` : `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = isHighlight ? 0.9 : 0.55;
        ctx.beginPath();
        ctx.moveTo(s.from.x, s.from.y);
        ctx.lineTo(s.to.x, s.to.y);
        ctx.stroke();

        // Draw and update pulses traveling along this connection
        s.pulses = s.pulses
          .map((p) => {
            const px = s.from.x + (s.to.x - s.from.x) * p;
            const py = s.from.y + (s.to.y - s.from.y) * p;

            ctx.fillStyle = isHighlight ? "rgba(165, 180, 252, 0.4)" : "rgba(255, 255, 255, 0.2)";
            ctx.beginPath();
            ctx.arc(px, py, 1.2, 0, Math.PI * 2);
            ctx.fill();

            return p + 0.008; // speed
          })
          .filter((p) => p < 1); // remove complete pulses
      });

      // Render Nodes
      nodes.forEach((n) => {
        // Drift motion
        n.x += n.vx;
        n.y += n.vy;

        // Wrap around canvas
        if (n.x < 0) n.x = width;
        if (n.x > width) n.x = 0;
        if (n.y < 0) n.y = height;
        if (n.y > height) n.y = 0;

        // Mouse attraction
        if (mouseRef.current.active) {
          const dx = mouseRef.current.targetX - n.x;
          const dy = mouseRef.current.targetY - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 220) {
            const pull = (220 - dist) / 220 * 0.16;
            n.x += (dx / dist) * pull;
            n.y += (dy / dist) * pull;
          }
        }

        const centerDist = Math.sqrt((n.x - activeX) ** 2 + (n.y - activeY) ** 2);
        const isNearActive = centerDist < 300;

        // Draw Node glow
        if (n.isBrainNode || isNearActive) {
          ctx.fillStyle = isNearActive ? "rgba(99, 102, 241, 0.025)" : "rgba(16, 185, 129, 0.015)";
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius * 6, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = isNearActive ? "rgba(129, 140, 248, 0.3)" : "rgba(255, 255, 255, 0.15)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore(); // Restore parallax translations

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("airos:activeTab", handleTabChange);
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-50 pointer-events-none block select-none bg-[#030306]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
