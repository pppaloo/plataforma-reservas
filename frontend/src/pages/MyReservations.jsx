import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { formatDateTime, formatPrice, STATUS_LABELS } from '../utils/format';

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = () =>
    api
      .myReservations()
      .then((data) => setReservations(data.reservations || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id) => {
    setBusyId(id);
    setError('');
    try {
      await api.cancelReservation(id);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="container page-section">
      <span className="eyebrow">Mi cuenta</span>
      <h1>Mis reservas</h1>
      <p className="lead">Revisa el estado de tus horas y cancela cuando lo necesites.</p>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <p className="muted">Cargando reservas...</p>}

      {!loading && reservations.length === 0 && (
        <div className="card empty-state">
          <h3>Aun no tienes reservas</h3>
          <p>Explora nuestros servicios y agenda tu primera sesion.</p>
          <Link to="/servicios" className="btn btn-primary">
            Ver servicios
          </Link>
        </div>
      )}

      <div className="stack">
        {reservations.map((reservation) => {
          const cancellable = ['pending', 'confirmed'].includes(reservation.status);
          return (
            <article key={reservation._id} className="card reservation-row">
              <div>
                <div className="reservation-head">
                  <h3>{reservation.service?.name || 'Servicio'}</h3>
                  <span className={`status status-${reservation.status}`}>
                    {STATUS_LABELS[reservation.status]}
                  </span>
                </div>
                <p className="muted">
                  {formatDateTime(reservation.startAt)} · {reservation.partySize} participante(s)
                </p>
                {reservation.notes && <p className="small">{reservation.notes}</p>}
              </div>
              <div className="reservation-actions">
                <strong>{formatPrice(reservation.service?.price)}</strong>
                {cancellable && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => cancel(reservation._id)}
                    disabled={busyId === reservation._id}
                  >
                    {busyId === reservation._id ? 'Cancelando...' : 'Cancelar'}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
