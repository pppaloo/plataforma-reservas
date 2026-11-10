import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container page-section">
        <p className="muted">Verificando sesion...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (role && user.role !== role) {
    return (
      <div className="container page-section">
        <div className="alert alert-error">
          No tienes permisos para acceder a esta seccion. Esta accion quedo registrada.
        </div>
      </div>
    );
  }

  return children;
}
