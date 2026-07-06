"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import type { KnowledgeNode, KnowledgeEdge } from "../types";

interface KnowledgeGraphCanvasProps {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  selectedNode: KnowledgeNode | null;
  onSelectNode: (node: KnowledgeNode | null) => void;
}

export default function KnowledgeGraphCanvas({
  nodes,
  edges,
  selectedNode,
  onSelectNode,
}: KnowledgeGraphCanvasProps) {
  const containerRef = useRef<SVGSVGElement>(null);
  
  // Pan and zoom states
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  const width = 800;
  const height = 550;
  const centerX = width / 2;
  const centerY = height / 2;

  // Initialize pan to center the graph
  useEffect(() => {
    setPan({ x: 0, y: 0 });
    setZoom(0.95);
  }, [nodes.length]);

  // 1. Position nodes deterministically in layered circles to prevent overlaps
  const positionedNodes = useMemo(() => {
    const paperNodes = nodes.filter((n) => n.type === "Paper");
    const rqObjNodes = nodes.filter((n) => n.type === "Research Question" || n.type === "Planner Objective");
    const conceptNodes = nodes.filter(
      (n) => !["Paper", "Research Question", "Planner Objective"].includes(n.type)
    );

    const positions: Record<string, { x: number; y: number }> = {};

    // Center Core concept nodes
    conceptNodes.forEach((node, idx) => {
      const radius = 100;
      const angle = (idx * (2 * Math.PI)) / Math.max(1, conceptNodes.length);
      positions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });

    // Middle Layer paper nodes
    paperNodes.forEach((node, idx) => {
      const radius = 210;
      const angle = (idx * (2 * Math.PI)) / Math.max(1, paperNodes.length) + 0.3; // offset slightly
      positions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });

    // Outer Layer objectives and RQs
    rqObjNodes.forEach((node, idx) => {
      const radius = 310;
      const angle = (idx * (2 * Math.PI)) / Math.max(1, rqObjNodes.length) - 0.2;
      positions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });

    return nodes.map((node) => ({
      ...node,
      x: positions[node.id]?.x ?? centerX,
      y: positions[node.id]?.y ?? centerY,
    }));
  }, [nodes, centerX, centerY]);

  // Map to get x,y coordinates by node ID
  const coordMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    positionedNodes.forEach((node) => {
      map.set(node.id, { x: node.x, y: node.y });
    });
    return map;
  }, [positionedNodes]);

  // Determine connected neighbors of the selected node
  const neighborIds = useMemo(() => {
    if (!selectedNode) return new Set<string>();
    const neighbors = new Set<string>();
    edges.forEach((edge) => {
      if (edge.source === selectedNode.id) {
        neighbors.add(edge.target);
      }
      if (edge.target === selectedNode.id) {
        neighbors.add(edge.source);
      }
    });
    return neighbors;
  }, [selectedNode, edges]);

  // Pan interaction handlers
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.target === containerRef.current || (e.target as SVGElement).tagName === "line" || (e.target as SVGElement).tagName === "path") {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Zoom handling via wheel
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const scaleFactor = 1.05;
    const nextZoom = e.deltaY < 0 ? zoom * scaleFactor : zoom / scaleFactor;
    setZoom(Math.max(0.3, Math.min(3, nextZoom)));
  };

  // Type color mappings
  const getNodeColor = (type: string) => {
    switch (type) {
      case "Concept":
        return "fill-indigo-500/20 stroke-indigo-400";
      case "Architecture":
        return "fill-blue-500/20 stroke-blue-400";
      case "Algorithm":
        return "fill-violet-500/20 stroke-violet-400";
      case "Methodology":
        return "fill-sky-500/20 stroke-sky-400";
      case "Dataset":
        return "fill-cyan-500/20 stroke-cyan-400";
      case "Metric":
        return "fill-emerald-500/20 stroke-emerald-400";
      case "Limitation":
        return "fill-amber-500/20 stroke-amber-400";
      case "Paper":
        return "fill-slate-500/10 stroke-slate-400";
      case "Research Question":
        return "fill-pink-500/10 stroke-pink-400";
      case "Planner Objective":
        return "fill-teal-500/10 stroke-teal-400";
      default:
        return "fill-white/10 stroke-white/30";
    }
  };

  return (
    <div className="relative border border-white/[0.04] bg-[#0c0c14]/15 rounded-xl overflow-hidden flex-grow h-full w-full select-none">
      {/* Interactive Controls Overlay */}
      <div className="absolute left-4 top-4 z-10 flex flex-col gap-2 font-mono text-[9px]">
        <div className="flex gap-1 bg-black/60 backdrop-blur border border-white/10 rounded-lg p-1.5">
          <button
            onClick={() => setZoom((z) => Math.min(3, z * 1.1))}
            className="h-6 w-6 rounded bg-white/[0.03] hover:bg-white/[0.1] border border-white/5 flex items-center justify-center text-white"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.3, z / 1.1))}
            className="h-6 w-6 rounded bg-white/[0.03] hover:bg-white/[0.1] border border-white/5 flex items-center justify-center text-white"
            title="Zoom Out"
          >
            -
          </button>
          <button
            onClick={() => {
              setPan({ x: 0, y: 0 });
              setZoom(0.95);
            }}
            className="px-2 h-6 rounded bg-white/[0.03] hover:bg-white/[0.1] border border-white/5 flex items-center justify-center text-white"
            title="Reset Pan/Zoom"
          >
            RESET
          </button>
        </div>
      </div>

      <svg
        ref={containerRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className={`cursor-${isPanning ? "grabbing" : "grab"} bg-transparent`}
      >
        <defs>
          {/* Edge arrow marker */}
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="20"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" opacity="0.6" />
          </marker>
          <marker
            id="arrow-active"
            viewBox="0 0 10 10"
            refX="20"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#818cf8" />
          </marker>

          {/* Active glow filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Global zoom/pan group wrapper */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} style={{ originX: "center", originY: "center" }}>
          {/* 2. Render Edges (Relationships) */}
          <g>
            {edges.map((edge) => {
              const fromPt = coordMap.get(edge.source);
              const toPt = coordMap.get(edge.target);
              if (!fromPt || !toPt) return null;

              const isEdgeSelected = selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id);
              const isFaded = selectedNode && !isEdgeSelected;

              // Animate flow effect along line if active
              const dashArray = isEdgeSelected ? "5, 5" : undefined;
              const flowAnimationClass = isEdgeSelected ? "animate-edge-flow" : "";

              return (
                <g key={edge.id}>
                  {/* Outer line for hovering/selection glow */}
                  {isEdgeSelected && (
                    <line
                      x1={fromPt.x}
                      y1={fromPt.y}
                      x2={toPt.x}
                      y2={toPt.y}
                      stroke="#818cf8"
                      strokeWidth={4}
                      strokeOpacity={0.25}
                      filter="url(#glow)"
                    />
                  )}

                  {/* Core relationship connection line */}
                  <line
                    x1={fromPt.x}
                    y1={fromPt.y}
                    x2={toPt.x}
                    y2={toPt.y}
                    stroke={isEdgeSelected ? "#818cf8" : "#475569"}
                    strokeWidth={isEdgeSelected ? 1.8 : 1.2}
                    strokeOpacity={isFaded ? 0.15 : isEdgeSelected ? 1 : 0.45}
                    markerEnd={`url(#${isEdgeSelected ? "arrow-active" : "arrow"})`}
                    strokeDasharray={dashArray}
                    className={flowAnimationClass}
                  />

                  {/* Relationship Label Overlay */}
                  {!isFaded && (
                    <text
                      x={(fromPt.x + toPt.x) / 2}
                      y={(fromPt.y + toPt.y) / 2 - 4}
                      className="text-[7px] font-mono font-semibold fill-slate-400 bg-black text-center"
                      textAnchor="middle"
                      opacity={isEdgeSelected ? 1 : 0.45}
                    >
                      {edge.relationship}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* 3. Render Nodes */}
          <g>
            {positionedNodes.map((node) => {
              const isSelected = selectedNode && selectedNode.id === node.id;
              const isNeighbor = neighborIds.has(node.id);
              const isFaded = selectedNode && !isSelected && !isNeighbor;
              
              // Larger circles for papers/RQs/objectives, smaller bubbles for core concepts
              const r = ["Paper", "Research Question", "Planner Objective"].includes(node.type) ? 14 : 16;
              const themeColor = getNodeColor(node.type);

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => onSelectNode(isSelected ? null : node)}
                  className="cursor-pointer group"
                  style={{ opacity: isFaded ? 0.3 : 1, transition: "opacity 0.25s ease" }}
                >
                  {/* Selector Ring Glow */}
                  {isSelected && (
                    <circle
                      r={r + 4}
                      className="fill-transparent stroke-indigo-400/40"
                      strokeWidth={1.5}
                      filter="url(#glow)"
                    />
                  )}

                  {/* Core Node circle */}
                  <circle
                    r={r}
                    className={`${themeColor} transition-all duration-300`}
                    strokeWidth={isSelected ? 2 : isNeighbor ? 1.5 : 1}
                  />

                  {/* Hover visual enhancement */}
                  <circle
                    r={r}
                    className="fill-transparent stroke-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    strokeWidth={1.5}
                  />

                  {/* Abbreviation Code labels */}
                  <text
                    dy=".3em"
                    className="text-[8px] font-mono font-bold fill-white text-center"
                    textAnchor="middle"
                  >
                    {node.type === "Research Question"
                      ? "RQ"
                      : node.type === "Planner Objective"
                      ? "OBJ"
                      : node.type === "Paper"
                      ? "DOC"
                      : node.name.substring(0, 3).toUpperCase()}
                  </text>

                  {/* Floating text name tag below node */}
                  <text
                    y={r + 14}
                    className={`text-[8px] font-medium tracking-wide text-center transition-colors duration-200 ${
                      isSelected ? "fill-indigo-300 font-bold" : "fill-[--text-secondary] group-hover:fill-white"
                    }`}
                    textAnchor="middle"
                  >
                    {node.name.length > 18 ? `${node.name.substring(0, 16)}...` : node.name}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {/* Styled Edge animation helper tags */}
      <style jsx global>{`
        @keyframes edge-flow-slide {
          to {
            stroke-dashoffset: -40;
          }
        }
        .animate-edge-flow {
          animation: edge-flow-slide 2.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
