import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { usePageSEO } from '../hooks/usePageSEO';
import { fetchAllLandings } from '../lib/landingService';
import './ZonesPage.css';

/* ══════════════════════════════════════════════
   ZONES PAGE — SEO hub listing all CMS landing
   pages as a repeater card grid.
   Not linked in the main menu — exists for SEO
   internal-linking so Google discovers each
   dynamic landing page from a real page.
   Linked from the Footer.
   ══════════════════════════════════════════════ */

/* ── SVG icons ── */
const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.33 0-4.502-.753-6.258-2.032l-.438-.328-3.205 1.074 1.074-3.205-.328-.438A9.935 9.935 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
  </svg>
);

export function ZonesPage() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const pageRef = useRef(null);

  usePageSEO({
    title: 'Zonas de Servicio | Hilos Alce — Fábrica de Hilos Industriales',
    description: 'Hilos Alce ofrece servicio de hilos industriales de alta tenacidad en todo México. Encuentra tu zona y cotiza tu pedido.',
  });

  /* Fetch landing pages from CMS */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await fetchAllLandings();
        if (!cancelled) setPages(data);
      } catch (err) {
        console.warn('[Zones] Failed to load landing pages:', err.message);
      }
      if (!cancelled) setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  /* Scroll-reveal */
  useEffect(() => {
    if (loading || !pageRef.current) return;
    const timeouts = [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            const staggered = entry.target.querySelectorAll('.zi-stagger');
            staggered.forEach((el, i) => {
              const t = setTimeout(() => el.classList.add('revealed'), i * 80);
              timeouts.push(t);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );
    pageRef.current.querySelectorAll('.zi-reveal').forEach((el) => observer.observe(el));
    return () => { observer.disconnect(); timeouts.forEach(clearTimeout); };
  }, [loading]);

  return (
    <div className="zones-index-page" ref={pageRef}>

      {/* ═══ HERO ═══ */}
      <section className="zi-hero">
        <div className="container zi-hero-inner zi-reveal">
          <span className="zi-hero-label zi-stagger">Zonas de servicio</span>
          <h1 className="zi-hero-title zi-stagger">
            Hilos industriales en <em>tu zona</em>
          </h1>
          <p className="zi-hero-sub zi-stagger">
            Fabricamos y distribuimos hilos industriales de alta tenacidad en todo México.
            Encuentra tu zona y cotiza tu pedido sin compromiso.
          </p>
        </div>
      </section>

      {/* ═══ CARDS GRID ═══ */}
      <section className="zi-grid-section">
        <div className="container">

          {loading ? (
            <div className="zi-loading">
              <div className="zi-spinner" />
            </div>
          ) : pages.length === 0 ? (
            <div className="zi-empty zi-reveal">
              <div className="zi-empty-icon">📍</div>
              <p>No hay zonas disponibles en este momento.</p>
            </div>
          ) : (
            <>
              <div className="zi-grid-header zi-reveal">
                <span className="zi-grid-count">
                  <strong>{pages.length}</strong> zonas de servicio disponibles
                </span>
              </div>

              <div className="zi-cards zi-reveal">
                {pages.map((page, i) => (
                  <div
                    className="zi-card zi-stagger"
                    key={page.id || page.slug}
                    style={{ transitionDelay: `${i * 0.06}s` }}
                  >
                    {/* Header */}
                    <div className="zi-card-header">
                      <div className="zi-card-icon">
                        <MapPinIcon />
                      </div>
                      <div>
                        <h2 className="zi-card-zona">{page.ciudad || page.titulo}</h2>
                        <span className="zi-card-title">{page.titulo}</span>
                      </div>
                    </div>

                    {/* Excerpt */}
                    {page.excerpt && (
                      <p className="zi-card-excerpt">{page.excerpt}</p>
                    )}

                    {/* Actions */}
                    <div className="zi-card-actions">
                      <Link
                        to={`/${page.slug}`}
                        className="zi-btn zi-btn--page"
                      >
                        <ArrowRightIcon />
                        Ver zona
                      </Link>
                      {page.whatsappUrl && (
                        <a
                          href={page.whatsappUrl}
                          className="zi-btn zi-btn--wa"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <WhatsAppIcon />
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </section>
    </div>
  );
}
