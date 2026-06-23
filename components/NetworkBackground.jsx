'use client';
import { useEffect, useRef } from 'react';

/**
 * GlowOrbs (bold, room-filling, cursor-reactive)
 * Three large soft-light orbs drift slowly across the FULL page height
 * (not just viewport) and visibly chase the cursor with springy elastic
 * lag — big, obvious motion meant to be noticed from across a room.
 * Replaces the old subtle node-network for the Editorial Sidebar sample.
 */
export default function NetworkBackground() {
  const orbRefs = useRef([]);
  const rafRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const pos = useRef([
    { x: 0.2, y: 0.15, vx: 0, vy: 0 },
    { x: 0.75, y: 0.45, vx: 0, vy: 0 },
    { x: 0.4, y: 0.8, vx: 0, vy: 0 },
  ]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onMove = (e) => {
      const docH = document.documentElement.scrollHeight;
      mouse.current = { x: e.clientX, y: e.clientY + window.scrollY, docH };
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    if (reduced) {
      return () => window.removeEventListener('pointermove', onMove);
    }

    const STRENGTH = [0.012, 0.02, 0.016]; // each orb chases at a different speed -> elastic lag feel
    const DAMPING = 0.90;

    const tick = (t) => {
      const docH = document.documentElement.scrollHeight || window.innerHeight;
      const docW = window.innerWidth;

      pos.current.forEach((p, i) => {
        // idle drift even with no cursor
        const idleX = Math.sin(t * 0.00018 + i * 2) * 0.04;
        const idleY = Math.cos(t * 0.00014 + i * 3) * 0.04;

        const targetX = (mouse.current.x > -1000 ? mouse.current.x / docW : p.x) + idleX;
        const targetY = (mouse.current.x > -1000 ? mouse.current.y / docH : p.y) + idleY;

        const ax = (targetX - p.x) * STRENGTH[i];
        const ay = (targetY - p.y) * STRENGTH[i];
        p.vx = (p.vx + ax) * DAMPING;
        p.vy = (p.vy + ay) * DAMPING;
        p.x += p.vx;
        p.y += p.vy;

        const el = orbRefs.current[i];
        if (el) {
          el.style.left = `${p.x * 100}%`;
          el.style.top = `${p.y * docH}px`;
        }
      });

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div className="glow-bg" aria-hidden="true">
      <div ref={el => orbRefs.current[0] = el} className="glow-orb glow-orb-a" />
      <div ref={el => orbRefs.current[1] = el} className="glow-orb glow-orb-b" />
      <div ref={el => orbRefs.current[2] = el} className="glow-orb glow-orb-c" />
      <style>{`
        .glow-bg {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          min-height: 100vh; z-index: 0; overflow: hidden; pointer-events: none;
        }
        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          will-change: left, top;
          transform: translate(-50%, -50%);
        }
        .glow-orb-a { width: 620px; height: 620px; background: radial-gradient(circle, var(--text-color) 0%, transparent 70%); opacity: 0.16; }
        .glow-orb-b { width: 520px; height: 520px; background: radial-gradient(circle, var(--text-color) 0%, transparent 70%); opacity: 0.12; }
        .glow-orb-c { width: 460px; height: 460px; background: radial-gradient(circle, var(--text-color) 0%, transparent 70%); opacity: 0.14; }

        body.light-mode .glow-orb-a,
        body.light-mode .glow-orb-b,
        body.light-mode .glow-orb-c {
          opacity: 0.22;
        }
      `}</style>
    </div>
  );
}
