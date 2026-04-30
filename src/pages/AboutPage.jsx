import { About } from '../components/sections/About';
import { CTAStrip } from '../components/sections/CTAStrip';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { usePageSEO } from '../hooks/usePageSEO';

export function AboutPage() {
  const ref = useScrollReveal();
  usePageSEO({
    title: 'Hilos Alce | Fábrica de Hilo Poliéster Industrial de Alta Calidad en México',
    description: 'Somos una fábrica de hilos industriales especializada en poliéster de alta tenacidad. Soluciones para empresas que buscan calidad, resistencia y consistencia.',
  });

  return (
    <div style={{ paddingTop: '80px' }}>
      <section className="section" style={{ background: 'var(--bg)' }} ref={ref}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
          <span className="t-label reveal" style={{ color: 'var(--accent)' }}>Sobre Nosotros</span>
          <h1 className="t-headline reveal delay-1" style={{ marginTop: '0.5rem' }}>
            Precisión e industria,<br />
            en cada hilo.
          </h1>
          <p className="reveal delay-2" style={{
            marginTop: '1.25rem', color: 'var(--ink-muted)',
            fontSize: '1.05rem', lineHeight: 1.7,
          }}>
            Hilos Alce es una empresa mexicana especializada en la fabricación
            y distribución de hilos industriales de poliéster de alta tenacidad.
            Desde nuestra planta en Iztapalapa, CDMX, atendemos a clientes B2B
            en toda la república.
          </p>
        </div>
      </section>
      <About />
      <CTAStrip />
    </div>
  );
}
