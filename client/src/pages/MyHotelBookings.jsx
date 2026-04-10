import { useEffect, useState } from 'react';
import { hotelBookingAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function MyHotelBookings() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await hotelBookingAPI.getAll();
      setList(data);
    } catch {
      toast.error('Could not load hotel bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await hotelBookingAPI.cancel(id);
      toast.success('Booking cancelled');
      load();
    } catch {
      toast.error('Cancel failed');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center text-yatra-primary font-display">Loading…</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-yatra-dark">Hotel & restaurant bookings</h1>
      <p className="text-yatra-secondary mt-1">Stays and table reservations on YATRA</p>

      <div className="mt-8 space-y-4">
        {list.length === 0 && (
          <p className="text-yatra-dark/60">No hotel or restaurant bookings yet. Explore nearby to book.</p>
        )}
        {list.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-2xl border border-yatra-primary/15 shadow-yatra p-6 flex flex-col sm:flex-row sm:justify-between gap-4"
          >
            <div>
              <span className="text-xs uppercase tracking-wide text-yatra-secondary">{b.poiType}</span>
              <h2 className="font-display text-xl font-bold text-yatra-dark mt-1">{b.poiName}</h2>
              <p className="text-sm text-yatra-dark/70 mt-2 font-mono">{b.confirmationNumber}</p>
              <p className="text-sm mt-2">
                {b.poiType === 'HOTEL' ? (
                  <>
                    Check-in: {b.checkIn || '—'} · Check-out: {b.checkOut || '—'}
                  </>
                ) : (
                  <>
                    Date: {b.bookingDate || '—'}
                    {b.timeSlot ? ` · ${b.timeSlot}` : ''}
                  </>
                )}
              </p>
              <p className="text-sm text-yatra-dark/80">Guests: {b.guests}</p>
              {b.specialRequests && (
                <p className="text-sm text-yatra-dark/60 mt-1">Note: {b.specialRequests}</p>
              )}
            </div>
            <div className="text-right sm:min-w-[140px]">
              <p className="text-2xl font-bold text-yatra-primary">₹{b.totalCost ?? 0}</p>
              <p className="text-sm font-semibold text-yatra-secondary mt-1">{b.status}</p>
              {b.status !== 'CANCELLED' && (
                <button
                  type="button"
                  onClick={() => cancel(b.id)}
                  className="mt-4 text-sm text-yatra-danger font-semibold underline"
                >
                  Cancel booking
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
