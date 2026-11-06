const BASE_URL = import.meta.env.VITE_API_URL || '';

let accessToken = null;
let refreshPromise = null;

export function setAccessToken(token) {
  accessToken = token;
}

async function raw(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (auth && accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const response = await fetch(`${BASE_URL}/api${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const error = new Error(data?.message || 'No fue posible completar la solicitud');
    error.status = response.status;
    error.code = data?.code;
    error.details = data?.details;
    throw error;
  }

  return data;
}

// Renueva el access token una sola vez aunque varias peticiones fallen en paralelo.
function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = raw('/auth/refresh', { method: 'POST', auth: false })
      .then((data) => {
        setAccessToken(data.accessToken);
        return data;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function request(path, options = {}, retry = true) {
  try {
    return await raw(path, options);
  } catch (error) {
    const canRetry =
      retry &&
      error.status === 401 &&
      error.code === 'TOKEN_EXPIRED' &&
      options.auth !== false;

    if (canRetry) {
      try {
        await refreshSession();
        return await raw(path, options);
      } catch (_refreshError) {
        setAccessToken(null);
      }
    }
    throw error;
  }
}

export const api = {
  // Autenticacion
  register: (payload) => request('/auth/register', { method: 'POST', body: payload, auth: false }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload, auth: false }),
  refresh: () => raw('/auth/refresh', { method: 'POST', auth: false }),
  logout: () => request('/auth/logout', { method: 'POST', auth: false }),
  me: () => request('/auth/me'),

  // Servicios
  services: () => request('/services', { auth: false }),
  adminServices: () => request('/services?all=1'),
  createService: (payload) => request('/services', { method: 'POST', body: payload }),
  updateService: (id, payload) => request(`/services/${id}`, { method: 'PATCH', body: payload }),
  deleteService: (id) => request(`/services/${id}`, { method: 'DELETE' }),

  // Reservas
  createReservation: (payload) => request('/reservations', { method: 'POST', body: payload }),
  myReservations: () => request('/reservations/mine'),
  cancelReservation: (id) => request(`/reservations/${id}/cancel`, { method: 'PATCH' }),
  allReservations: () => request('/reservations'),
  updateReservation: (id, payload) =>
    request(`/reservations/${id}`, { method: 'PATCH', body: payload }),

  // Contacto
  contact: (payload) => request('/contact', { method: 'POST', body: payload, auth: false }),
  contactRequests: () => request('/contact'),
  updateContactStatus: (id, payload) =>
    request(`/contact/${id}`, { method: 'PATCH', body: payload }),

  // Redes sociales
  social: () => request('/social', { auth: false }),
  adminSocial: () => request('/social?all=1'),
  createSocial: (payload) => request('/social', { method: 'POST', body: payload }),
  updateSocial: (id, payload) => request(`/social/${id}`, { method: 'PATCH', body: payload }),
  deleteSocial: (id) => request(`/social/${id}`, { method: 'DELETE' }),

  // Chatbot y FAQ
  chat: (payload) => request('/chatbot/message', { method: 'POST', body: payload, auth: false }),
  chatWelcome: () => request('/chatbot/welcome', { auth: false }),
  faqs: () => request('/chatbot/faqs'),
  createFaq: (payload) => request('/chatbot/faqs', { method: 'POST', body: payload }),
  updateFaq: (id, payload) => request(`/chatbot/faqs/${id}`, { method: 'PATCH', body: payload }),
  deleteFaq: (id) => request(`/chatbot/faqs/${id}`, { method: 'DELETE' }),

  // Usuarios (admin)
  users: () => request('/users'),
  updateUser: (id, payload) => request(`/users/${id}`, { method: 'PATCH', body: payload }),
};
