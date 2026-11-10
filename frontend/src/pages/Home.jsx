import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { formatPrice } from '../utils/format';

export default function Home() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    let cancelled = false;
    api
      .services()
      .then((data) => {
        if (!cancelled) setServices((data.services || []).slice(0, 3));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Reserva online · Concepcion</span>
            <h1>Tu bienestar, agendado en menos de un minuto</h1>
            <p>
              Reserva sesiones de kinesiologia, nutricion, masajes y yoga con profesionales
              certificados. Gestiona tus horas, recibe confirmaciones y resuelve tus dudas desde un
              solo lugar.
            </p>
            <div className="hero-actions">
              <Link to="/servicios" className="btn btn-primary">
                Ver servicios
              </Link>
              <Link to="/contacto" className="btn btn-outline">
                Hablar con un ejecutivo
              </Link>
            </div>
            <ul className="hero-points">
              <li>Confirmacion inmediata</li>
              <li>Cancelacion en linea</li>
              <li>Datos protegidos</li>
            </ul>
          </div>

          <aside className="hero-card" aria-label="Resumen del servicio">
            <h2>Agenda de la semana</h2>
            <p className="muted">Atencion de lunes a sabado</p>
            <div className="hero-slot">
              <span>Lun - Vie</span>
              <strong>08:00 - 20:00</strong>
            </div>
            <div className="hero-slot">
              <span>Sabado</span>
              <strong>09:00 - 14:00</strong>
            </div>
            <div className="hero-slot">
              <span>Ubicacion</span>
              <strong>Av. Los Carrera 1234</strong>
            </div>
            <Link to="/reservar" className="btn btn-primary btn-block">
              Reservar ahora
            </Link>
            <small className="muted">
              Necesitas una cuenta para confirmar tu reserva.
            </small>
          </aside>
        </div>
      </section>

      <section className="container page-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Servicios destacados</span>
            <h2>Programas pensados para ti</h2>
          </div>
          <Link to="/servicios" className="link-arrow">
            Ver todos
          </Link>
        </div>

        <div className="grid grid-3">
          {services.map((service) => (
            <article key={service._id} className="card service-card">
              <span className="badge">{service.durationMin} min</span>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="card-footer">
                <strong>{formatPrice(service.price)}</strong>
                <Link to={`/reservar?servicio=${service._id}`} className="btn btn-soft btn-sm">
                  Reservar
                </Link>
              </div>
            </article>
          ))}
          {services.length === 0 && <p className="muted">Cargando servicios...</p>}
        </div>
      </section>

      <section className="band">
        <div className="container grid grid-3">
          <div className="band-item">
            <strong>01</strong>
            <h3>Crea tu cuenta</h3>
            <p>Registro con correo y contrasena protegida mediante hash bcrypt.</p>
          </div>
          <div className="band-item">
            <strong>02</strong>
            <h3>Elige tu hora</h3>
            <p>Selecciona servicio, fecha y cantidad de participantes.</p>
          </div>
          <div className="band-item">
            <strong>03</strong>
            <h3>Gestiona tu reserva</h3>
            <p>Revisa el estado y cancela cuando lo necesites desde tu panel.</p>
          </div>
        </div>
      </section>

      <section className="container page-section">
        <div className="cta-panel">
          <div>
            <h2>¿Tienes dudas antes de reservar?</h2>
            <p>
              Nuestro asistente virtual responde las consultas frecuentes y, si necesitas algo mas,
              derivamos tu caso a un ejecutivo.
            </p>
          </div>
          <div className="cta-actions">
            <Link to="/contacto" className="btn btn-primary">
              Enviar mensaje
            </Link>
            <Link to="/servicios" className="btn btn-outline">
              Explorar servicios
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
