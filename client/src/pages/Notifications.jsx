import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const icon = (type) => {
  if (type === 'WEATHER') return '🌤️';
  if (type === 'PROMO') return '🎁';
  if (type === 'EMERGENCY') return '⚠️';
  return '🚗';
};

export default function Notifications() {
  const [list, setList] = useState([]);

  const load = () => api.get('/api/notifications').then(({ data }) => setList(data));

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id) => {
    await api.put(`/api/notifications/${id}/read`);
    load();
  };

  const markAll = async () => {
    await api.put('/api/notifications/read-all');
    toast.success('All YATRA updates read');
    load();
  };

  const del = async (id) => {
    await api.delete(`/api/notifications/${id}`);
    load();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-yatra-dark">Yatra Updates</h1>
      <p className="text-sm text-yatra-secondary mt-1">Notifications — YATRA</p>
      <button type="button" onClick={markAll} className="text-sm text-yatra-primary font-semibold mt-4">
        Mark all as read
      </button>
      <ul className="mt-6 space-y-3">
        {list.map((n) => (
          <li
            key={n.id}
            className={`flex gap-3 p-4 rounded-2xl border ${
              n.read ? 'bg-white border-yatra-secondary/10' : 'bg-yatra-primary/5 border-yatra-primary/25'
            }`}
          >
            <span className="text-2xl">{icon(n.type)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-yatra-dark">{n.message}</p>
              <p className="text-xs text-yatra-dark/50 mt-1">{new Date(n.sentAt || n.createdAt).toLocaleString()}</p>
              <div className="flex gap-2 mt-2">
                {!n.read && (
                  <button type="button" className="text-xs text-yatra-primary font-semibold" onClick={() => markRead(n.id)}>
                    Mark read
                  </button>
                )}
                <button type="button" className="text-xs text-yatra-danger" onClick={() => del(n.id)}>
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
        {list.length === 0 && <p className="text-yatra-dark/60">No YATRA updates yet.</p>}
      </ul>
    </div>
  );
}
