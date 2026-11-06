import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container page-section narrow center-text">
      <span className="eyebrow">Error 404</span>
      <h1>Pagina no encontrada</h1>
      <p className="lead">La direccion que buscas no existe o fue movida.</p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </div>
  );
}
