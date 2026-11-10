import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

const FALLBACK_LINKS = [
  { _id: 'ig', network: 'Instagram', url: 'https://instagram.com' },
  { _id: 'fb', network: 'Facebook', url: 'https://facebook.com' },
];

export default function Footer() {
  const [links, setLinks] = useState(FALLBACK_LINKS);

  useEffect(() => {
    let cancelled = false;
    api
      .social()
      .then((data) => {
        if (!cancelled && data.links?.length) setLinks(data.links);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <strong className="footer-brand">ReservaPro</strong>
          <p>
            Centro de bienestar integral en Concepcion. Reserva tu hora en linea de forma simple y
            segura.
          </p>
        </div>

        <div>
          <h4>Navegacion</h4>
          <ul>
            <li>
              <Link to="/servicios">Servicios</Link>
            </li>
            <li>
              <Link to="/contacto">Contacto</Link>
            </li>
            <li>
              <Link to="/mis-reservas">Mis reservas</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Contacto</h4>
          <ul>
            <li>Av. Los Carrera 1234, Concepcion</li>
            <li>+56 41 234 5678</li>
            <li>contacto@reservapro.cl</li>
          </ul>
        </div>

        <div>
          <h4>Siguenos</h4>
          <ul className="social-list">
            {links.map((link) => (
              <li key={link._id}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.network}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} ReservaPro. Proyecto academico.</span>
        <span>Desarrollo Web Seguro · DevOps · DevSecOps</span>
      </div>
    </footer>
  );
}
