import { useState } from 'react';
import { industries } from '../../data/content';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export function Industries() {
  const [active, setActive] = useState(0);
  const ref = useScrollReveal();

  const ind = industries[active];

  return (
    <section className="section industries" ref={ref}>
      <div className="container">
        <div style={{ marginBottom: '3.5rem' }}>
          <span className="t-label reveal" style={{ color: 'var(--accent)' }}>Sectores</span>
          <h2 className="t-headline reveal delay-1" style={{ marginTop: '0.5rem' }}>
            ¿Para qué industria<br />trabajamos?
          </h2>
        </div>

        <div className="industries__inner">
          {/* Tabs */}
          <nav className="industries__tabs reveal-left delay-1" aria-label="Industrias">
            {industries.map((item, i) => (
              <button
                key={item.id}
                className={`industry-tab ${i === active ? 'industry-tab--active' : ''}`}
                data-num={item.num}
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                data-cursor
              >
                <span className="industry-tab__icon">{item.icon}</span>
                {item.shortName}
              </button>
            ))}
          </nav>

          {/* Panel */}
          <div className="industries__panel reveal delay-2">
            {industries.map((item, i) => (
              <div
                key={item.id}
                className={`industry-bg ${i === active ? 'industry-bg--visible' : 'industry-bg--hidden'}`}
              >
                <div className={`industry-visual ${item.visClass}`}>
                  <div className="industry-vis-pattern" />
                  <div className="industry-vis-num" aria-hidden="true">{item.num}</div>
                </div>
              </div>
            ))}
            <div className="industry-overlay" />

            <div className="industry-content industry-content--active">
              <div className="industry-content__label">
                {ind.lineas.join(' · ')} — Industria {String(active + 1).padStart(2, '0')}/{industries.length}
              </div>
              <h3 className="industry-content__title">{ind.name}</h3>
              <div className="industry-content__apps">
                {ind.applications.map((app) => (
                  <span key={app} className="industry-tag">{app}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
