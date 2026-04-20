import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Phone, Mail } from 'lucide-react';
import { aboutContent } from '../../data/content';

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Configuramos el ScrollTrigger principal que ancla (pin) toda la sección
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=180%', // Cuánto dura el scroll anclado
          pin: true,
          scrub: 1, // Suavidad del scroll
        },
      });

      // Animamos la tarjeta 1
      tl.fromTo(
        '.ab-card-0',
        { y: '80vh', opacity: 0, rotateZ: 5 },
        { y: '0vh', opacity: 1, rotateZ: 0, ease: 'power2.out', duration: 1 }
      )
      // Animamos la tarjeta 2
      .fromTo(
        '.ab-card-1',
        { y: '80vh', opacity: 0, rotateZ: 5 },
        { y: '0vh', opacity: 1, rotateZ: 0, ease: 'power2.out', duration: 1 },
        '-=0.2'
      )
      // Animamos la tarjeta 3
      .fromTo(
        '.ab-card-2',
        { y: '80vh', opacity: 0, rotateZ: 5 },
        { y: '0vh', opacity: 1, rotateZ: 0, ease: 'power2.out', duration: 1 },
        '-=0.2'
      )
      // Animamos la tarjeta 4
      .fromTo(
        '.ab-card-3',
        { y: '80vh', opacity: 0, rotateZ: 5 },
        { y: '0vh', opacity: 1, rotateZ: 0, ease: 'power2.out', duration: 1 },
        '-=0.2'
      );

      // Desvanecer sutilmente el bg o hacer algo al final (opcional)
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section ab-sec" ref={sectionRef} id="nosotros">
      <div className="container ab-inner">
        
        {/* Left Column: Pinned fixed text */}
        <div className="ab-left">
          <span className="t-label" style={{ color: 'var(--accent)' }}>
            {aboutContent.eyebrow}
          </span>
          <h2 className="ab-title">
            Fabricación con propósito<br/><em>excepcional.</em>
          </h2>
          <p className="ab-desc">
            {aboutContent.description}
          </p>

          <div className="ab-meta">
            <div className="ab-contact-card">
              <div className="ab-loc-icon"><MapPin size={18} strokeWidth={1.5} /></div>
              <span>CDMX, México</span>
            </div>
            <a href="tel:5510022544" className="ab-contact-card ab-contact-link">
              <div className="ab-loc-icon"><Phone size={18} strokeWidth={1.5} /></div>
              <span>55 1002 2544</span>
            </a>
            <a href="mailto:ventas@hilosalce.mx" className="ab-contact-card ab-contact-link">
              <div className="ab-loc-icon"><Mail size={18} strokeWidth={1.5} /></div>
              <span>ventas@hilosalce.mx</span>
            </a>
          </div>
        </div>

        {/* Right Column: The grid where cards slide into */}
        <div className="ab-right">
          <div className="ab-grid">
            {aboutContent.values.map((v, i) => (
              <div key={v.title} className={`ab-card ab-card-${i}`}>
                <div className="ab-card__icon-wrap">
                  <div className="ab-card__icon">{v.icon}</div>
                  <div className="ab-card__num">0{i + 1}</div>
                </div>
                <h3 className="ab-card__title">{v.title}</h3>
                <p className="ab-card__desc">{v.desc}</p>
                <div className="ab-card__bottom-line" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
