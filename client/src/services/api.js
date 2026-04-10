import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL: baseURL || undefined,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('yatra_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('yatra_token');
      localStorage.removeItem('yatra_user');
      if (!window.location.pathname.match(/^\/(login|register)?$/)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

/** Hotel & restaurant table/reservation bookings */
export const hotelBookingAPI = {
  create: (data) => api.post('/api/hotel-bookings', data),
  getAll: () => api.get('/api/hotel-bookings'),
  cancel: (id) => api.put(`/api/hotel-bookings/${id}/cancel`),
};

export default api;
