import { useParams, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2, ChevronRight, Hexagon, Fingerprint } from 'lucide-react';
import { productLines } from '../data/content';
import { CTAStrip } from '../components/sections/CTAStrip';
import { ThreadBuilder } from '../components/sections/ThreadBuilder';
import { usePageSEO } from '../hooks/usePageSEO';
import { fetchProductDynamicBySlug } from '../lib/productDynamicService';
import { useSetLanding } from '../context/LandingContext';

gsap.registerPlugin(ScrollTrigger);

const PRODUCT_SEO = {
  'hilos-delgados': {
    title: 'Hilos Delgados de Poliéster de Alta Tenacidad | Multifilamento Industrial México',
    description: 'Hilo poliéster delgado de alta tenacidad para industria textil, automotriz y calzado. Alta resistencia, precisión y variedad de calibres y colores.',
  },
  'hilos-gruesos': {
    title: 'Hilos Gruesos de Poliéster de Alta Tenacidad | Hilos Industriales para Lona y Cuero',
    description: 'Hilos gruesos industriales de poliéster para tapicería, lona y marroquinería. Alta resistencia, durabilidad y desempeño en aplicaciones exigentes.',
  },
};

/**
 * Match a CMS title to a static product line for swatches/specs/calibers.
 */
function matchStaticProduct(dynamicTitle) {
  const t = (dynamicTitle || '').toLowerCase();
  if (t.includes('grueso') || t.includes('1000')) {
    return productLines.find(p => p.id === 'gruesos');
  }
  return productLines.find(p => p.id === 'delgados');
}

