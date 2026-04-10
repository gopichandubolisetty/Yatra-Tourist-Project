import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PaymentModal from '../components/PaymentModal';
import BookingConfirmationModal, {
  clearRideConfirm,
  getStoredRideConfirm,
  saveRideConfirm,
} from '../components/BookingConfirmationModal';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [payOpen, setPayOpen] = useState(false);
  const [rideConfirm, setRideConfirm] = useState(null);

  const load = () => api.get(`/api/bookings/${id}`).then(({ data }) => setBooking(data));

  useEffect(() => {
    load().catch(() => toast.error('Booking not found'));
  }, [id]);

  useEffect(() => {
    if (!booking?.id) return;
    const stored = getStoredRideConfirm(booking.id);
    if (stored) setRideConfirm(stored);
  }, [booking?.id]);

  const cancel = async () => {
    if (!confirm('Cancel this YATRA booking?')) return;
    try {
      await api.put(`/api/bookings/${id}/cancel`);
      toast.success('Cancelled');
      load();
    } catch {
      toast.error('Could not cancel');
    }
  };

  const onPaymentSuccess = (data) => {
    const payload = {
      transactionId: data.transactionId,
      amount: data.amount ?? booking.cost,
      driverInfo: data.driverInfo,
      bookingId: booking.id,
      tripId: data.tripId ?? booking.trip?.id,
    };
    saveRideConfirm(booking.id, payload);
    setRideConfirm(payload);
    load();
    toast.success('Payment successful!');
  };

  const handleRideDone = () => {
    if (booking?.id) clearRideConfirm(booking.id);
    setRideConfirm(null);
  };

  if (!booking) {
    return <div className="p-10 text-center font-display text-yatra-primary">Loading YATRA…</div>;
  }

  const logo =
    booking.provider === 'YatraRide' ? '🚗' : booking.provider === 'SwiftCab' ? '🚙' : '🚐';

  const d = booking.driverInfo;
  const tel = d?.phone?.replace(/\s/g, '') || '';

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-yatra-dark">YATRA Booking</h1>
      <div className="mt-8 bg-white rounded-2xl border border-yatra-primary/15 p-8 shadow-yatra">
        <span className="text-4xl">{logo}</span>
        <h2 className="font-display text-2xl font-bold mt-4">
          {booking.provider} · {booking.vehicleType}
        </h2>
        <p className="text-yatra-primary text-3xl font-bold mt-4">₹{booking.cost}</p>
        <p className="text-sm text-yatra-secondary mt-2">Status: {booking.status}</p>
        {booking.status === 'CONFIRMED' && d?.name && (
          <div className="mt-6 p-4 bg-yatra-bg rounded-xl border border-yatra-primary/10">
            <p className="font-semibold text-yatra-dark mb-3">Your Driver</p>
            <div className="flex gap-4 items-start">
              {d.photo && (
                <img src={d.photo} alt="" className="w-16 h-16 rounded-full border border-yatra-primary/20" />
              )}
              <div className="space-y-1 text-sm">
                <p className="font-bold text-yatra-dark">{d.name}</p>
                <p>
                  🚗 {d.vehicle} · {d.plate}
                </p>
                <p>⭐ {d.rating?.toFixed?.(1) ?? d.rating}</p>
                <p>🕐 ETA: {d.eta}</p>
                <p>📍 {d.locationName}</p>
                <p>
                  <a href={`tel:${tel}`} className="text-yatra-primary font-semibold underline">
                    📞 {d.phone}
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-3 mt-8">
          {booking.status === 'PENDING' && (
            <button type="button" className="btn-yatra-primary !py-2" onClick={() => setPayOpen(true)}>
              Pay with YatraPay
            </button>
          )}
          {booking.trip?.id && (
            <Link
              to={`/trips/${booking.trip.id}/track`}
              className="px-5 py-2 rounded-xl border-2 border-yatra-secondary text-yatra-secondary font-semibold"
            >
              Live tracking
            </Link>
          )}
          {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
            <button type="button" onClick={cancel} className="text-yatra-danger font-semibold">
              Cancel booking
            </button>
          )}
        </div>
      </div>
      <Link to="/bookings" className="inline-block mt-6 text-yatra-primary font-semibold">
        ← All YATRA bookings
      </Link>

      <PaymentModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        booking={booking}
        amount={booking.cost}
        onSuccess={onPaymentSuccess}
      />

      <BookingConfirmationModal
        open={!!rideConfirm}
        data={rideConfirm}
        onDone={handleRideDone}
      />
    </div>
  );
}
