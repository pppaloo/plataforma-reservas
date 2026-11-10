import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { formatPrice } from '../utils/format';

export default function Services() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api
      .services()
      .then((data) => {
        if (!cancelled) setServices(data.services || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="container page-section">
      <span className="eyebrow">Catalogo</span>
      <h1>Nuestros servicios</h1>
      <p className="lead">
        Cada sesion es guiada por un profesional certificado. Los cupos se actualizan en tiempo
        real al confirmar tu reserva.
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="muted">Cargando servicios...</p>
      ) : (
        <div className="grid grid-3">
          {services.map((service) => (
            <article key={service._id} className="card service-card">
              <div className="service-top">
                <span className="badge">{service.durationMin} min</span>
                <span className="badge badge-soft">Hasta {service.capacity} cupos</span>
              </div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="card-footer">
                <strong>{formatPrice(service.price)}</strong>
                <Link to={`/reservar?servicio=${service._id}`} className="btn btn-primary btn-sm">
                  Reservar
                </Link>
              </div>
            </article>
          ))}

          {services.length === 0 && !error && (
            <p className="muted">No hay servicios disponibles por el momento.</p>
          )}
        </div>
      )}
    </div>
  );
}
