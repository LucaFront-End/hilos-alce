import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './index.css';

import { Navbar }            from './components/layout/Navbar';
import { Footer }            from './components/layout/Footer';
import { ScrollProgress }    from './components/ui/ScrollProgress';
import { FloatingWhatsApp }  from './components/ui/FloatingWhatsApp';
import { useCustomCursor }   from './hooks/useCustomCursor';

import { HomePage }          from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { IndustriesPage }    from './pages/IndustriesPage';
import { AboutPage }         from './pages/AboutPage';
import { ContactPage }       from './pages/ContactPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppContent() {
  useCustomCursor();

  return (
    <>
      {/* Custom cursor */}
      <div className="cursor-dot" aria-hidden="true" />
      <div className="cursor-ring" aria-hidden="true" />

      <ScrollProgress />
      <Navbar />
      <ScrollToTop />

      <Routes>
        <Route path="/"                        element={<HomePage />} />
        <Route path="/productos/:slug"         element={<ProductDetailPage />} />
        <Route path="/industrias"              element={<IndustriesPage />} />
        <Route path="/nosotros"                element={<AboutPage />} />
        <Route path="/contacto"                element={<ContactPage />} />
        {/* Fallback */}
        <Route path="*" element={<HomePage />} />
      </Routes>

      <FloatingWhatsApp />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
