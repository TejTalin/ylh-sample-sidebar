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
  const mouse = useRef({ x: -9999, y: -9999 });
  const offsets = useRef(NODES.map(() => ({ x: 0, y: 0 })));

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 }; };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);

    const phases = NODES.map((_, i) => ({
      xPhase: i * 0.7, yPhase: i * 0.5 + 1.1,
      xAmp: 1 + (i % 3) * 0.5, yAmp: 0.8 + (i % 4) * 0.4,
      speed: 0.00024 + (i % 5) * 0.00004,
    }));

    const RADIUS = 220;
    const PULL = 0.16;

    const tick = (t) => {
      const w = window.innerWidth, h = window.innerHeight;

      NODES.forEach((n, i) => {
        const p = phases[i];
        const driftX = Math.sin(t * p.speed + p.xPhase) * p.xAmp;
        const driftY = Math.cos(t * p.speed + p.yPhase) * p.yAmp;

        const nodePxX = (n.x / 100) * w;
        const nodePxY = (n.y / 100) * h;
        const dx = mouse.current.x - nodePxX;
        const dy = mouse.current.y - nodePxY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let pullX = 0, pullY = 0;
        if (dist < RADIUS) {
          const force = (1 - dist / RADIUS) * PULL;
          pullX = dx * force;
          pullY = dy * force;
        }

        const o = offsets.current[i];
        o.x += ((driftX + pullX) - o.x) * 0.08;
        o.y += ((driftY + pullY) - o.y) * 0.08;

        const el = dotsRef.current[i];
        if (el) el.style.transform = `translate(calc(-50% + ${o.x}px), calc(-50% + ${o.y}px))`;
      });

      if (svgRef.current) {
        const lines = svgRef.current.querySelectorAll('line');
        lines.forEach((line, idx) => {
          const [from, to] = LINKS[idx];
          const of = offsets.current[from], ot = offsets.current[to];
          line.setAttribute('x1', NODES[from].x + of.x / w * 100);
          line.setAttribute('y1', NODES[from].y + of.y / h * 100);
          line.setAttribute('x2', NODES[to].x + ot.x / w * 100);
          line.setAttribute('y2', NODES[to].y + ot.y / h * 100);
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
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
        .network-dot {
          position: absolute; width: 4px; height: 4px; border-radius: 50%;
          background: var(--text-color); opacity: 0.5;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
