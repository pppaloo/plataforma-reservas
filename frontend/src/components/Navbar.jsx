import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="container nav-bar">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-mark">R</span>
          <span>
            <strong>ReservaPro</strong>
            <small>Centro de Bienestar Integral</small>
          </span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-label="Abrir menu de navegacion"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${open ? 'is-open' : ''}`} aria-label="Navegacion principal">
          <NavLink to="/" onClick={close} className={({ isActive }) => (isActive ? 'active' : '')}>
            Inicio
          </NavLink>
          <NavLink
            to="/servicios"
            onClick={close}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Servicios
          </NavLink>
          <NavLink
            to="/contacto"
            onClick={close}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Contacto
          </NavLink>

          {user && (
            <NavLink
              to="/mis-reservas"
              onClick={close}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Mis reservas
            </NavLink>
          )}

          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              onClick={close}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Panel admin
            </NavLink>
          )}

          <div className="nav-actions">
            {user ? (
              <>
                <span className="nav-user">{user.name.split(' ')[0]}</span>
                <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
                  Cerrar sesion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm" onClick={close}>
                  Ingresar
                </Link>
                <Link to="/registro" className="btn btn-primary btn-sm" onClick={close}>
                  Crear cuenta
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
