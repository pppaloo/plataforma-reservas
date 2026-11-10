import { useState } from 'react';
import { api } from '../api/client';

const INITIAL = { name: '', email: '', phone: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    setSending(true);

    try {
      const data = await api.contact(form);
      setStatus({ type: 'success', message: data.message });
      setForm(INITIAL);
    } catch (error) {
      const detail = Array.isArray(error.details)
        ? ` ${error.details.map((item) => item.message).join('. ')}`
        : '';
      setStatus({ type: 'error', message: `${error.message}.${detail}` });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container page-section">
      <span className="eyebrow">Estamos para ayudarte</span>
      <h1>Contacto</h1>
      <p className="lead">
        Envia tu consulta y recibiras una confirmacion en tu correo. Tambien puedes escribirnos
        directamente a contacto@reservapro.cl.
      </p>

      <div className="form-layout">
        <form className="card form-card" onSubmit={handleSubmit} noValidate>
          {status.message && (
            <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              {status.message}
            </div>
          )}

          <div className="field-row">
            <label className="field">
              <span>Nombre *</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                maxLength={80}
                required
              />
            </label>

            <label className="field">
              <span>Correo electronico *</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                maxLength={120}
                required
              />
            </label>
          </div>

          <div className="field-row">
            <label className="field">
              <span>Telefono</span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                maxLength={30}
              />
            </label>

            <label className="field">
              <span>Asunto *</span>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                maxLength={120}
                required
              />
            </label>
          </div>

          <label className="field">
            <span>Mensaje * (maximo 2000 caracteres)</span>
            <textarea
              name="message"
              rows="6"
              value={form.message}
              onChange={handleChange}
              maxLength={2000}
              required
            />
            <small className="muted">{form.message.length}/2000</small>
          </label>

          <button type="submit" className="btn btn-primary" disabled={sending}>
            {sending ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </form>

        <aside className="card contact-card">
          <h2>Informacion</h2>
          <ul className="contact-list">
            <li>
              <strong>Direccion</strong>
              <span>Av. Los Carrera 1234, Concepcion</span>
            </li>
            <li>
              <strong>Telefono</strong>
              <span>+56 41 234 5678</span>
            </li>
            <li>
              <strong>Correo</strong>
              <span>contacto@reservapro.cl</span>
            </li>
            <li>
              <strong>Horario</strong>
              <span>Lun a Vie 08:00 - 20:00 · Sab 09:00 - 14:00</span>
            </li>
          </ul>
          <p className="muted small">
            Tus datos se almacenan de forma segura y solo se utilizan para responder tu solicitud.
          </p>
        </aside>
      </div>
    </div>
  );
}
