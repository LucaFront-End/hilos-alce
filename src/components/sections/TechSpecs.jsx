import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { techSpecs } from '../../data/content';

gsap.registerPlugin(ScrollTrigger);

export function TechSpecs() {
  const containerRef = useRef(null);
  const numRefs = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 65%',
          toggleActions: 'play none none none',
        },
      });

      // 1. Reveal header
      tl.fromTo(
        '.ts-header',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );

      // 2. Bento cards stagger
      tl.fromTo(
        '.ts-card',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'back.out(1.2)' },
        '-=0.4'
      );

      // 3. Count up numeric values
      numRefs.current.forEach((el) => {
        if (!el) return;
        const targetVal = el.dataset.val;
        // Solo animar si es numérico (ej. "100" o "12")
        const isNumeric = /^\d+$/.test(targetVal);
        
        if (isNumeric) {
          gsap.fromTo(
            el,
            { innerText: 0 },
            {
              innerText: targetVal,
              duration: 1.5,
              ease: 'power2.out',
              snap: { innerText: 1 },
            }
          );
        } else {
          // Si es "UV+" o "< 0.2", hacemos un glitch text / scramble simple
          gsap.fromTo(
            el,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' }
          );
        }
      });

      // 4. Tables stagger
      tl.fromTo(
        '.ts-table',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' },
        '-=0.8'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section ts-sec" ref={containerRef} id="especificaciones">
      {/* Dynamic Background */}
      <div className="ts-bg-grid" aria-hidden="true" />
      <div className="ts-bg-glow" aria-hidden="true" />

      <div className="container ts-inner">
        {/* Header */}
        <div className="ts-header">
          <div className="ts-header__badge">
            <span className="ts-pulse-dot" /> Telemetría
          </div>
          <h2 className="ts-header__title">
            Ingeniería en<br />cada fibra.
          </h2>
        </div>

        {/* ── Bento Box Grid for Properties ── */}
        <div className="ts-props-grid">
          {techSpecs.props.map((p, i) => {
            // Extraer números para animar
            const numMatch = p.val.match(/^(\d+)(.*)/);
            // Casos especiales como "12-22" los dejamos string por simplicidad,
            // pero si es "100", animará de 0 a 100.
            const dataVal = p.val === '100%' ? '100' : p.val;
            const suffix = p.val === '100%' ? '%' : '';

            return (
              <div key={i} className="ts-card">
                <div className="ts-card__top">
                  <div className="ts-card__num-wrap">
                    <span
                      className="ts-card__num"
                      ref={(el) => (numRefs.current[i] = el)}
                      data-val={dataVal}
                    >
                      {dataVal}
                    </span>
                    <span className="ts-card__unit">{suffix || p.unit}</span>
                  </div>
                </div>
                <div className="ts-card__bottom">
                  <h3 className="ts-card__label">{p.label}</h3>
                  <p className="ts-card__desc">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Matrices de Manufactura ── */}
        <div className="ts-tables-grid">
          {techSpecs.tables.map((table, ti) => (
            <div key={ti} className="ts-table">
              {/* Header de tabla holográfico */}
              <div className="ts-table__head">
                <div className="ts-table__head-info">
                  <span className="ts-table__badge">{table.badge}</span>
                  <h4 className="ts-table__title">{table.title}</h4>
                </div>
                <span className="ts-table__meta">Calibres vs Presentación</span>
              </div>

              {/* Filas */}
              <div className="ts-table__body">
                {table.rows.map((row, ri) => (
                  <div key={ri} className="ts-trow">
                    <div className="ts-trow__caliber">{row.caliber}</div>
                    <div className="ts-trow__presets">
                      {row.presets.map((p) => (
                        <span key={p} className="ts-preset-chip">{p}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
