import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { formatDateTime, formatPrice, toLocalInputValue } from '../utils/format';

export default function Book() {
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get('servicio') || '';

  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    serviceId: preselected,
    startAt: '',
    partySize: 1,
    contactPhone: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [details, setDetails] = useState([]);
  const [created, setCreated] = useState(null);
  const [sending, setSending] = useState(false);

  const minDateTime = useMemo(() => toLocalInputValue(new Date(Date.now() + 30 * 60 * 1000)), []);

  useEffect(() => {
    let cancelled = false;
    api
      .services()
      .then((data) => {
        if (cancelled) return;
        const list = data.services || [];
        setServices(list);
        if (!preselected && list.length) {
          setForm((current) => ({ ...current, serviceId: list[0]._id }));
        }
      })
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [preselected]);

  const selectedService = services.find((service) => service._id === form.serviceId);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setDetails([]);
    setSending(true);

    try {
      // datetime-local entrega hora local sin zona: se envia como ISO.
      const startAt = new Date(form.startAt).toISOString();
      const data = await api.createReservation({
        serviceId: form.serviceId,
        startAt,
        partySize: Number(form.partySize),
        contactPhone: form.contactPhone,
        notes: form.notes,
      });
      setCreated(data.reservation);
    } catch (err) {
      setError(err.message);
      if (Array.isArray(err.details)) setDetails(err.details);
    } finally {
      setSending(false);
    }
  };

  if (created) {
    return (
      <div className="container page-section narrow">
        <div className="card success-card">
          <span className="success-mark">✓</span>
          <h1>Reserva registrada</h1>
          <p>Tu solicitud quedo guardada con estado pendiente de confirmacion.</p>
          <dl className="detail-list">
            <div>
              <dt>Servicio</dt>
              <dd>{created.service?.name}</dd>
            </div>
            <div>
              <dt>Fecha y hora</dt>
              <dd>{formatDateTime(created.startAt)}</dd>
            </div>
            <div>
              <dt>Participantes</dt>
              <dd>{created.partySize}</dd>
            </div>
            <div>
              <dt>Valor</dt>
              <dd>{formatPrice(created.service?.price)}</dd>
            </div>
          </dl>
          <div className="hero-actions">
            <Link to="/mis-reservas" className="btn btn-primary">
              Ver mis reservas
            </Link>
            <Link to="/servicios" className="btn btn-outline">
              Reservar otra hora
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-section">
      <span className="eyebrow">Agenda</span>
      <h1>Reservar una hora</h1>
      <p className="lead">Completa los datos y confirmaremos tu cupo segun disponibilidad.</p>

      <div className="form-layout">
        <form className="card form-card" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="alert alert-error">
              {error}
              {details.length > 0 && (
                <ul>
                  {details.map((item) => (
                    <li key={item.path}>{item.message}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <label className="field">
            <span>Servicio *</span>
            <select name="serviceId" value={form.serviceId} onChange={handleChange} required>
              <option value="">Selecciona un servicio</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name} · {formatPrice(service.price)}
                </option>
              ))}
            </select>
          </label>

          <div className="field-row">
            <label className="field">
              <span>Fecha y hora *</span>
              <input
                type="datetime-local"
                name="startAt"
                value={form.startAt}
                min={minDateTime}
                onChange={handleChange}
                required
              />
            </label>

            <label className="field">
              <span>Participantes *</span>
              <input
                type="number"
                name="partySize"
                min="1"
                max={selectedService?.capacity || 20}
                value={form.partySize}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label className="field">
            <span>Telefono de contacto</span>
            <input
              type="tel"
              name="contactPhone"
              value={form.contactPhone}
              maxLength={30}
              placeholder="+56 9 1234 5678"
              onChange={handleChange}
            />
          </label>

          <label className="field">
            <span>Comentarios</span>
            <textarea
              name="notes"
              rows="3"
              maxLength={500}
              value={form.notes}
              placeholder="Indicaciones o requerimientos especiales"
              onChange={handleChange}
            />
          </label>

          <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
            {sending ? 'Enviando...' : 'Confirmar reserva'}
          </button>
          <p className="muted small">
            Al reservar aceptas nuestra politica de cancelacion con 24 horas de anticipacion.
          </p>
        </form>

        <aside className="card summary-card">
          <h2>Resumen</h2>
          {selectedService ? (
            <>
              <h3>{selectedService.name}</h3>
              <p>{selectedService.description}</p>
              <dl className="detail-list">
                <div>
                  <dt>Duracion</dt>
                  <dd>{selectedService.durationMin} minutos</dd>
                </div>
                <div>
                  <dt>Cupos por horario</dt>
                  <dd>{selectedService.capacity}</dd>
                </div>
                <div>
                  <dt>Valor</dt>
                  <dd>{formatPrice(selectedService.price)}</dd>
                </div>
              </dl>
            </>
          ) : (
            <p className="muted">Selecciona un servicio para ver el resumen.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
