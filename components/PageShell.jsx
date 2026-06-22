import Sidebar from './Sidebar';
import Footer from './Footer';
import NetworkBackground from './NetworkBackground';

export default function PageShell({ children }) {
  return (
    <>
      <NetworkBackground />
      <Sidebar />
      <main className="page-main">
        <div className="container" style={{ paddingTop: '56px', paddingBottom: '90px' }}>
          {children}
        </div>
        <Footer />
      </main>

      <style>{`
        .page-main { margin-left: 240px; min-height: 100vh; }
        @media (max-width: 860px) { .page-main { margin-left: 0; } }
      `}</style>
    </>
  );
}
