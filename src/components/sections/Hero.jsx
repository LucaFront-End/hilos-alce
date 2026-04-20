import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { heroContent, siteMeta } from '../../data/content';
import { ThreadCanvas } from '../ui/ThreadCanvas';

const waLink = `https://wa.me/${siteMeta.whatsapp}?text=${encodeURIComponent('Hola, quiero cotizar hilos Alce.')}`;

const titleLine1 = ['Hilos', 'de'];
const titleLine2 = ['Alta', 'Tenacidad'];

export function Hero() {
  const sectionRef  = useRef(null);
  const mousePosRef = useRef({ x: -9999, y: -9999 });
  const eyebrowRef  = useRef(null);
  const line1Ref    = useRef(null);
  const line2Ref    = useRef(null);
  const subtitleRef = useRef(null);
  const actionsRef  = useRef(null);
  const statsRef    = useRef(null);
  const labelRef    = useRef(null);
  const scrollRef   = useRef(null);

  // ── GSAP entrance timeline ────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.3 });

      tl.from(eyebrowRef.current, {
        y: -18, opacity: 0, duration: 0.5, ease: 'power3.out',
      });

      tl.from(line1Ref.current.querySelectorAll('.hero-word'), {
        y: '115%', opacity: 0, duration: 0.8, stagger: 0.09,
      }, '-=0.2');

      tl.from(line2Ref.current.querySelectorAll('.hero-word'), {
        y: '115%', opacity: 0, duration: 0.8, stagger: 0.1,
      }, '-=0.55');

      tl.from(subtitleRef.current, {
        y: 20, opacity: 0, duration: 0.6, ease: 'power3.out',
      }, '-=0.4');

      tl.from(actionsRef.current.children, {
        y: 16, opacity: 0, duration: 0.5, stagger: 0.1,
      }, '-=0.38');

      tl.from(statsRef.current.children, {
        x: -22, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
      }, '-=0.32');

      tl.to(labelRef.current, { opacity: 1, duration: 0.6 }, '-=0.2');
      tl.from(scrollRef.current, { opacity: 0, y: 10, duration: 0.5 }, '-=0.3');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── Mouse tracking via ref (zero re-renders) ──────────────────
  const onMouseMove = (e) => {
    const r = sectionRef.current.getBoundingClientRect();
    mousePosRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const onMouseLeave = () => { mousePosRef.current = { x: -9999, y: -9999 }; };

  return (
    <section
      className="hero"
      ref={sectionRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* 1 · Watermark */}
      <div className="hero__watermark" aria-hidden="true">ALCE</div>

      {/* 2 · Thread canvas — full hero background */}
      <div className="hero__canvas">
        <ThreadCanvas mousePosRef={mousePosRef} />
      </div>

      {/* 3 · Soft halo only behind text column (no harsh gradient) */}
      <div className="hero__text-halo" aria-hidden="true" />

      {/* 4 · Content */}
      <div className="container hero__content">

        <div className="hero__left">

          {/* Eyebrow */}
          <div className="hero__eyebrow" ref={eyebrowRef}>
            <span className="hero__eyebrow-dot" />
            <span className="t-label" style={{ color: 'var(--accent)', fontSize: '0.68rem' }}>
              {heroContent.eyebrow}
            </span>
          </div>

          {/* Title — words individually wrapped for GSAP clip-reveal */}
          <h1 className="hero__title" aria-label="Hilos de Alta Tenacidad">
            <span ref={line1Ref} className="hero__title-line">
              {titleLine1.map((w) => (
                <span key={w} className="hero-word-wrap">
                  <span className="hero-word hero__title-main">{w}</span>
                </span>
              ))}
            </span>
            <span ref={line2Ref} className="hero__title-line">
              {titleLine2.map((w) => (
                <span key={w} className="hero-word-wrap">
                  <span className="hero-word hero__title-em">{w}</span>
                </span>
              ))}
            </span>
          </h1>

          <p className="hero__subtitle" ref={subtitleRef}>{heroContent.subtitle}</p>

          <div className="hero__actions" ref={actionsRef}>
            <Link to="/contacto" className="btn btn--accent btn--lg">
              {heroContent.ctaPrimary}
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn--outline btn--lg">
              {heroContent.ctaSecondary}
            </a>
          </div>

          <div className="hero__stats" ref={statsRef}>
            {heroContent.stats.map((s) => (
              <div key={s.label}>
                <div className="hero__stat-num">{s.num}</div>
                <div className="hero__stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — empty, canvas is the visual */}
        <div className="hero__right" />
      </div>

      {/* Interaction hint — bottom right */}
      <div className="hero__interact-label" ref={labelRef} aria-hidden="true">
        <span className="hero__interact-pulse" />
        Mueve el cursor
      </div>

      {/* Scroll hint — bottom center */}
      <div className="hero__scroll-hint" ref={scrollRef} aria-label="Desplázate">
        <div className="hero__scroll-mouse">
          <div className="hero__scroll-dot" />
        </div>
        <span className="hero__scroll-text">Scroll</span>
      </div>
    </section>
  );
}
