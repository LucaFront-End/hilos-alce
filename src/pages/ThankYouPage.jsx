// src/pages/ThankYouPage.jsx
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { usePageSEO } from '../hooks/usePageSEO';

export function ThankYouPage() {
  const mainRef = useRef(null);

  usePageSEO({
    title: 'Gracias por contactarnos | Hilos Alce',
    description: 'Tu mensaje fue enviado correctamente. Nuestro equipo te contactará a la brevedad.',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from('.ty-icon', { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(1.7)', delay: 0.2 });
      gsap.from('.ty-title', { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.4 });
      gsap.from('.ty-text', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out', delay: 0.55 });
      gsap.from('.ty-actions', { y: 16, opacity: 0, duration: 0.5, ease: 'power3.out', delay: 0.7 });
      gsap.from('.ty-confetti span', { 
        scale: 0, opacity: 0, duration: 0.5, stagger: 0.06, ease: 'back.out(2)', delay: 0.3,
      });
    }, mainRef);
    return () => ctx.revert();
  }, []);

  return (
    <main className="ty-page" ref={mainRef}>
      <div className="ty-bg" aria-hidden="true" />
      <div className="container ty-content">

        {/* Decorative confetti dots */}
        <div className="ty-confetti" aria-hidden="true">
          <span style={{ '--x': '-120px', '--y': '-80px', '--c': 'var(--accent)' }} />
          <span style={{ '--x': '130px', '--y': '-60px', '--c': '#F4A261' }} />
          <span style={{ '--x': '-90px', '--y': '70px', '--c': '#2A9D8F' }} />
          <span style={{ '--x': '100px', '--y': '90px', '--c': '#E76F51' }} />
          <span style={{ '--x': '0px', '--y': '-110px', '--c': '#264653' }} />
          <span style={{ '--x': '-160px', '--y': '20px', '--c': '#E9C46A' }} />
          <span style={{ '--x': '160px', '--y': '30px', '--c': 'var(--accent)' }} />
        </div>

        {/* Checkmark icon */}
        <div className="ty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h1 className="ty-title">¡Gracias por contactarnos!</h1>
        <p className="ty-text">
          Tu mensaje fue enviado correctamente.<br />
          Nuestro equipo de ventas te contactará a la brevedad.
        </p>

        <div className="ty-actions">
          <Link to="/" className="btn btn--accent btn--lg">
            Volver al inicio
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
