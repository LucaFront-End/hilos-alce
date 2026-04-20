import { industries } from '../data/content';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { CTAStrip } from '../components/sections/CTAStrip';

export function IndustriesPage() {
  const ref = useScrollReveal();

  return (
    <div style={{ paddingTop: '80px' }}>
      <section className="section" style={{ background: 'var(--bg)' }} ref={ref}>
        <div className="container">
          <div style={{ marginBottom: '3rem' }}>
            <span className="t-label reveal" style={{ color: 'var(--accent)' }}>Sectores</span>
            <h1 className="t-headline reveal delay-1" style={{ marginTop: '0.5rem' }}>
              Industrias que<br />atendemos
            </h1>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.25rem',
          }}>
            {industries.map((ind, i) => (
              <div key={ind.id} className={`reveal delay-${(i % 4) + 1}`} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-xl)',
                padding: '2rem',
                transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
                cursor: 'default',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  e.currentTarget.style.borderColor = 'var(--accent)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '';
                  e.currentTarget.style.borderColor = '';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2rem' }}>{ind.icon}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--ink-faint)' }}>
                      {ind.num}
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700 }}>
                      {ind.name}
                    </h2>
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {ind.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {ind.applications.map(app => (
                    <span key={app} style={{
                      padding: '0.25rem 0.65rem',
                      background: 'var(--accent-bg)',
                      border: '1px solid rgba(192,57,43,0.12)',
                      borderRadius: '100px',
                      fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 500,
                      color: 'var(--accent)',
                    }}>
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTAStrip />
    </div>
  );
}
