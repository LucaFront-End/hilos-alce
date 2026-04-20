import { Link } from 'react-router-dom';
import { productLines } from '../../data/content';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export function ProductLines() {
  const ref = useScrollReveal();

  return (
    <section className="section products" ref={ref}>
      <div className="container">
        <div className="products__header">
          <div>
            <span className="t-label reveal" style={{ color: 'var(--accent)' }}>Nuestras Líneas</span>
            <h2 className="t-headline reveal delay-1" style={{ marginTop: '0.5rem' }}>
              Dos líneas,<br />un estándar.
            </h2>
          </div>
          <p className="reveal delay-2" style={{
            maxWidth: '36ch', color: 'var(--ink-muted)',
            fontSize: '0.95rem', lineHeight: 1.65
          }}>
            Cada línea está diseñada para un rango de aplicaciones específicas,
            sin comprometer resistencia ni rendimiento.
          </p>
        </div>

        <div className="products__panels reveal-scale delay-1">
          {productLines.map((p, idx) => (
            <ProductPanel key={p.id} product={p} isLast={idx === productLines.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductPanel({ product: p }) {
  const isThick = p.id === 'gruesos';
  const panelClass = isThick ? 'product-panel--thick' : 'product-panel--thin';

  return (
    <div className={`product-panel ${panelClass}`} tabIndex={0} data-cursor>
      <div className="product-panel__bg-num" aria-hidden="true">{p.bgNum}</div>

      <div className="product-panel__tag">
        <span className="t-label" style={{ fontSize: '0.68rem', color: isThick ? '#2980B9' : 'var(--accent)' }}>
          {p.tag}
        </span>
      </div>

      <span className="product-panel__icon">{p.icon}</span>

      <h3 className="product-panel__title">
        {p.title}<br />
        <span style={{ color: isThick ? '#2980B9' : 'var(--accent)', fontWeight: 400, fontSize: '60%' }}>
          {p.subtitle}
        </span>
      </h3>

      <p className="product-panel__sub">{p.description}</p>

      {/* Color swatches */}
      <div className="product-panel__colors">
        {p.swatches.map((color, i) => (
          <div key={i} className="color-swatch" style={{ background: color }}
               title={color} data-cursor />
        ))}
        {p.id === 'delgados' && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
            color: 'var(--ink-faint)', alignSelf: 'center', marginLeft: '4px'
          }}>+14</span>
        )}
      </div>

      {/* Specs (appear on hover) */}
      <div className="product-panel__specs">
        {p.specs.map((s, i) => (
          <div key={i} className="product-panel__spec">
            <span className={`product-panel__spec-dot ${isThick ? 'panel-dot-blue' : 'panel-dot-red'}`} />
            {s.label}
          </div>
        ))}
      </div>

      <div className="product-panel__cta">
        <Link
          to={`/productos/${p.slug}`}
          className="btn btn--outline"
          style={{ borderColor: isThick ? 'rgba(41,128,185,0.35)' : 'rgba(192,57,43,0.35)', fontSize: '0.82rem' }}
        >
          Ver especificaciones
          <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}
