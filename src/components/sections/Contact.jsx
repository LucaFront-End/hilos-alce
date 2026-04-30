import { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Send } from 'lucide-react';
import { siteMeta } from '../../data/content';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { submitContactForm } from '../../lib/formService';

const waLink = `https://wa.me/${siteMeta.whatsapp}?text=${encodeURIComponent('Hola, quiero cotizar hilos Alce.')}`;

const channels = [
  {
    icon: <Phone size={20} strokeWidth={1.5} />,
    label: 'Teléfono',
    val: siteMeta.phone,
    href: `tel:${siteMeta.phone.replace(/\s/g, '')}`,
  },
  {
    icon: <Mail size={20} strokeWidth={1.5} />,
    label: 'Correo',
    val: siteMeta.email,
    href: `mailto:${siteMeta.email}`,
  },
  {
    icon: <MessageCircle size={20} strokeWidth={1.5} />,
    label: 'WhatsApp',
    val: 'Enviar mensaje',
    href: waLink,
    external: true,
  },
  {
    icon: <MapPin size={20} strokeWidth={1.5} />,
    label: 'Dirección',
    val: 'Iztapalapa, CDMX',
    href: `https://maps.google.com/?q=${encodeURIComponent(siteMeta.address)}`,
    external: true,
  },
];

const industries_options = [
  'Textil', 'Automotriz', 'Calzado', 'Tapicería', 'Lonas & Carpas', 'Marroquinería', 'Seguridad', 'Otra',
];

export function ContactSection() {
  const ref = useScrollReveal();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setSendError(false);

    const fd = new FormData(e.target);

    try {
      const result = await submitContactForm({
        nombre: fd.get('nombre') || '',
        empresa: fd.get('empresa') || '',
        industria: fd.get('industria') || '',
        telefono: fd.get('telefono') || '',
        email: fd.get('email') || '',
        mensaje: fd.get('mensaje') || '',
      });

      setSending(false);
      if (result.success) {
        setSent(true);
        setTimeout(() => setSent(false), 5000);
      } else {
        setSendError(true);
        setTimeout(() => setSendError(false), 5000);
      }
    } catch (err) {
      console.error('[Contact] Submit error:', err);
      setSending(false);
      setSendError(true);
      setTimeout(() => setSendError(false), 5000);
    }
  };

  return (
    <section className="section contact" ref={ref} id="contacto">
      <div className="container">
        <div style={{ marginBottom: '3rem' }}>
          <span className="t-label reveal" style={{ color: 'var(--accent)' }}>Hablemos</span>
          <h2 className="t-headline reveal delay-1" style={{ marginTop: '0.5rem' }}>
            Cotiza tu pedido
          </h2>
        </div>

        <div className="contact__inner">
          {/* Form */}
          <div className="contact__form-card reveal">
            {sent ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--accent)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '0.5rem' }}>
                  ¡Mensaje enviado!
                </h3>
                <p style={{ color: 'var(--ink-muted)' }}>Te contactaremos a la brevedad.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} id="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="nombre">Nombre</label>
                    <input name="nombre" id="nombre" className="form-input"
                           placeholder="Tu nombre" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="empresa">Empresa</label>
                    <input name="empresa" id="empresa" className="form-input"
                           placeholder="Tu empresa" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="industria">Industria</label>
                  <select name="industria" id="industria" className="form-select">
                    <option value="">Selecciona tu industria</option>
                    {industries_options.map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="telefono">Teléfono</label>
                    <input name="telefono" id="telefono" className="form-input"
                           type="tel" placeholder="+52 55 XXXX XXXX" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Correo</label>
                    <input name="email" id="email" type="email" className="form-input"
                           placeholder="tu@empresa.com" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="mensaje">¿Qué necesitas?</label>
                  <textarea name="mensaje" id="mensaje" className="form-textarea"
                            placeholder="Describe el producto, calibre, cantidad y presentación que necesitas…"
                            rows={5} />
                </div>

                <button type="submit" className="btn btn--accent btn--lg"
                        disabled={sending}
                        style={{ width: '100%', justifyContent: 'center' }}>
                  {sending ? 'Enviando...' : 'Solicitar Cotización'}
                  <Send size={18} strokeWidth={2} />
                </button>

                {sendError && (
                  <div style={{ marginTop: '1rem', color: '#E74C3C', fontSize: '0.85rem', textAlign: 'center', fontWeight: '500' }}>
                    Error al enviar. Intenta de nuevo o contáctanos por WhatsApp.
                  </div>
                )}
              </form>
            )}
          </div>

          {/* Info */}
          <div className="contact__info reveal delay-2">
            <h3 className="contact__info-title">
              Estamos aquí<br />para ayudarte.
            </h3>
            <p className="contact__info-sub">
              Coordinamos entregas en CDMX y todo México.
              Respondemos cotizaciones en menos de 24 horas hábiles.
            </p>

            <div className="contact__channels">
              {channels.map((ch) => (
                <a
                  key={ch.label}
                  href={ch.href}
                  className="contact-channel"
                  target={ch.external ? '_blank' : undefined}
                  rel={ch.external ? 'noopener noreferrer' : undefined}
                  data-cursor
                >
                  <div className="contact-channel__icon">{ch.icon}</div>
                  <div>
                    <div className="contact-channel__label">{ch.label}</div>
                    <div className="contact-channel__val">{ch.val}</div>
                  </div>
                  <svg style={{ marginLeft: 'auto', opacity: 0.3, flexShrink: 0 }}
                       viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
