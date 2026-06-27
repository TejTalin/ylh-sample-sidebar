'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * HoverPreviewList
 * A list of rows (e.g. blog posts, firms, projects) separated by thin
 * dividers. Hovering a row reveals a floating preview card that follows
 * the cursor's vertical position — inspired by TEXTURA agency's
 * "Featured Works" list, where hovering a project name pops a live
 * thumbnail near the cursor. Adapted here for YLH's editorial style:
 * no live thumbnail (no screenshots to show), instead a clean preview
 * card with category badge, excerpt, and author — the same idea,
 * applied to content YLH actually has.
 *
 * Props:
 *   items     — array of { title, category, meta, excerpt, image? }
 *   onSelect  — optional click handler, receives the item
 *   className — class for the outer list wrapper
 */
export default function HoverPreviewList({ items, onSelect, className = '' }) {
  const [hovered, setHovered] = useState(null);
  const [cursorY, setCursorY] = useState(0);
  const listRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!listRef.current) return;
    const rect = listRef.current.getBoundingClientRect();
    setCursorY(e.clientY - rect.top);
  };

  return (
    <div
      ref={listRef}
      className={`hover-preview-list ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHovered(null)}
    >
      {items.map((item, i) => (
        <button
          key={item.title}
          className="hover-preview-row"
          onMouseEnter={() => setHovered(i)}
          onClick={() => onSelect?.(item)}
        >
          <span className={`hover-preview-title ${hovered === i ? 'is-active' : ''}`}>
            {item.title}
          </span>
          <span className="hover-preview-arrow">
            <i className="fas fa-arrow-right" />
          </span>
        </button>
      ))}

      <AnimatePresence>
        {hovered !== null && (
          <motion.div
            key={items[hovered].title}
            className="hover-preview-card glass-card"
            initial={{ opacity: 0, scale: 0.94, x: -8 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{ top: cursorY }}
          >
            {items[hovered].image ? (
              <img src={items[hovered].image} alt="" className="hover-preview-image" />
            ) : (
              <div className="hover-preview-image-fallback">
                <i className="fas fa-newspaper" />
              </div>
            )}
            <div className="hover-preview-body">
              <span className="hover-preview-category">{items[hovered].category}</span>
              <p className="hover-preview-excerpt">{items[hovered].excerpt}</p>
              {items[hovered].meta && <span className="hover-preview-meta">{items[hovered].meta}</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .hover-preview-list {
          position: relative;
          border-top: 1px solid var(--glass-border);
        }
        .hover-preview-row {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 22px 4px;
          border: none;
          border-bottom: 1px solid var(--glass-border);
          background: none;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
        }
        .hover-preview-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(1.1rem, 2.4vw, 1.6rem);
          font-weight: 600;
          color: var(--text-color);
          transition: color 0.2s ease, opacity 0.2s ease;
          opacity: 0.55;
        }
        .hover-preview-title.is-active {
          opacity: 1;
        }
        .hover-preview-arrow {
          color: var(--grey-text);
          font-size: 0.85rem;
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .hover-preview-row:hover .hover-preview-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .hover-preview-card {
          position: absolute;
          left: calc(100% + 24px);
          width: 280px;
          transform: translateY(-50%);
          padding: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 5;
          box-shadow: var(--shadow);
        }
        .hover-preview-image {
          width: 100%;
          height: 130px;
          object-fit: cover;
          display: block;
        }
        .hover-preview-image-fallback {
          width: 100%;
          height: 130px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--glass-bg);
          color: var(--grey-text);
          font-size: 1.6rem;
        }
        .hover-preview-body {
          padding: 16px 18px 18px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .hover-preview-category {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--grey-text);
        }
        .hover-preview-excerpt {
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--text-color);
          margin: 0;
        }
        .hover-preview-meta {
          font-size: 0.75rem;
          color: var(--grey-text);
        }

        @media (max-width: 860px) {
          .hover-preview-card { display: none; }
          .hover-preview-title { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
