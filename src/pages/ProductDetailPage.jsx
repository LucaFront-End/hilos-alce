import { useParams, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2, ChevronRight, Hexagon, Fingerprint } from 'lucide-react';
import { productLines } from '../data/content';
import { CTAStrip } from '../components/sections/CTAStrip';
import { ThreadBuilder } from '../components/sections/ThreadBuilder';

gsap.registerPlugin(ScrollTrigger);

export function ProductDetailPage() {
  const { slug } = useParams();
  const product = productLines.find(p => p.slug === slug);
  const [activeColor, setActiveColor] = useState('transparent');
  const mainRef = useRef(null);

  // Forza el scroll al inicio en montar componente
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Hook GSAP Animaciones
  useEffect(() => {
    if (!product) return;
    const ctx = gsap.context(() => {
      
      // 1. Hero Reveal Texts
      gsap.fromTo('.pd-reveal', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out' }
      );

      // 2. Bento Cards staggered fade-in
      gsap.fromTo('.pd-bento-card',
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: '.pd-specs', start: 'top 80%' }
        }
      );

      // 3. Swatches cascade
      gsap.fromTo('.pd-swatch',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.04, ease: 'back.out(1.2)',
          scrollTrigger: { trigger: '.pd-colors', start: 'top 75%' }
        }
      );

    }, mainRef);
    return () => ctx.revert();
  }, [product]);

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 700 }}>
            Línea no encontrada
          </h1>
          <Link to="/productos" className="btn btn--accent" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  // Base hue for visual effects based on product identifier
  const visualTheme = product.id === 'gruesos' ? '#3498DB' : '#E74C3C';

  return (
    <div className="pd-wrapper" ref={mainRef}>
      
      {/* =========================================
          FASE 1: HERO CINEMÁTICO
          ========================================= */}
      <section className="pd-hero">
        <div className="container pd-hero__inner">
          <div className="pd-hero__content">
            <div className="pd-reveal" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
              <div className="pd-tag">{product.tag}</div>
              <div className="pd-tag-icon">{product.icon}</div>
            </div>
            
            <h1 className="pd-title pd-reveal">{product.title}</h1>
            <div className="pd-subtitle pd-reveal">{product.subtitle}</div>
            
            <p className="pd-desc pd-reveal">{product.description}</p>
            
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
              <Link to="/contacto" className="btn btn--accent btn--lg pd-btn">
                Mandar a producir
                <ChevronRight size={20} strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          <div className="pd-hero__visual pd-reveal">
            {/* Fotografía de alta resolución enmarcada estilo editorial */}
            <div className="pd-photo-frame">
              <img 
                src={product.id === 'gruesos' 
                  ? 'https://images.unsplash.com/photo-1605374465905-24ce50ea6433?auto=format&fit=crop&q=80&w=800' 
                  : 'https://images.unsplash.com/photo-1598048145816-1698ebccedef?auto=format&fit=crop&q=80&w=800'} 
                alt={`Detalle de ${product.title}`}
                className="pd-photo-img"
              />
              <div className="pd-photo-overlay" />
              
              {/* Tarjetas flotantes sobre la foto para darle "vida" y métricas */}
              <div className="pd-floating-metric pd-fm-1">
                <span className="pd-fm-val">100%</span>
                <span className="pd-fm-lbl">Poliéster Alta Tenacidad</span>
              </div>
              <div className="pd-floating-metric pd-fm-2">
                <span className="pd-fm-val">+30</span>
                <span className="pd-fm-lbl">Tonos Formulados</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          FASE 2: CONFIGURADOR DINÁMICO
          ========================================= */}
      <ThreadBuilder product={product} />

      <CTAStrip />
    </div>
  );
}
