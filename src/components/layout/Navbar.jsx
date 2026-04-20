import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { siteMeta } from '../../data/content';

export function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const waLink = `https://wa.me/${siteMeta.whatsapp}?text=${encodeURIComponent('Hola, quiero cotizar hilos Alce.')}`;

  return (
    <>
      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="container navbar__inner">
          {/* Logo */}
          <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
            <span className="navbar__logo-mark">HA</span>
            {siteMeta.name}
          </Link>

          {/* Desktop Nav */}
          <nav className="navbar__nav" aria-label="Navegación principal">
            <div className="navbar-dropdown">
              <button className="navbar__link">Productos ↓</button>
              <div className="navbar-dropdown__panel">
                <Link to="/productos/hilos-delgados" className="navbar-dropdown__item">
                  <span className="navbar-dropdown__dot" style={{ background: 'var(--accent)' }} />
                  Hilos Delgados
                </Link>
                <Link to="/productos/hilos-gruesos" className="navbar-dropdown__item">
                  <span className="navbar-dropdown__dot" style={{ background: '#2980B9' }} />
                  Hilos Gruesos
                </Link>
              </div>
            </div>
            <NavLink to="/industrias" className="navbar__link">Industrias</NavLink>
            <NavLink to="/nosotros"   className="navbar__link">Nosotros</NavLink>
            <NavLink to="/contacto"   className="navbar__link">Contacto</NavLink>
          </nav>

          {/* Actions */}
          <div className="navbar__actions">
            <a href={waLink} target="_blank" rel="noopener noreferrer"
               className="btn btn--outline" style={{ fontSize: '0.82rem', padding: '0.55rem 1.1rem' }}>
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 5.5C19.5 4 17.5 3 15.3 3 10.8 3 7 6.7 7 11.2c0 1.5.4 3 1.2 4.3L7 20l4.7-1.2c1.2.7 2.6 1 4 1 4.5 0 8.3-3.7 8.3-8.2 0-2.2-.9-4.2-3-5.9z"/>
              </svg>
              WhatsApp
            </a>
            <Link to="/contacto" className="btn btn--primary">
              Cotizar
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          {/* Hamburger */}
          <button className="navbar__hamburger" onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Menú" aria-expanded={menuOpen}>
            <span className="hamburger-line" style={menuOpen ? { transform: 'rotate(45deg) translate(4px, 4px)' } : {}} />
            <span className="hamburger-line" style={menuOpen ? { opacity: 0 } : {}} />
            <span className="hamburger-line" style={menuOpen ? { transform: 'rotate(-45deg) translate(4px, -4px)' } : {}} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}>
        <div className="mobile-menu__links">
          {[
            { to: '/productos/hilos-delgados', label: 'Hilos Delgados' },
            { to: '/productos/hilos-gruesos',  label: 'Hilos Gruesos' },
            { to: '/industrias',         label: 'Industrias' },
            { to: '/nosotros',           label: 'Nosotros' },
            { to: '/contacto',           label: 'Contacto' },
          ].map((item) => (
            <Link key={item.to} to={item.to} className="mobile-menu__link"
                  onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="mobile-menu__actions">
          <Link to="/contacto" className="btn btn--primary btn--lg" onClick={() => setMenuOpen(false)}>
            Cotizar Ahora
          </Link>
          <a href={waLink} target="_blank" rel="noopener noreferrer"
             className="btn btn--outline btn--lg" onClick={() => setMenuOpen(false)}>
            WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
