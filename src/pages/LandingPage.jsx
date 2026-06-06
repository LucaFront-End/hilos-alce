// src/pages/LandingPage.jsx
// Dynamic landing page — same sections as HomePage but fed with Wix CMS data
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { fetchLandingBySlug } from '../lib/landingService';
import { useSetLanding }       from '../context/LandingContext';
import { usePageSEO }          from '../hooks/usePageSEO';

import { Hero }                from '../components/sections/Hero';
import { MarqueeBand }         from '../components/sections/MarqueeBand';
import { ProductsAccordion }   from '../components/sections/ProductsAccordion';
import { IndustriesHoverWall } from '../components/sections/IndustriesHoverWall';
import { TechSpecs }           from '../components/sections/TechSpecs';
import { About }               from '../components/sections/About';
import { CTAStrip }            from '../components/sections/CTAStrip';
import { ContactSection }      from '../components/sections/Contact';

// Known static routes — if the slug matches one of these, skip the CMS lookup
const STATIC_ROUTES = new Set([
  'productos', 'industrias', 'nosotros', 'contacto', 'gracias',
]);

function LandingLoader() {
  return (
    <main className="landing-loading">
      <div className="landing-loading__inner">
        <div className="landing-loading__spinner" />
        <p className="landing-loading__text">Cargando...</p>
      </div>
    </main>
  );
}

export function LandingPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [landing, setLanding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // If the slug is a known static route, let React Router handle it
  useEffect(() => {
    if (STATIC_ROUTES.has(slug)) {
      navigate(`/${slug}`, { replace: true });
      return;
    }

    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    fetchLandingBySlug(slug).then((data) => {
      if (cancelled) return;
      if (data) {
        setLanding(data);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [slug, navigate]);

  // SEO — set title & description from CMS data
  usePageSEO({
    title: landing?.seoTitle || '',
    description: landing?.seoDescription || '',
  });

  // Register CMS data into global context (for FloatingWhatsApp, etc.)
  useSetLanding(landing);

  // ── Loading state ──────────────────────────────────────────────
  if (loading) return <LandingLoader />;

  // ── 404 — slug not found in CMS ───────────────────────────────
  if (notFound) {
    return (
      <main className="landing-404">
        <div className="container" style={{ textAlign: 'center', padding: '8rem 1rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 800, marginBottom: '1rem' }}>
            404
          </h1>
          <p style={{ color: 'var(--ink-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>
            La página que buscas no existe.
          </p>
          <a href="/" className="btn btn--accent btn--lg">
            Ir al inicio
          </a>
        </div>
      </main>
    );
  }

  // ── Render — same sections as Home, with CMS overrides via context ─
  return (
    <main>
      <Hero />
      <MarqueeBand />
      <ProductsAccordion />
      <IndustriesHoverWall />
      <TechSpecs />
      <About />
      <CTAStrip />
      <ContactSection />
    </main>
  );
}
