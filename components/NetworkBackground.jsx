'use client';
import { useEffect, useRef } from 'react';

/**
 * ConstellationSpotlight (Sidebar sample)
 * Sparse, isolated polygon constellations (not a uniform grid) scattered
 * across the full page height, plus a soft circular spotlight that
 * follows the cursor and visibly brightens the network + page surface
 * beneath it — matching the reference: a quiet network with a torch
 * that follows you, not a colorful light show.
 */

// Pre-defined isolated clusters: each cluster is a small set of nodes
// close together, clusters are far apart from each other (not a uniform grid).
const CLUSTERS = [
  { cx: 8,  cy: 8,  nodes: [[0,0],[3,-2],[-2,4],[5,3]] },
  { cx: 22, cy: 28, nodes: [[0,0],[4,2],[2,-4],[-3,3],[6,-1]] },
  { cx: 88, cy: 12, nodes: [[0,0],[-4,3],[2,5],[-2,-3]] },
  { cx: 70, cy: 32, nodes: [[0,0],[5,2],[-3,4],[3,-3]] },
  { cx: 12, cy: 55, nodes: [[0,0],[4,-2],[-2,3]] },
  { cx: 45, cy: 62, nodes: [[0,0],[3,3],[-4,1],[2,-4],[-1,5]] },
  { cx: 80, cy: 58, nodes: [[0,0],[-3,2],[3,4]] },
  { cx: 30, cy: 85, nodes: [[0,0],[4,2],[-2,-3],[1,4]] },
  { cx: 90, cy: 86, nodes: [[0,0],[-4,3],[2,-2]] },
  { cx: 60, cy: 90, nodes: [[0,0],[3,-3],[-3,2],[5,1]] },
];

// Connect every node within a cluster to the cluster's first node and to
// its nearest sibling, giving each cluster a few internal triangulated lines.
function buildLinks() {
  const links = [];
  CLUSTERS.forEach((cluster, ci) => {
    const n = cluster.nodes.length;
    for (let i = 1; i < n; i++) {
      links.push({ ci, a: 0, b: i });
    }
    if (n > 2) links.push({ ci, a: 1, b: n - 1 });
  });
  return links;
}
const LINKS = buildLinks();

export default function NetworkBackground() {
  const svgRef = useRef(null);
  const dotsRef = useRef([]);
  const spotlightRef = useRef(null);
  const rafRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const eased = useRef({ x: -9999, y: -9999 });

  // flat list of {ci, ni, x, y} for refs
  const flatNodes = useRef(
    CLUSTERS.flatMap((cluster, ci) =>
      cluster.nodes.map((n, ni) => ({ ci, ni, x: cluster.cx + n[0], y: cluster.cy + n[1] }))
    )
  );

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY + window.scrollY };
    };
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 }; };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);

    const tick = () => {
      eased.current.x += (mouse.current.x - eased.current.x) * 0.12;
      eased.current.y += (mouse.current.y - eased.current.y) * 0.12;

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate(${eased.current.x - 260}px, ${eased.current.y - 260}px)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    if (!reduced) {
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div className="constellation-bg" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="constellation-svg">
        {LINKS.map(({ ci, a, b }, i) => {
          const cluster = CLUSTERS[ci];
          const na = cluster.nodes[a], nb = cluster.nodes[b];
          return (
            <line
              key={i}
              x1={cluster.cx + na[0]} y1={cluster.cy + na[1]}
              x2={cluster.cx + nb[0]} y2={cluster.cy + nb[1]}
            />
          );
        })}
      </svg>
      <div className="constellation-dots">
        {flatNodes.current.map((n, i) => (
          <span key={i} className="constellation-dot" style={{ left: `${n.x}%`, top: `${n.y}%` }} />
        ))}
      </div>
      <div ref={spotlightRef} className="cursor-spotlight" />
      <style>{`
        .constellation-bg {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          min-height: 100vh; z-index: 0; overflow: hidden; pointer-events: none;
        }
        .constellation-svg { position: absolute; inset: 0; width: 100%; height: 100%; }
        .constellation-svg line { stroke: var(--glass-border); stroke-width: 1; }
        .constellation-dots { position: absolute; inset: 0; }
        .constellation-dot {
          position: absolute; width: 3px; height: 3px; border-radius: 50%;
          background: var(--text-color); opacity: 0.35;
          transform: translate(-50%, -50%);
        }
        .cursor-spotlight {
          position: absolute; top: 0; left: 0;
          width: 520px; height: 520px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--glass-bg) 0%, transparent 70%);
          will-change: transform;
          mix-blend-mode: overlay;
        }
        body.light-mode .cursor-spotlight {
          background: radial-gradient(circle, rgba(0,0,0,0.10) 0%, transparent 70%);
          mix-blend-mode: multiply;
        }

        @media (prefers-reduced-motion: reduce) {
          .cursor-spotlight { display: none; }
        }
        @media (pointer: coarse) {
          .cursor-spotlight { display: none; }
        }
      `}</style>
    </div>
  );
}
