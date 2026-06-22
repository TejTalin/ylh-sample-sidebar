'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '../lib/content';
import { useTheme } from '../lib/useTheme';

export default function Sidebar() {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const glowRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight || 1);
      setProgress(Math.min(1, Math.max(0, scrolled)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = glowRef.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.parentElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.background = `radial-gradient(180px circle at ${x}px ${y}px, var(--glass-border), transparent 70%)`;
    };
    const parent = el.parentElement;
    parent.addEventListener('pointermove', onMove);
    return () => parent.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <>
      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <span className="serif logo-text">YLH</span>
        <button className="burger" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <i className={`fas ${open ? 'fa-times' : 'fa-bars'}`} />
        </button>
      </div>

      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div ref={glowRef} className="sidebar-glow" aria-hidden="true" />

        <div className="sidebar-top">
          <span className="serif logo-text">Young Legal House</span>
        </div>

        <nav className="sidebar-nav">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className={`sidebar-link ${active ? 'active' : ''}`} onClick={() => setOpen(false)}>
                <span className="sidebar-link-bar" style={{ opacity: active ? 1 : 0 }} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <i className={`fas ${isDark ? 'fa-moon' : 'fa-sun'}`} />
            <span>{isDark ? 'Dark' : 'Light'} mode</span>
          </button>
        </div>

        <div className="scroll-progress-track">
          <div className="scroll-progress-fill" style={{ height: `${progress * 100}%` }} />
        </div>
      </aside>

      <style>{`
        .mobile-topbar {
          display: none;
          position: sticky; top: 0; z-index: 30;
          align-items: center; justify-content: space-between;
          padding: 16px 20px;
          background: var(--bg-color);
          border-bottom: 1px solid var(--glass-border);
        }
        .burger { background: none; border: none; color: var(--text-color); font-size: 1.2rem; cursor: pointer; }

        .sidebar {
          position: fixed; top: 0; left: 0; height: 100vh; width: 240px;
          background: var(--bg-color);
          border-right: 1px solid var(--glass-border);
          display: flex; flex-direction: column;
          z-index: 20; overflow: hidden;
        }
        .sidebar-glow { position: absolute; inset: 0; pointer-events: none; opacity: 0.6; transition: opacity 0.3s; }
        .sidebar-top { padding: 28px 22px 20px; position: relative; z-index: 1; }
        .logo-text { font-size: 1.15rem; font-weight: 700; line-height: 1.2; display: block; }
        .sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 4px; padding: 10px 14px; position: relative; z-index: 1; }
        .sidebar-link {
          position: relative;
          display: flex; align-items: center;
          padding: 10px 14px; border-radius: 10px;
          color: var(--grey-text); text-decoration: none;
          font-size: 0.9rem; font-weight: 600;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .sidebar-link:hover { background: var(--glass-bg); color: var(--text-color); }
        .sidebar-link.active { background: var(--glass-bg); color: var(--text-color); }
        .sidebar-link-bar { position: absolute; left: 0; top: 8px; bottom: 8px; width: 3px; border-radius: 3px; background: var(--text-color); transition: opacity 0.2s; }
        .sidebar-bottom { padding: 16px 22px 24px; position: relative; z-index: 1; }
        .theme-toggle {
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 10px 14px;
          background: var(--glass-bg); border: 1px solid var(--glass-border);
          border-radius: 10px; color: var(--text-color);
          font-size: 0.85rem; font-weight: 600; cursor: pointer;
          font-family: inherit;
        }
        .scroll-progress-track { position: absolute; right: 0; top: 0; width: 3px; height: 100%; background: var(--glass-border); }
        .scroll-progress-fill { width: 100%; background: var(--text-color); transition: height 0.1s linear; }

        @media (max-width: 860px) {
          .mobile-topbar { display: flex; }
          .sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            width: 78vw; max-width: 300px;
          }
          .sidebar-open { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
