import { Link } from 'react-router-dom';
import { siteMeta } from '../../data/content';

export function Footer() {
  const year = new Date().getFullYear();
  const waLink = `https://wa.me/${siteMeta.whatsapp}?text=${encodeURIComponent('Hola, quiero más información sobre Hilos Alce.')}`;

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <Link to="/" className="footer__logo">
          <span className="footer__logo-mark">HA</span>
          Hilos Alce
        </Link>

        <nav className="footer__links">
          <Link to="/productos/delgados" className="footer__link">Hilos Delgados</Link>
          <Link to="/productos/gruesos"  className="footer__link">Hilos Gruesos</Link>
          <Link to="/industrias"         className="footer__link">Industrias</Link>
          <Link to="/nosotros"           className="footer__link">Nosotros</Link>
          <Link to="/contacto"           className="footer__link">Contacto</Link>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="footer__link">WhatsApp</a>
        </nav>

        <p className="footer__copy">
          © {year} {siteMeta.name} — CDMX, México
        </p>
      </div>
    </footer>
  );
}
