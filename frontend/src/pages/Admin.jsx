import { useEffect, useState } from 'react';
import { api } from '../api/client';
import {
  CONTACT_STATUS_LABELS,
  STATUS_LABELS,
  formatDate,
  formatDateTime,
  formatPrice,
} from '../utils/format';

const TABS = [
  { id: 'reservations', label: 'Reservas' },
  { id: 'services', label: 'Servicios' },
  { id: 'users', label: 'Usuarios' },
  { id: 'faqs', label: 'Chatbot' },
  { id: 'social', label: 'Redes' },
  { id: 'messages', label: 'Mensajes' },
];

function ErrorBox({ error }) {
  if (!error) return null;
  return <div className="alert alert-error">{error}</div>;
}

function Loading({ loading, label = 'Cargando...' }) {
  if (!loading) return null;
  return <p className="muted">{label}</p>;
}

function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="section-heading">
          <h3>{title}</h3>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            Cerrar
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------- Reservas ------------------------------- */
function ReservationsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');
      const data = await api.allReservations();
      setItems(data.reservations || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (id, status) => {
    try {
      await api.updateReservation(id, { status });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <div className="section-heading">
        <h2>Reservas recibidas</h2>
        <button type="button" className="btn btn-outline btn-sm" onClick={load}>
          Actualizar
        </button>
      </div>
      <ErrorBox error={error} />
      <Loading loading={loading} />

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Servicio</th>
              <th>Fecha y hora</th>
              <th>Personas</th>
              <th>Valor</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {items.map((reservation) => (
              <tr key={reservation._id}>
                <td>
                  <strong>{reservation.user?.name || 'Usuario'}</strong>
                  <br />
                  <small className="muted">{reservation.user?.email}</small>
                </td>
                <td>{reservation.service?.name || '-'}</td>
                <td>{formatDateTime(reservation.startAt)}</td>
                <td>{reservation.partySize}</td>
                <td>{formatPrice(reservation.service?.price)}</td>
                <td>
                  <select
                    value={reservation.status}
                    onChange={(event) => changeStatus(reservation._id, event.target.value)}
                    aria-label="Cambiar estado de la reserva"
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan="6" className="muted center-text">
                  No hay reservas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ------------------------------- Servicios ------------------------------ */
const EMPTY_SERVICE = {
  name: '',
  description: '',
  durationMin: 60,
  price: 0,
  capacity: 1,
};

function ServicesTab() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_SERVICE);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_SERVICE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');
      const data = await api.adminServices();
      setItems(data.services || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const change = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.createService(form);
      setForm(EMPTY_SERVICE);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggle = async (service) => {
    try {
      await api.updateService(service._id, { active: !service.active });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (service) => {
    try {
      await api.deleteService(service._id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const openEdit = (service) => {
    setEditing(service);
    setEditForm({
      name: service.name || '',
      description: service.description || '',
      durationMin: service.durationMin || 60,
      price: service.price || 0,
      capacity: service.capacity || 1,
      active: service.active !== false,
    });
  };

  const closeEdit = () => {
    setEditing(null);
  };

  const changeEdit = (event) => {
    const { name, value, type, checked } = event.target;
    setEditForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const saveEdit = async (event) => {
    event.preventDefault();
    if (!editing) return;
    try {
      await api.updateService(editing._id, {
        name: editForm.name,
        description: editForm.description,
        durationMin: Number(editForm.durationMin),
        price: Number(editForm.price),
        capacity: Number(editForm.capacity),
        active: editForm.active,
      });
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <div className="section-heading">
        <h2>Catalogo de servicios</h2>
      </div>
      <ErrorBox error={error} />

      <form className="card admin-form" onSubmit={submit}>
        <h3>Nuevo servicio</h3>
        <div className="field-row">
          <label className="field">
            <span>Nombre</span>
            <input name="name" value={form.name} onChange={change} maxLength={80} required />
          </label>
          <label className="field">
            <span>Duracion (min)</span>
            <input
              type="number"
              name="durationMin"
              min="15"
              max="480"
              value={form.durationMin}
              onChange={change}
              required
            />
          </label>
        </div>
        <label className="field">
          <span>Descripcion</span>
          <textarea
            name="description"
            rows="2"
            value={form.description}
            onChange={change}
            maxLength={500}
            required
          />
        </label>
        <div className="field-row">
          <label className="field">
            <span>Valor (CLP)</span>
            <input
              type="number"
              name="price"
              min="0"
              value={form.price}
              onChange={change}
              required
            />
          </label>
          <label className="field">
            <span>Cupos por horario</span>
            <input
              type="number"
              name="capacity"
              min="1"
              max="100"
              value={form.capacity}
              onChange={change}
              required
            />
          </label>
        </div>
        <button type="submit" className="btn btn-primary btn-sm">
          Crear servicio
        </button>
      </form>

      <Loading loading={loading} />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Servicio</th>
              <th>Duracion</th>
              <th>Valor</th>
              <th>Cupos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((service) => (
              <tr key={service._id}>
                <td>
                  <strong>{service.name}</strong>
                  <br />
                  <small className="muted">{service.description}</small>
                </td>
                <td>{service.durationMin} min</td>
                <td>{formatPrice(service.price)}</td>
                <td>{service.capacity}</td>
                <td>
                  <span className={`status ${service.active ? 'status-confirmed' : 'status-cancelled'}`}>
                    {service.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="table-actions">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => openEdit(service)}>
                    Editar
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => toggle(service)}>
                    {service.active ? 'Desactivar' : 'Activar'}
                  </button>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(service)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan="6" className="muted center-text">
                  No hay servicios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal title="Editar servicio" onClose={closeEdit}>
          <form className="admin-form" onSubmit={saveEdit}>
            <div className="field-row">
              <label className="field">
                <span>Nombre</span>
                <input name="name" value={editForm.name} onChange={changeEdit} maxLength={80} required />
              </label>
              <label className="field">
                <span>Duracion (min)</span>
                <input type="number" name="durationMin" min="15" max="480" value={editForm.durationMin} onChange={changeEdit} required />
              </label>
            </div>
            <label className="field">
              <span>Descripcion</span>
              <textarea name="description" rows="2" value={editForm.description} onChange={changeEdit} maxLength={500} required />
            </label>
            <div className="field-row">
              <label className="field">
                <span>Valor (CLP)</span>
                <input type="number" name="price" min="0" value={editForm.price} onChange={changeEdit} required />
              </label>
              <label className="field">
                <span>Cupos por horario</span>
                <input type="number" name="capacity" min="1" max="100" value={editForm.capacity} onChange={changeEdit} required />
              </label>
            </div>
            <label className="field checkbox-field">
              <input type="checkbox" name="active" checked={editForm.active} onChange={changeEdit} />
              <span>Servicio activo</span>
            </label>
            <button type="submit" className="btn btn-primary btn-sm">
              Guardar cambios
            </button>
          </form>
        </Modal>
      )}
    </section>
  );
}

/* -------------------------------- Usuarios ------------------------------ */
function UsersTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');
      const data = await api.users();
      setItems(data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (id, payload) => {
    try {
      await api.updateUser(id, payload);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <div className="section-heading">
        <h2>Usuarios registrados</h2>
      </div>
      <ErrorBox error={error} />
      <Loading loading={loading} />

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Registro</th>
            </tr>
          </thead>
          <tbody>
            {items.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(event) => update(user._id, { role: event.target.value })}
                    aria-label="Cambiar rol"
                  >
                    <option value="client">Cliente</option>
                    <option value="admin">Administrador</option>
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => update(user._id, { active: !user.active })}
                  >
                    {user.active ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td>{formatDate(user.createdAt)}</td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan="5" className="muted center-text">
                  No hay usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* --------------------------------- Chatbot ------------------------------- */
const EMPTY_FAQ = { question: '', answer: '', category: 'General', keywords: '' };

function FaqsTab() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FAQ);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FAQ);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');
      const data = await api.faqs();
      setItems(data.faqs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const change = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.createFaq(form);
      setForm(EMPTY_FAQ);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggle = async (faq) => {
    try {
      await api.updateFaq(faq._id, { active: !faq.active });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (faq) => {
    try {
      await api.deleteFaq(faq._id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const openEdit = (faq) => {
    setEditing(faq);
    setEditForm({
      question: faq.question || '',
      answer: faq.answer || '',
      category: faq.category || 'General',
      keywords: (faq.keywords || []).join(', '),
      active: faq.active !== false,
    });
  };

  const closeEdit = () => setEditing(null);

  const changeEdit = (event) => {
    const { name, value, type, checked } = event.target;
    setEditForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const saveEdit = async (event) => {
    event.preventDefault();
    if (!editing) return;
    try {
      await api.updateFaq(editing._id, {
        question: editForm.question,
        answer: editForm.answer,
        category: editForm.category,
        keywords: editForm.keywords
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        active: editForm.active,
      });
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <div className="section-heading">
        <h2>Preguntas del chatbot</h2>
      </div>
      <p className="muted">
        Estas respuestas alimentan al asistente generativo como contexto oficial. Si el proveedor
        de IA no esta disponible, se usan como respaldo por reglas.
      </p>
      <ErrorBox error={error} />

      <form className="card admin-form" onSubmit={submit}>
        <h3>Nueva pregunta frecuente</h3>
        <label className="field">
          <span>Pregunta</span>
          <input name="question" value={form.question} onChange={change} maxLength={200} required />
        </label>
        <label className="field">
          <span>Respuesta</span>
          <textarea
            name="answer"
            rows="3"
            value={form.answer}
            onChange={change}
            maxLength={1000}
            required
          />
        </label>
        <div className="field-row">
          <label className="field">
            <span>Categoria</span>
            <input name="category" value={form.category} onChange={change} maxLength={60} />
          </label>
          <label className="field">
            <span>Palabras clave (separadas por coma)</span>
            <input
              name="keywords"
              value={form.keywords}
              onChange={change}
              maxLength={300}
              placeholder="horario, abierto, sabado"
            />
          </label>
        </div>
        <button type="submit" className="btn btn-primary btn-sm">
          Crear pregunta
        </button>
      </form>

      <Loading loading={loading} />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Pregunta</th>
              <th>Categoria</th>
              <th>Claves</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((faq) => (
              <tr key={faq._id}>
                <td>
                  <strong>{faq.question}</strong>
                  <br />
                  <small className="muted">{faq.answer}</small>
                </td>
                <td>{faq.category}</td>
                <td>
                  <small className="muted">{(faq.keywords || []).join(', ') || '-'}</small>
                </td>
                <td>
                  <span className={`status ${faq.active ? 'status-confirmed' : 'status-cancelled'}`}>
                    {faq.active ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="table-actions">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => openEdit(faq)}>
                    Editar
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => toggle(faq)}>
                    {faq.active ? 'Desactivar' : 'Activar'}
                  </button>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(faq)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan="5" className="muted center-text">
                  No hay preguntas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal title="Editar pregunta frecuente" onClose={closeEdit}>
          <form className="admin-form" onSubmit={saveEdit}>
            <label className="field">
              <span>Pregunta</span>
              <input name="question" value={editForm.question} onChange={changeEdit} maxLength={200} required />
            </label>
            <label className="field">
              <span>Respuesta</span>
              <textarea name="answer" rows="3" value={editForm.answer} onChange={changeEdit} maxLength={1000} required />
            </label>
            <div className="field-row">
              <label className="field">
                <span>Categoria</span>
                <input name="category" value={editForm.category} onChange={changeEdit} maxLength={60} />
              </label>
              <label className="field">
                <span>Palabras clave (separadas por coma)</span>
                <input name="keywords" value={editForm.keywords} onChange={changeEdit} maxLength={300} />
              </label>
            </div>
            <label className="field checkbox-field">
              <input type="checkbox" name="active" checked={editForm.active} onChange={changeEdit} />
              <span>Pregunta activa</span>
            </label>
            <button type="submit" className="btn btn-primary btn-sm">
              Guardar cambios
            </button>
          </form>
        </Modal>
      )}
    </section>
  );
}

/* --------------------------------- Redes --------------------------------- */
const EMPTY_SOCIAL = { network: '', url: '' };

function SocialTab() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_SOCIAL);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_SOCIAL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');
      const data = await api.adminSocial();
      setItems(data.links || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const change = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.createSocial(form);
      setForm(EMPTY_SOCIAL);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggle = async (link) => {
    try {
      await api.updateSocial(link._id, { active: !link.active });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (link) => {
    try {
      await api.deleteSocial(link._id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const openEdit = (link) => {
    setEditing(link);
    setEditForm({
      network: link.network || '',
      url: link.url || '',
      active: link.active !== false,
    });
  };

  const closeEdit = () => setEditing(null);

  const changeEdit = (event) => {
    const { name, value, type, checked } = event.target;
    setEditForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const saveEdit = async (event) => {
    event.preventDefault();
    if (!editing) return;
    try {
      await api.updateSocial(editing._id, {
        network: editForm.network,
        url: editForm.url,
        active: editForm.active,
      });
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <div className="section-heading">
        <h2>Redes sociales</h2>
      </div>
      <ErrorBox error={error} />

      <form className="card admin-form" onSubmit={submit}>
        <h3>Nuevo enlace</h3>
        <div className="field-row">
          <label className="field">
            <span>Red</span>
            <input
              name="network"
              value={form.network}
              onChange={change}
              maxLength={40}
              placeholder="Instagram"
              required
            />
          </label>
          <label className="field">
            <span>URL completa</span>
            <input
              type="url"
              name="url"
              value={form.url}
              onChange={change}
              maxLength={300}
              placeholder="https://instagram.com/reservapro"
              required
            />
          </label>
        </div>
        <button type="submit" className="btn btn-primary btn-sm">
          Agregar enlace
        </button>
      </form>

      <Loading loading={loading} />
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Red</th>
              <th>URL</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((link) => (
              <tr key={link._id}>
                <td>{link.network}</td>
                <td>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.url}
                  </a>
                </td>
                <td>
                  <span className={`status ${link.active ? 'status-confirmed' : 'status-cancelled'}`}>
                    {link.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="table-actions">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => openEdit(link)}>
                    Editar
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => toggle(link)}>
                    {link.active ? 'Desactivar' : 'Activar'}
                  </button>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(link)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan="4" className="muted center-text">
                  No hay enlaces.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal title="Editar enlace social" onClose={closeEdit}>
          <form className="admin-form" onSubmit={saveEdit}>
            <div className="field-row">
              <label className="field">
                <span>Red</span>
                <input name="network" value={editForm.network} onChange={changeEdit} maxLength={40} required />
              </label>
              <label className="field">
                <span>URL completa</span>
                <input type="url" name="url" value={editForm.url} onChange={changeEdit} maxLength={300} required />
              </label>
            </div>
            <label className="field checkbox-field">
              <input type="checkbox" name="active" checked={editForm.active} onChange={changeEdit} />
              <span>Enlace activo</span>
            </label>
            <button type="submit" className="btn btn-primary btn-sm">
              Guardar cambios
            </button>
          </form>
        </Modal>
      )}
    </section>
  );
}

/* -------------------------------- Mensajes ------------------------------- */
function MessagesTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');
      const data = await api.contactRequests();
      setItems(data.requests || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (id, status) => {
    try {
      await api.updateContactStatus(id, { status });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <div className="section-heading">
        <h2>Solicitudes de contacto</h2>
      </div>
      <ErrorBox error={error} />
      <Loading loading={loading} />

      <div className="stack">
        {items.map((request) => (
          <article key={request._id} className="card message-card">
            <div className="reservation-head">
              <h3>{request.subject}</h3>
              <span className="badge badge-soft">{CONTACT_STATUS_LABELS[request.status]}</span>
            </div>
            <p className="muted small">
              {request.name} · {request.email}
              {request.phone ? ` · ${request.phone}` : ''} · {formatDateTime(request.createdAt)}
            </p>
            <p>{request.message}</p>
            <div className="message-actions">
              <span className="muted small">Correo: {request.emailStatus}</span>
              <select
                value={request.status}
                onChange={(event) => changeStatus(request._id, event.target.value)}
                aria-label="Cambiar estado de la solicitud"
              >
                {Object.entries(CONTACT_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </article>
        ))}
        {!loading && items.length === 0 && <p className="muted">No hay solicitudes.</p>}
      </div>
    </section>
  );
}

/* ---------------------------------- Panel -------------------------------- */
export default function Admin() {
  const [tab, setTab] = useState('reservations');

  return (
    <div className="container page-section">
      <span className="eyebrow">Administracion</span>
      <h1>Panel administrativo</h1>
      <p className="lead">
        Gestiona reservas, servicios, usuarios, contenidos y mensajes de la plataforma.
      </p>

      <div className="tabs" role="tablist" aria-label="Secciones del panel">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={tab === item.id ? 'active' : ''}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'reservations' && <ReservationsTab />}
      {tab === 'services' && <ServicesTab />}
      {tab === 'users' && <UsersTab />}
      {tab === 'faqs' && <FaqsTab />}
      {tab === 'social' && <SocialTab />}
      {tab === 'messages' && <MessagesTab />}
    </div>
  );
}
