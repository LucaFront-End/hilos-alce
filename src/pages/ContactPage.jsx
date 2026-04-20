import { ContactSection } from '../components/sections/Contact';

export function ContactPage() {
  return (
    <div style={{ paddingTop: '80px' }}>
      <div style={{ background: 'var(--bg)', paddingTop: '3rem', paddingBottom: '0' }}>
        <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
          <span className="t-label" style={{ color: 'var(--accent)' }}>Contacto</span>
          <h1 className="t-headline" style={{ marginTop: '0.5rem' }}>Solicita tu cotización</h1>
          <p style={{ marginTop: '1rem', color: 'var(--ink-muted)', fontSize: '0.98rem', lineHeight: 1.65 }}>
            Cuéntanos qué necesitas y te respondemos en menos de 24 horas hábiles.
          </p>
        </div>
      </div>
      <ContactSection />
    </div>
  );
}
