import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password.length < 10) {
      setError('La contrasena debe tener al menos 10 caracteres.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Las contrasenas no coinciden.');
      return;
    }

    setSending(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate('/servicios', { replace: true });
    } catch (err) {
      const detail = Array.isArray(err.details)
        ? ` ${err.details.map((item) => item.message).join('. ')}`
        : '';
      setError(`${err.message}.${detail}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container page-section auth-wrap">
      <div className="card auth-card">
        <span className="eyebrow">Nueva cuenta</span>
        <h1>Crear cuenta</h1>
        <p className="muted">Solo necesitas tu nombre, correo y una contrasena segura.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Nombre completo</span>
            <input
              type="text"
              name="name"
              autoComplete="name"
              value={form.name}
              maxLength={80}
              onChange={handleChange}
              required
            />
          </label>

          <label className="field">
            <span>Correo electronico</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="field">
            <span>Contrasena (minimo 10 caracteres, con letras y numeros)</span>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <label className="field">
            <span>Repetir contrasena</span>
            <input
              type="password"
              name="confirm"
              autoComplete="new-password"
              value={form.confirm}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
            {sending ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="auth-alt">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
        </p>
      </div>
    </div>
  );
}