export function ProductDetailPage() {
  const { slug } = useParams();
  const mainRef = useRef(null);

  // 1. Try static product first
  const staticProduct = productLines.find(p => p.slug === slug);

  // 2. If not static, try CMS
  const [dynamic, setDynamic] = useState(null);
  const [loading, setLoading] = useState(!staticProduct); // only load if not static
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (staticProduct) return; // static product found, skip CMS

    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    fetchProductDynamicBySlug(slug).then((data) => {
      if (cancelled) return;
      if (data) {
        setDynamic(data);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [slug, staticProduct]);

  // Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Register CMS data for FloatingWhatsApp (only for dynamic products)
  useSetLanding(dynamic);

  // Determine which product to render and SEO
  const isDynamic = !staticProduct && !!dynamic;
  const product = isDynamic ? matchStaticProduct(dynamic.title) : staticProduct;

  const seoTitle = isDynamic ? dynamic.seoTitle : PRODUCT_SEO[slug]?.title;
  const seoDesc = isDynamic ? dynamic.seoDescription : PRODUCT_SEO[slug]?.description;
  usePageSEO({ title: seoTitle, description: seoDesc });

  // GSAP Animations
  useEffect(() => {
    if (!product || loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.pd-reveal', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' }
      );
      gsap.fromTo('.pd-bento-card',
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: '.pd-specs', start: 'top 80%' }
        }
      );
      gsap.fromTo('.pd-swatch',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.04, ease: 'back.out(1.2)',
          scrollTrigger: { trigger: '.pd-colors', start: 'top 75%' }
        }
      );
    }, mainRef);
    return () => ctx.revert();
  }, [product, loading]);

  // ── Loading (CMS fetch) ────────────────────────────────────────
  if (loading) {
    return (
      <main className="landing-loading">
        <div className="landing-loading__inner">
          <div className="landing-loading__spinner" />
          <p className="landing-loading__text">Cargando producto...</p>
        </div>
      </main>
    );
  }

  // ── 404 ────────────────────────────────────────────────────────
  if (!product || notFound) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 700 }}>
            Línea no encontrada
          </h1>
          <Link to="/" className="btn btn--accent" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
            Ir al inicio
          </Link>
        </div>
      </div>
    );
  }

  const visualTheme = product.id === 'gruesos' ? '#3498DB' : '#E74C3C';

  // ── Resolved display values ────────────────────────────────────
  const displayTitle = isDynamic ? dynamic.title : product.title;
  const displaySubtitle = isDynamic
    ? `${product.subtitle}${dynamic.ciudad ? ` — ${dynamic.ciudad}` : ''}`
    : product.subtitle;
  const displayDesc = isDynamic ? (dynamic.excerpt || product.description) : product.description;
  const ctaWhatsapp = isDynamic ? dynamic.whatsappUrl : null;

  return (
    <div className="pd-wrapper" ref={mainRef}>
      
      {/* HERO */}
      <section className="pd-hero">
        <div className="container pd-hero__inner">
          <div className="pd-hero__content">
            <div className="pd-reveal" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
              <div className="pd-tag">{product.tag}</div>
              <div className="pd-tag-icon">{product.icon}</div>
            </div>
            
            <h1 className="pd-title pd-reveal">{displayTitle}</h1>
            <div className="pd-subtitle pd-reveal">{displaySubtitle}</div>
            
            <p className="pd-desc pd-reveal">{displayDesc}</p>
            
            {/* Aplicaciones */}
            <div className="pd-apps pd-reveal">
              <div className="pd-apps-label">Aplicaciones recomendadas:</div>
              <div className="pd-apps-list">
                {product.applications.map(app => (
                  <span key={app} className="pd-app-pill">{app}</span>
                ))}
              </div>
            </div>

            <div className="pd-actions pd-reveal">
              {ctaWhatsapp ? (
                <a href={ctaWhatsapp} target="_blank" rel="noopener noreferrer"
                   className="btn btn--accent btn--lg pd-btn">
                  Cotizar por WhatsApp
                  <ChevronRight size={20} strokeWidth={2.5} />
                </a>
              ) : (
                <Link to="/contacto" className="btn btn--accent btn--lg pd-btn">
                  Mandar a producir
                  <ChevronRight size={20} strokeWidth={2.5} />
                </Link>
              )}
            </div>
          </div>

          <div className="pd-hero__visual pd-reveal">
            <div className="pd-spool-hero" style={{ '--product-color': visualTheme }}>
              <div className="pd-orbit pd-orbit-1" />
              <div className="pd-orbit pd-orbit-2" />
              <div className="pd-orbit pd-orbit-3" />

              <svg className="pd-spool-svg" viewBox="0 0 200 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="100" cy="248" rx="60" ry="8" fill="rgba(0,0,0,0.12)" />
                <ellipse cx="100" cy="210" rx="72" ry="18" fill="#C8C8C8" />
                <ellipse cx="100" cy="206" rx="72" ry="18" fill="#D8D8D8" />
                <ellipse cx="100" cy="204" rx="66" ry="15" fill="#E8E8E8" />
                <rect x="34" y="58" width="132" height="150" rx="12" fill="url(#threadGrad)" />
                <rect x="34" y="58" width="132" height="150" rx="12" fill="url(#stripePattern)" opacity="0.2"/>
                <ellipse cx="100" cy="62" rx="72" ry="18" fill="#E8E8E8" />
                <ellipse cx="100" cy="58" rx="72" ry="18" fill="#D8D8D8" />
                <ellipse cx="100" cy="56" rx="66" ry="15" fill="#EBEBEB" />
                <ellipse cx="100" cy="56" rx="22" ry="8" fill="#B0B0B0" />
                <ellipse cx="100" cy="55" rx="18" ry="6" fill="#888" />
                <rect x="50" y="70" width="30" height="130" rx="8" fill="white" opacity="0.08" />
                <defs>
                  <linearGradient id="threadGrad" x1="34" y1="58" x2="166" y2="208" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={visualTheme} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={visualTheme} stopOpacity="0.6" />
                  </linearGradient>
                  <pattern id="stripePattern" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="white" strokeWidth="3" />
                  </pattern>
                </defs>
              </svg>

              <div className="pd-floating-metric pd-fm-1">
                <span className="pd-fm-val">100%</span>
                <span className="pd-fm-lbl">Poliéster Alta Tenacidad</span>
              </div>
              <div className="pd-floating-metric pd-fm-2">
                <span className="pd-fm-val">{product.swatches.length}+</span>
                <span className="pd-fm-lbl">Tonos Disponibles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONFIGURADOR */}
      <ThreadBuilder product={product} />

      <CTAStrip />
    </div>
  );
}
