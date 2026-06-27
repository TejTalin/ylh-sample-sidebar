'use client';
import PageShell from '../../components/PageShell';
import WordReveal from '../../components/WordReveal';
import HoverPreviewList from '../../components/HoverPreviewList';
import { SAMPLE_BLOGS } from '../../lib/content';

export default function BlogsPage() {
  // HoverPreviewList expects optional `meta` — map author into it
  const items = SAMPLE_BLOGS.map(blog => ({ ...blog, meta: `By ${blog.author}` }));

  return (
    <PageShell>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <WordReveal text="Legal Insights" as="h1" className="serif page-title" style={{ textAlign: 'center' }} />
        <p style={{ color: 'var(--grey-text)', maxWidth: '480px', margin: '0 auto' }}>Peer-written analysis across every major area of law.</p>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <HoverPreviewList items={items} />
      </div>
    </PageShell>
  );
}
