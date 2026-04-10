import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MapView from '../components/MapView';
import BookingCard from '../components/BookingCard';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function TripDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [route, setRoute] = useState(null);

  const load = async () => {
    const { data } = await api.get(`/api/trips/${id}`);
    setTrip(data);
    const r = await api.post(`/api/trips/${id}/route`);
    setRoute(r.data);
  };

  useEffect(() => {
    load().catch(() => toast.error('Could not load Yatra'));
  }, [id]);

  const cancel = async () => {
    if (!confirm('Cancel this Yatra on YATRA?')) return;
    try {
      await api.delete(`/api/trips/${id}`);
      toast.success('Trip cancelled');
      load();
    } catch {
      toast.error('Cancel failed');
    }
  };

  if (!trip) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center font-display text-2xl text-yatra-primary">
        Loading YATRA…
      </div>
    );
  }

  const markers = trip.stops?.map((s, i) => ({
    position: [s.location.lat, s.location.lng],
    type: s.type === 'PICKUP' ? 'pickup' : s.type === 'DROPOFF' ? 'dropoff' : 'waypoint',
    label: `${s.name} (${s.type})`,
  })) || [];

  const center = trip.stops?.[0]?.location
    ? [trip.stops[0].location.lat, trip.stops[0].location.lng]
    : [17.385, 78.4867];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-yatra-dark">Your Yatra: {trip.name}</h1>
      <p className="text-sm text-yatra-secondary mt-1">YATRA trip detail</p>
      <span
        className={`inline-block mt-3 text-xs px-3 py-1 rounded-full font-semibold ${
          trip.status === 'COMPLETED'
            ? 'bg-emerald-100 text-emerald-800'
            : trip.status === 'CANCELLED'
              ? 'bg-red-100 text-red-700'
              : trip.status === 'ACTIVE'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-amber-100 text-amber-800'
        }`}
      >
        {trip.status}
      </span>

      <div className="grid lg:grid-cols-2 gap-8 mt-8">
        <div>
          <h2 className="font-display font-bold text-lg text-yatra-secondary mb-3">Stops timeline</h2>
          <ul className="space-y-3">
            {trip.stops?.map((s) => (
              <li key={s.id} className="flex gap-3 items-start bg-white rounded-xl p-4 border border-yatra-primary/10">
                <span className="text-xl">📍</span>
                <div>
                  <p className="font-semibold text-yatra-dark">{s.name}</p>
                  <p className="text-sm text-yatra-dark/60">{s.address}</p>
                  <p className="text-xs text-yatra-primary mt-1">{s.type}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <MapView
          center={center}
          zoom={11}
          height="380px"
          markers={markers}
          polyline={route?.waypoints}
        />
      </div>

      <div className="mt-10">
        <h2 className="font-display font-bold text-lg mb-4">YATRA bookings</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {trip.bookings?.length ? (
            trip.bookings.map((b) => <BookingCard key={b.id} booking={b} />)
          ) : (
            <p className="text-yatra-dark/60">No booking for this yatra yet.</p>
          )}
        </div>
        {trip.bookings?.[0] && (
          <div className="mt-4 p-4 bg-white rounded-xl border border-yatra-secondary/15">
            <p className="text-sm font-semibold text-yatra-dark">Driver (when confirmed)</p>
            <p className="text-sm text-yatra-dark/80">
              {trip.bookings[0].driverInfo?.name || '—'} · {trip.bookings[0].driverInfo?.vehicle || '—'}
            </p>
            <p className="text-yatra-primary font-bold mt-2">₹{trip.bookings[0].cost}</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mt-8">
        <Link to={`/trips/${id}/track`} className="btn-yatra-primary !py-2">
          Track My Yatra
        </Link>
        {trip.status !== 'CANCELLED' && trip.status !== 'COMPLETED' && (
          <button
            type="button"
            onClick={cancel}
            className="px-5 py-2 rounded-xl border-2 border-yatra-danger text-yatra-danger font-semibold"
          >
            Cancel Yatra
          </button>
        )}
        <Link to="/dashboard" className="px-5 py-2 text-yatra-secondary font-semibold">
          ← Back
        </Link>
      </div>
    </div>
  );
}
