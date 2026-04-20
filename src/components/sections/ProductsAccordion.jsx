import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { productLines } from '../../data/content';
import { PanelVideo } from '../ui/PanelVideo';

const PANEL_TYPES  = ['thin', 'thick'];
const ACCENTS      = ['#C0392B', '#2980B9'];
const ACCENT_RGBS  = ['192,57,43', '41,128,185'];

export function ProductsAccordion() {
  const [hovered, setHovered] = useState(null);
  const bodyRefs = useRef([]);
  const tweenRef = useRef(null);

  useEffect(() => {
    tweenRef.current?.revert();

    if (hovered !== null) {
      const body = bodyRefs.current[hovered];
      if (!body) return;
      const els = body.querySelectorAll('.acc-stagger');

      tweenRef.current = gsap.context(() =>
        gsap.fromTo(els,
          { y: 24, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.55,
            stagger: 0.09,
            ease: 'power3.out',
            delay: 0.18,
          },
        ),
      );
    }
    return () => tweenRef.current?.revert();
  }, [hovered]);

  return (
    /* No padding-top — flush against marquee above */
    <section className="products-accordion" id="productos">

      {/* Full-width accordion panels — the entire section IS the panels */}
      <div className="pa-panels" role="list">

        {/* Section label floating over both panels */}
        <div className="pa-section-label" aria-hidden="true">
          <span className="t-label">Nuestras Líneas</span>
        </div>

        {productLines.map((line, idx) => {
          const isActive   = hovered === idx;
          const isInactive = hovered !== null && hovered !== idx;
          const accent     = ACCENTS[idx];
          const accentRgb  = ACCENT_RGBS[idx];

          return (
            <div
              key={line.id}
              role="listitem"
              className={[
                'pa-panel',
                `pa-panel--${line.color}`,
                isActive   && 'pa-panel--active',
                isInactive && 'pa-panel--inactive',
              ].filter(Boolean).join(' ')}
              style={{ '--panel-accent': accent, '--panel-rgb': accentRgb }}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setHovered(hovered === idx ? null : idx)}
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setHovered(hovered === idx ? null : idx)}
              aria-expanded={isActive}
              aria-label={`${line.title} — ${line.subtitle}`}
            >
              {/* ── Real video background ── */}
              <PanelVideo type={PANEL_TYPES[idx]} active={isActive} />

              {/* Giant bg number */}
              <div className="pa-panel__num" aria-hidden="true">{line.bgNum}</div>

              {/* Accent edge line */}
              <div className="pa-panel__edge" aria-hidden="true" />

              {/* ── Content ── */}
              <div className="pa-panel__inner">

                {/* Tag */}
                <div className="pa-panel__tag">
                  <span className="pa-panel__tag-dot" />
                  <span className="t-label">{line.tag}</span>
                </div>

                {/* Heading */}
                <div className="pa-panel__heading">
                  <div className="pa-panel__index t-mono">L{idx + 1}</div>
                  <h3 className="pa-panel__title">{line.title}</h3>
                  <p className="pa-panel__sub">{line.subtitle}</p>
                </div>

                {/* Expandable body */}
                <div
                  className="pa-panel__body"
                  ref={el => bodyRefs.current[idx] = el}
                  aria-hidden={!isActive}
                >
                  <p className="pa-panel__desc acc-stagger">{line.description}</p>

                  <ul className="pa-panel__specs">
                    {line.specs.map((s, i) => (
                      <li key={i} className="pa-panel__spec acc-stagger">
                        <span className="pa-panel__spec-mark">—</span>
                        {s.label}
                      </li>
                    ))}
                  </ul>

                  <div className="pa-panel__apps acc-stagger">
                    {line.applications.map(app => (
                      <span key={app} className="pa-panel__app-chip">{app}</span>
                    ))}
                  </div>

                  <Link
                    to={`/productos/${line.slug}`}
                    className="btn btn--outline-light pa-panel__cta acc-stagger"
                    tabIndex={isActive ? 0 : -1}
                  >
                    Ver especificaciones completas
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* Collapse hint */}
                <div className="pa-panel__expand-hint" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
