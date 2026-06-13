import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './index.css';

import { Navbar }            from './components/layout/Navbar';
import { Footer }            from './components/layout/Footer';
import { ScrollProgress }    from './components/ui/ScrollProgress';
import { FloatingWhatsApp }  from './components/ui/FloatingWhatsApp';
import { useCustomCursor }   from './hooks/useCustomCursor';
import { LandingProvider }   from './context/LandingContext';

import { HomePage }              from './pages/HomePage';
import { ProductDetailPage }     from './pages/ProductDetailPage';
import { IndustriesPage }        from './pages/IndustriesPage';
import { AboutPage }             from './pages/AboutPage';
import { ContactPage }           from './pages/ContactPage';
import { ThankYouPage }          from './pages/ThankYouPage';
import { LandingPage }           from './pages/LandingPage';
import { ZonesPage }             from './pages/ZonesPage';

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
        <Route path="/"                                element={<HomePage />} />
        <Route path="/productos/:slug"                 element={<ProductDetailPage />} />
        <Route path="/industrias"                      element={<IndustriesPage />} />
        <Route path="/nosotros"                        element={<AboutPage />} />
        <Route path="/contacto"                        element={<ContactPage />} />
        <Route path="/gracias"                         element={<ThankYouPage />} />
        <Route path="/zonas"                           element={<ZonesPage />} />
        {/* Dynamic CMS landings */}
        <Route path="/:slug"                           element={<LandingPage />} />
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
      <LandingProvider>
        <AppContent />
      </LandingProvider>
    </BrowserRouter>
  );
}
