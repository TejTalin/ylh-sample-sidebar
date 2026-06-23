'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageShell from '../components/PageShell';
import WordReveal from '../components/WordReveal';
import Ticker from '../components/Ticker';
import { fadeUp, staggerContainer, staggerItem, VIEW } from '../lib/motion';
import { OFFER_CARDS, LAW_AREAS } from '../lib/content';

export default function HomePage() {
  return (
    <PageShell>
      {/* EDITORIAL HERO — oversized, left-bled, asymmetric */}
      <motion.section
        className="editorial-hero"
        variants={staggerContainer(0.12, 0.05)} initial="hidden" whileInView="visible" viewport={VIEW}
      >
        <motion.p variants={fadeUp} className="eyebrow eyebrow-left">India&apos;s Legal Student Community</motion.p>
        <WordReveal text="Young Legal House" as="h1" className="serif editorial-title" />
        <div className="editorial-hero-row">
          <motion.p variants={fadeUp} className="editorial-lede">
            A community bridging the gap between legal theory and execution. We connect aspiring legal professionals with knowledge, competitions, events, and a network that takes law seriously.
          </motion.p>
          <motion.div variants={fadeUp} className="editorial-hero-actions">
            <Link href="/join" className="pill pill-solid">Join the Community</Link>
            <Link href="/blogs" className="pill pill-ghost">Read Legal Insights</Link>
          </motion.div>
        </div>
      </motion.section>

      <motion.div initial="hidden" whileInView="visible" viewport={VIEW} variants={fadeUp} className="editorial-ticker-wrap">
        <Ticker text="🔴 FLAGSHIP EVENT — LEX NOCTIS · CRIMINAL LAW TRIVIA · 15 JUNE 2026 · REGISTRATIONS NOW OPEN · CLICK TO REGISTER" />
      </motion.div>

      {/* OFFER — staggered offset rows, not a uniform grid */}
      <motion.section initial="hidden" whileInView="visible" viewport={VIEW} className="editorial-offer">
        <p className="eyebrow">01 — What We Offer</p>
        <WordReveal text="Everything a law student needs" as="h2" className="serif editorial-section-title" />
        <motion.div className="editorial-offer-list" variants={staggerContainer(0.1, 0.05)} initial="hidden" whileInView="visible" viewport={VIEW}>
          {OFFER_CARDS.map((item, i) => (
            <motion.div key={item.title} variants={staggerItem} className={`editorial-offer-row offer-offset-${i % 2}`}>
              <span className="offer-num">0{i + 1}</span>
              <div className="offer-body">
                <i className={`fas ${item.icon}`} />
                <h3 className="serif">{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* LEGAL INSIGHTS — vertical stacked tag rail instead of centered pills */}
      <motion.section initial="hidden" whileInView="visible" viewport={VIEW} className="editorial-tags-section">
        <p className="eyebrow">02 — Legal Insights</p>
        <WordReveal text="Every domain, covered" as="h2" className="serif editorial-section-title" />
        <motion.div className="editorial-tag-rail" variants={staggerContainer(0.04, 0.1)} initial="hidden" whileInView="visible" viewport={VIEW}>
          {LAW_AREAS.map((area, i) => (
            <motion.div key={area} variants={staggerItem} style={{ marginLeft: `${(i % 3) * 18}px` }}>
              <Link href="/blogs" className="tag-pill-large">{area}</Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* CTA — full-bleed offset banner */}
      <motion.section initial="hidden" whileInView="visible" viewport={VIEW} variants={fadeUp} className="editorial-cta">
        <div className="editorial-cta-inner glass-card">
          <p className="eyebrow">03 — Join Us</p>
          <WordReveal text="Be Part of the Movement" as="h2" className="serif editorial-section-title" />
          <p className="editorial-cta-text">Join law students across India building their careers through YLH.</p>
          <div className="editorial-cta-actions">
            <Link href="/join" className="pill pill-solid">Join the Community</Link>
            <Link href="/contact" className="pill pill-ghost">Get in Touch</Link>
          </div>
        </div>
      </motion.section>

      <style>{`
        .editorial-hero { padding: 32px 0 56px; }
        .eyebrow { font-size: 0.76rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--grey-text); margin-bottom: 16px; }
        .eyebrow-left { text-align: left; }
        .editorial-title { font-size: clamp(3rem, 9vw, 7.5rem); font-weight: 700; line-height: 0.96; margin: 0 0 36px; letter-spacing: -0.02em; }
        .editorial-hero-row { display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 48px; align-items: end; }
        .editorial-lede { color: var(--grey-text); font-size: clamp(1.05rem, 2vw, 1.3rem); line-height: 1.7; max-width: 560px; }
        .editorial-hero-actions { display: flex; flex-direction: column; gap: 10px; align-items: flex-start; }

        .editorial-ticker-wrap { margin: 0 0 72px; }

        .editorial-offer { margin-bottom: 80px; }
        .editorial-section-title { font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 700; margin-bottom: 40px; max-width: 700px; }
        .editorial-offer-list { display: flex; flex-direction: column; gap: 0; border-top: 1px solid var(--glass-border); }
        .editorial-offer-row {
          display: grid; grid-template-columns: 80px 1fr;
          padding: 36px 0; border-bottom: 1px solid var(--glass-border);
          gap: 24px;
        }
        .offer-offset-1 { padding-left: 8%; }
        .offer-num { font-family: 'Cormorant Garamond', serif; font-size: 2.4rem; color: var(--grey-text); opacity: 0.5; font-weight: 700; }
        .offer-body i { font-size: 1.2rem; margin-bottom: 10px; display: block; }
        .offer-body h3 { font-size: 1.5rem; margin-bottom: 10px; }
        .offer-body p { color: var(--grey-text); font-size: 0.95rem; line-height: 1.75; max-width: 580px; }

        .editorial-tags-section { margin-bottom: 80px; }
        .editorial-tag-rail { display: flex; flex-direction: column; gap: 14px; align-items: flex-start; max-width: 600px; }
        .tag-pill-large { display: inline-block; padding: 11px 22px; border: 1px solid var(--glass-border); border-radius: 999px; font-size: 0.95rem; font-weight: 600; color: var(--text-color); background: var(--glass-bg); text-decoration: none; }

        .editorial-cta { margin: 0 -24px; }
        .editorial-cta-inner { padding: 64px 48px; text-align: left; max-width: 760px; margin: 0 8%; }
        .editorial-cta-text { color: var(--grey-text); line-height: 1.8; margin: 0 0 28px; max-width: 460px; }
        .editorial-cta-actions { display: flex; gap: 12px; flex-wrap: wrap; }

        @media (max-width: 760px) {
          .editorial-hero-row { grid-template-columns: 1fr; gap: 24px; align-items: start; }
          .offer-offset-1 { padding-left: 0; }
          .editorial-cta { margin: 0; }
          .editorial-cta-inner { margin: 0; padding: 40px 28px; }
        }
      `}</style>
    </PageShell>
  );
}
