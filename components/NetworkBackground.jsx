'use client';
import { useEffect, useRef } from 'react';

const NODES = [
  { x: 10, y: 14 }, { x: 24, y: 26 }, { x: 40, y: 12 }, { x: 56, y: 28 },
  { x: 72, y: 13 }, { x: 88, y: 24 }, { x: 16, y: 52 }, { x: 33, y: 64 },
  { x: 50, y: 50 }, { x: 67, y: 66 }, { x: 84, y: 51 }, { x: 12, y: 82 },
  { x: 40, y: 88 }, { x: 75, y: 86 },
];
const LINKS = [[0,1],[1,2],[2,3],[3,4],[4,5],[1,6],[3,8],[6,7],[7,8],[8,9],[9,10],[6,11],[7,12],[9,13]];

export default function NetworkBackground() {
  const svgRef = useRef(null);
  const dotsRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const phases = NODES.map((_, i) => ({
      xPhase: i * 0.7, yPhase: i * 0.5 + 1.1,
      xAmp: 1 + (i % 3) * 0.5, yAmp: 0.8 + (i % 4) * 0.4,
      speed: 0.00024 + (i % 5) * 0.00004,
    }));
    const tick = (t) => {
      dotsRef.current.forEach((el, i) => {
        if (!el) return;
        const p = phases[i];
        const dx = Math.sin(t * p.speed + p.xPhase) * p.xAmp;
        const dy = Math.cos(t * p.speed + p.yPhase) * p.yAmp;
        el.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
      });
      if (svgRef.current) {
        const lines = svgRef.current.querySelectorAll('line');
        lines.forEach((line, idx) => {
          const [from, to] = LINKS[idx];
          const pf = phases[from], pt = phases[to];
          const dxf = Math.sin(t * pf.speed + pf.xPhase) * pf.xAmp;
          const dyf = Math.cos(t * pf.speed + pf.yPhase) * pf.yAmp;
          const dxt = Math.sin(t * pt.speed + pt.xPhase) * pt.xAmp;
          const dyt = Math.cos(t * pt.speed + pt.yPhase) * pt.yAmp;
          line.setAttribute('x1', NODES[from].x + dxf / window.innerWidth * 100);
          line.setAttribute('y1', NODES[from].y + dyf / window.innerHeight * 100);
          line.setAttribute('x2', NODES[to].x + dxt / window.innerWidth * 100);
          line.setAttribute('y2', NODES[to].y + dyt / window.innerHeight * 100);
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="network-bg" aria-hidden="true">
      <svg ref={svgRef} viewBox="0 0 100 100" preserveAspectRatio="none" className="network-svg">
        {LINKS.map(([from, to], i) => (
          <line key={i} x1={NODES[from].x} y1={NODES[from].y} x2={NODES[to].x} y2={NODES[to].y} />
        ))}
      </svg>
      <div className="network-dots">
        {NODES.map((n, i) => (
          <span key={i} ref={el => dotsRef.current[i] = el} className="network-dot" style={{ left: `${n.x}%`, top: `${n.y}%` }} />
        ))}
      </div>
      <style>{`
        .network-bg { position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
        .network-svg { position: absolute; inset: 0; width: 100%; height: 100%; }
        .network-svg line { stroke: var(--glass-border); stroke-width: 1; }
        .network-dots { position: absolute; inset: 0; }
        .network-dot { position: absolute; width: 4px; height: 4px; border-radius: 50%; background: var(--text-color); opacity: 0.5; will-change: transform; }
      `}</style>
    </div>
  );
}
