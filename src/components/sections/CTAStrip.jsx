import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const waLink = `https://wa.me/5215510022544?text=${encodeURIComponent('Hola, quiero cotizar hilos Alce.')}`;

export function CTAStrip() {
  const ref = useScrollReveal();

  return (
    <section className="cta-strip" ref={ref}>
      <div className="cta-strip__bg" aria-hidden="true" />
      <div className="container cta-strip__inner">
        <h2 className="cta-strip__title reveal">
          ¿Listo para elevar<br />
          <span className="cta-strip__title-em">tu producción?</span>
        </h2>
        <p className="cta-strip__sub reveal delay-1">
          Nuestro equipo de ventas está listo para orientarte sobre el hilo
          ideal para tu proceso. Cotización sin compromiso.
        </p>
        <div className="cta-strip__actions reveal delay-2">
          <Link to="/contacto" className="btn btn--light btn--lg">
            Solicitar Cotización
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <a href={waLink} target="_blank" rel="noopener noreferrer"
             className="btn btn--ghost-light btn--lg">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.79.467 3.47 1.28 4.934L2 22l5.234-1.27A9.945 9.945 0 0012 22c5.523 0 10-4.477 10-10S17.522 2 12 2z"/>
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
