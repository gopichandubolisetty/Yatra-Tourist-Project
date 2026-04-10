import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { refreshUser } = useAuth();
  const [search] = useSearchParams();
  const tab = search.get('tab') === 'history' ? 'history' : 'profile';
  const { register, handleSubmit, reset } = useForm();
  const [history, setHistory] = useState(null);

  useEffect(() => {
    api.get('/api/users/profile').then(({ data }) => {
      reset({
        name: data.name,
        phone: data.phone,
        cuisine: (data.preferences?.cuisine || []).join(', '),
        priceLevel: data.preferences?.priceLevel || 'mid',
      });
    });
  }, [reset]);

  useEffect(() => {
    if (tab === 'history') {
      api.get('/api/users/history').then(({ data }) => setHistory(data));
    }
  }, [tab]);

  const save = async (values) => {
    try {
      await api.put('/api/users/profile', {
        name: values.name,
        phone: values.phone,
        preferences: {
          cuisine: values.cuisine
            ? values.cuisine.split(',').map((s) => s.trim()).filter(Boolean)
            : [],
          priceLevel: values.priceLevel,
        },
      });
      toast.success('YATRA profile updated');
      refreshUser();
    } catch {
      toast.error('Update failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-yatra-dark">Traveller Profile</h1>
      <p className="text-yatra-secondary text-sm mt-1">YATRA — Your Journey, Your Way</p>

      <div className="flex gap-4 mt-6 border-b border-yatra-primary/20">
        <Link
          to="/profile"
          className={`pb-2 font-semibold ${tab === 'profile' ? 'text-yatra-primary border-b-2 border-yatra-primary' : 'text-yatra-dark/60'}`}
        >
          Profile
        </Link>
        <Link
          to="/profile?tab=history"
          className={`pb-2 font-semibold ${tab === 'history' ? 'text-yatra-primary border-b-2 border-yatra-primary' : 'text-yatra-dark/60'}`}
        >
          History
        </Link>
      </div>

      {tab === 'profile' && (
        <form onSubmit={handleSubmit(save)} className="mt-8 space-y-4 bg-white rounded-2xl p-8 border border-yatra-secondary/15 shadow-yatra">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input className="w-full mt-1 border rounded-xl px-4 py-2" {...register('name')} />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <input className="w-full mt-1 border rounded-xl px-4 py-2" {...register('phone')} />
          </div>
          <div>
            <label className="text-sm font-medium">Favourite cuisines (comma separated)</label>
            <input className="w-full mt-1 border rounded-xl px-4 py-2" {...register('cuisine')} />
          </div>
          <div>
            <label className="text-sm font-medium">Price level</label>
            <select className="w-full mt-1 border rounded-xl px-4 py-2" {...register('priceLevel')}>
              <option value="budget">Budget</option>
              <option value="mid">Mid</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
          <button type="submit" className="btn-yatra-primary !py-2">
            Save YATRA profile
          </button>
        </form>
      )}

      {tab === 'history' && history && (
        <div className="mt-8 space-y-6">
          <section>
            <h2 className="font-display font-bold text-lg text-yatra-secondary">Trips</h2>
            <ul className="mt-2 space-y-2">
              {history.trips.map((t) => (
                <li key={t.id} className="bg-white p-3 rounded-xl border border-yatra-primary/10">
                  {t.name} — {t.status}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="font-display font-bold text-lg text-yatra-secondary">Bookings</h2>
            <ul className="mt-2 space-y-2">
              {history.bookings.map((b) => (
                <li key={b.id} className="bg-white p-3 rounded-xl border border-yatra-primary/10">
                  {b.provider} — ₹{b.cost} — {b.status}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="font-display font-bold text-lg text-yatra-secondary">Payments</h2>
            <ul className="mt-2 space-y-2">
              {history.payments.map((p) => (
                <li key={p.id} className="bg-white p-3 rounded-xl border border-yatra-primary/10">
                  {p.transactionId} — ₹{p.amount} — {p.status}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
