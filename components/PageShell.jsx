import Sidebar from './Sidebar';
import Footer from './Footer';
import NetworkBackground from './NetworkBackground';

export default function PageShell({ children }) {
  return (
    <div className="page-root">
      <NetworkBackground />
      <Sidebar />
      <main className="page-main">
        <div className="container" style={{ paddingTop: '56px', paddingBottom: '90px' }}>
          {children}
        </div>
        <Footer />
      </main>

      <style>{`
        .page-root { position: relative; min-height: 100vh; }
        .page-main { margin-left: 240px; min-height: 100vh; position: relative; z-index: 1; }
        @media (max-width: 860px) { .page-main { margin-left: 0; } }
      `}</style>
    </div>
  );
}
