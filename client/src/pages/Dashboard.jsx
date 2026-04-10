import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [t, b, p, n] = await Promise.all([
          api.get('/api/trips'),
          api.get('/api/bookings'),
          api.get('/api/payments'),
          api.get('/api/notifications'),
        ]);
        setTrips(t.data);
        setBookings(b.data);
        setPayments(p.data);
        setNotifications(n.data.slice(0, 5));
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const activeBookings = bookings.filter((x) => x.status === 'CONFIRMED' || x.status === 'PENDING').length;
  const totalSpent = payments.filter((x) => x.status === 'SUCCESS').reduce((s, x) => s + x.amount, 0);
  const rated = bookings.filter((b) => b.driverInfo?.rating > 0);
  const avgRating =
    rated.length > 0
      ? (rated.reduce((s, b) => s + (b.driverInfo?.rating || 0), 0) / rated.length).toFixed(1)
      : '—';

  const recent = trips.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-yatra-dark">
        Namaste, {user?.name?.split(' ')[0] || 'Traveller'}! 🙏 Ready for your next Yatra?
      </h1>
      <p className="text-yatra-secondary mt-2">YATRA — Your Journey, Your Way</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        {[
          { label: 'Total Trips', value: trips.length, icon: '🗺️' },
          { label: 'Active Bookings', value: activeBookings, icon: '🚗' },
          { label: 'Total Spent', value: `₹${totalSpent}`, icon: '₹' },
          { label: 'Avg Rating', value: avgRating, icon: '⭐' },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-gradient-to-br from-white to-yatra-bg rounded-2xl p-6 border border-yatra-primary/15 shadow-yatra"
          >
            <span className="text-2xl">{s.icon}</span>
            <p className="text-2xl font-bold text-yatra-dark mt-2">{s.value}</p>
            <p className="text-sm text-yatra-secondary font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mt-12">
        <div className="lg:col-span-2">
          <h2 className="font-display text-xl font-bold text-yatra-dark mb-4">My Recent Yatras</h2>
          <div className="space-y-3">
            {recent.length === 0 && <p className="text-yatra-dark/60">No trips yet — plan your first Yatra!</p>}
            {recent.map((t) => (
              <Link
                key={t.id}
                to={`/trips/${t.id}`}
                className="block bg-white rounded-xl p-4 border border-yatra-secondary/10 shadow-sm hover:shadow-yatra transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-yatra-dark">{t.name}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      t.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : t.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link to="/trips/new" className="btn-yatra-primary !py-2 !px-5 text-sm">
              Plan New Yatra
            </Link>
            <Link
              to="/explore"
              className="px-5 py-2 rounded-xl border-2 border-yatra-secondary text-yatra-secondary font-semibold hover:bg-yatra-secondary/5"
            >
              Explore Nearby
            </Link>
            <Link
              to="/bookings"
              className="px-5 py-2 rounded-xl border-2 border-yatra-primary text-yatra-primary font-semibold"
            >
              My Bookings
            </Link>
          </div>
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-yatra-dark mb-4">Yatra Updates</h2>
          <ul className="space-y-2">
            {notifications.length === 0 && <li className="text-sm text-yatra-dark/50">No notifications</li>}
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`text-sm p-3 rounded-xl border ${n.read ? 'bg-white/80' : 'bg-yatra-primary/5 border-yatra-primary/20'}`}
              >
                {n.message}
              </li>
            ))}
          </ul>
          <Link to="/notifications" className="text-yatra-primary text-sm font-semibold mt-3 inline-block">
            View all YATRA updates →
          </Link>
        </div>
      </div>
    </div>
  );
}
