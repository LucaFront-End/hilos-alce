import { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { industries } from '../../data/content';

/*
 * IndustriesHoverWall v3 — complete rewrite
 *
 * Design language:
 *  • Full-width 2-col intro (label+title / description+stats)
 *  • Giant ultra-THIN row names (weight 300, 5vw+) — the editorial trick
 *  • Dimming: inactive rows drop to 12% opacity
 *  • Each row expands to reveal description + app chips via GSAP height
 *  • Right panel: portrait-ratio sticky image with slide+fade crossfade
 *  • SVG separator lines 0.5px — barely visible until hover fill
 */

const INDUSTRY_IMAGES = {
  textil:        'https://images.pexels.com/photos/32048354/pexels-photo-32048354.jpeg?auto=compress&cs=tinysrgb&w=1200',
  automotriz:    'https://images.pexels.com/photos/32845696/pexels-photo-32845696.jpeg?auto=compress&cs=tinysrgb&w=1200',
  calzado:       'https://images.pexels.com/photos/5894225/pexels-photo-5894225.jpeg?auto=compress&cs=tinysrgb&w=1200',
  tapiceria:     'https://images.pexels.com/photos/31047158/pexels-photo-31047158.jpeg?auto=compress&cs=tinysrgb&w=1200',
  lonas:         'https://images.pexels.com/photos/30902519/pexels-photo-30902519.jpeg?auto=compress&cs=tinysrgb&w=1200',
  marroquineria: 'https://images.pexels.com/photos/5963173/pexels-photo-5963173.jpeg?auto=compress&cs=tinysrgb&w=1200',
};

export function IndustriesHoverWall() {
  const [hovered, setHovered] = useState(null);
  const [active,  setActive]  = useState(0);
  const bodyRefs  = useRef({});
  const tweenRef  = useRef(null);

  /* Animate the expanded body of the hovered row */
  const revealBody = useCallback((idx) => {
    tweenRef.current?.revert();
    const el = bodyRefs.current[idx];
    if (!el) return;
    tweenRef.current = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('.ihw-appear'),
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power3.out', delay: 0.08 },
      );
    });
  }, []);

  const enter = useCallback((idx) => {
    setHovered(idx);
    setActive(idx);
    revealBody(idx);
  }, [revealBody]);

  const leave = useCallback(() => setHovered(null), []);

  /* Preload images */
  useEffect(() => {
    industries.forEach(ind => {
      const img = new Image();
      img.src = INDUSTRY_IMAGES[ind.id];
    });
  }, []);

  const displayIdx = hovered !== null ? hovered : active;

  return (
    <section className="section ihw" id="industrias">

      {/* ── TOP INTRO ── full-width, 2 columns ── */}
      <div className="container">
        <div className="ihw-intro">

          <div className="ihw-intro__left">
            <span className="ihw-intro__eyebrow">
              <span className="ihw-intro__eyebrow-line" />
              Sectores de aplicación
            </span>
            <h2 className="ihw-intro__title">
              Cada industria<br />
              <em>tiene su hilo.</em>
            </h2>
          </div>

          <div className="ihw-intro__right">
            <p className="ihw-intro__desc">
              Hilos de alta tenacidad fabricados para responder a las exigencias más críticas
              de cada sector — desde la costura técnica hasta la manufactura de alta carga.
            </p>
            <div className="ihw-intro__stats">
              <div className="ihw-intro__stat">
                <span className="ihw-intro__stat-num">6</span>
                <span className="ihw-intro__stat-lbl">Sectores</span>
              </div>
              <div className="ihw-intro__stat-div" />
              <div className="ihw-intro__stat">
                <span className="ihw-intro__stat-num">2</span>
                <span className="ihw-intro__stat-lbl">Líneas</span>
              </div>
              <div className="ihw-intro__stat-div" />
              <div className="ihw-intro__stat">
                <span className="ihw-intro__stat-num">+30</span>
                <span className="ihw-intro__stat-lbl">Colores</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── LIST + IMAGE ── */}
      <div className="ihw-body">

        {/* Left — hover list */}
        <div className="ihw-list" role="list">

          {/* Top rule */}
          <div className="ihw-rule" aria-hidden="true" />

          {industries.map((ind, idx) => {
            const isActive = hovered === idx;
            const isDim    = hovered !== null && hovered !== idx;

            return (
              <div
                key={ind.id}
                role="listitem"
                className={[
                  'ihw-row',
                  isActive && 'ihw-row--active',
                  isDim    && 'ihw-row--dim',
                ].filter(Boolean).join(' ')}
                onMouseEnter={() => enter(idx)}
                onMouseLeave={leave}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && enter(idx)}
                aria-expanded={isActive}
                aria-label={ind.name}
              >
                {/* Top border fill on hover */}
                <div className="ihw-row__fill" aria-hidden="true" />

                {/* Main row line */}
                <div className="ihw-row__main">
                  {/* Index */}
                  <span className="ihw-row__idx" aria-hidden="true">{ind.num}</span>

                  {/* Name — the big editorial element */}
                  <h3 className="ihw-row__name">{ind.name}</h3>

                  {/* Right side: lineas badge + arrow */}
                  <div className="ihw-row__right">
                    <div className="ihw-row__lineas">
                      {ind.lineas.map(l => (
                        <span key={l} className="ihw-dot-badge">
                          {l === 'Delgados' ? 'L1' : 'L2'}
                        </span>
                      ))}
                    </div>
                    <svg className="ihw-row__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Expandable description */}
                <div
                  className={`ihw-row__body ${isActive ? 'ihw-row__body--open' : ''}`}
                  ref={el => bodyRefs.current[idx] = el}
                  aria-hidden={!isActive}
                >
                  <p className="ihw-row__desc ihw-appear">{ind.description}</p>
                  <div className="ihw-row__apps ihw-appear">
                    {ind.applications.map(a => (
                      <span key={a} className="ihw-app-tag">{a}</span>
                    ))}
                  </div>
                </div>

                {/* Bottom rule */}
                <div className="ihw-rule" aria-hidden="true" />
              </div>
            );
          })}
        </div>

        {/* Right — sticky image */}
        <div className="ihw-preview-wrap" aria-hidden="true">
          <div className="ihw-preview">

            {industries.map((ind, idx) => (
              <figure
                key={ind.id}
                className={`ihw-fig ${displayIdx === idx ? 'ihw-fig--show' : ''}`}
              >
                <img
                  src={INDUSTRY_IMAGES[ind.id]}
                  alt={ind.name}
                  className="ihw-fig__img"
                  loading="lazy"
                />
                <figcaption className="ihw-fig__cap">
                  <span className="ihw-fig__cap-num">{ind.num}</span>
                  <span className="ihw-fig__cap-name">{ind.name}</span>
                </figcaption>
              </figure>
            ))}

            {/* Progress indicator */}
            <div className="ihw-progress">
              <div
                className="ihw-progress__bar"
                style={{ transform: `scaleY(${(displayIdx + 1) / industries.length})` }}
              />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
