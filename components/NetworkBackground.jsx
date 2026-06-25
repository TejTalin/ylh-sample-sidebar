'use client';

/**
 * Constellation (Sidebar sample)
 * Sparse, isolated polygon constellation clusters spanning the full
 * page height. The cursor-following light effect now lives in the
 * global CursorSpotlight component (rendered in layout.jsx) so it can
 * brighten text and cards too, not just this background layer.
 */
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

function buildLinks() {
  const links = [];
  CLUSTERS.forEach((cluster, ci) => {
    const n = cluster.nodes.length;
    for (let i = 1; i < n; i++) links.push({ ci, a: 0, b: i });
    if (n > 2) links.push({ ci, a: 1, b: n - 1 });
  });
  return links;
}
const LINKS = buildLinks();

const flatNodes = CLUSTERS.flatMap((cluster, ci) =>
  cluster.nodes.map((n, ni) => ({ ci, ni, x: cluster.cx + n[0], y: cluster.cy + n[1] }))
);

export default function NetworkBackground() {
  return (
    <div className="constellation-bg" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="constellation-svg">
        {LINKS.map(({ ci, a, b }, i) => {
          const cluster = CLUSTERS[ci];
          const na = cluster.nodes[a], nb = cluster.nodes[b];
          return (
            <line key={i}
              x1={cluster.cx + na[0]} y1={cluster.cy + na[1]}
              x2={cluster.cx + nb[0]} y2={cluster.cy + nb[1]}
            />
          );
        })}
      </svg>
      <div className="constellation-dots">
        {flatNodes.map((n, i) => (
          <span key={i} className="constellation-dot" style={{ left: `${n.x}%`, top: `${n.y}%` }} />
        ))}
      </div>
      <style>{`
        .constellation-bg {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          min-height: 100vh; z-index: 0; overflow: hidden; pointer-events: none;
        }
        .constellation-svg { position: absolute; inset: 0; width: 100%; height: 100%; }
        .constellation-svg line { stroke: var(--glass-border); stroke-width: 1.2; opacity: 0.9; }
        .constellation-dots { position: absolute; inset: 0; }
        .constellation-dot {
          position: absolute; width: 4px; height: 4px; border-radius: 50%;
          background: var(--text-color); opacity: 0.55;
          transform: translate(-50%, -50%);
        }
      `}</style>
    </div>
  );
}
