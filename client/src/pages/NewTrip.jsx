import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MultiStopPlanner from '../components/MultiStopPlanner';
import PaymentModal from '../components/PaymentModal';
import BookingConfirmationModal, {
  clearRideConfirm,
  getStoredRideConfirm,
  saveRideConfirm,
} from '../components/BookingConfirmationModal';
import api from '../services/api';
import toast from 'react-hot-toast';

const steps = ['Trip Details', 'Add Your Stops', 'Choose Your Ride', 'Complete Payment'];

export default function NewTrip() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [stops, setStops] = useState([]);
  const [tripId, setTripId] = useState(null);
  const [options, setOptions] = useState([]);
  const [distanceKm, setDistanceKm] = useState(0);
  const [selected, setSelected] = useState(null);
  const [booking, setBooking] = useState(null);
  const [payOpen, setPayOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [rideConfirm, setRideConfirm] = useState(null);

  useEffect(() => {
    if (booking?.id) {
      const s = getStoredRideConfirm(booking.id);
      if (s) setRideConfirm(s);
    }
  }, [booking?.id]);

  const progress = ((step + 1) / steps.length) * 100;

  const goNext = async () => {
    if (step === 0) {
      if (!name.trim() || !startTime || !endTime) {
        toast.error('Fill all YATRA trip details');
        return;
      }
      setStep(1);
      return;
    }
    if (step === 1) {
      if (stops.length < 2) {
        toast.error('Add at least 2 stops for your Yatra');
        return;
      }
      setBusy(true);
      try {
        const payload = {
          name,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
          stops: stops.map((s, i) => ({
            order: i + 1,
            name: s.name,
            address: s.address,
            location: s.location,
            type: s.type,
          })),
        };
        const { data: trip } = await api.post('/api/trips', payload);
        setTripId(trip.id);
        const { data: route } = await api.post(`/api/trips/${trip.id}/route`);
        setDistanceKm(route.totalDistance || 0);
        const { data: prev } = await api.post('/api/bookings', { tripId: trip.id, preview: true });
        setOptions(prev.options || []);
        setStep(2);
        toast.success('YATRA route ready');
      } catch (e) {
        toast.error(e.response?.data?.message || 'Could not create Yatra');
      } finally {
        setBusy(false);
      }
      return;
    }
    if (step === 2) {
      if (!selected) {
        toast.error('Pick a YATRA ride option');
        return;
      }
      setBusy(true);
      try {
        const { data: b } = await api.post('/api/bookings', {
          tripId,
          provider: selected.provider,
          vehicleType: selected.vehicleType,
        });
        setBooking(b);
        setStep(3);
        setPayOpen(true);
      } catch (e) {
        toast.error(e.response?.data?.message || 'Booking failed');
      } finally {
        setBusy(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-yatra-dark">Plan Your Yatra</h1>
      <p className="text-yatra-secondary text-sm mt-1">YATRA — Your Journey, Your Way</p>

      <div className="mt-6 h-2 bg-yatra-secondary/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-yatra-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-yatra-dark/60">
        {steps.map((s, i) => (
          <span key={s} className={i === step ? 'text-yatra-primary font-bold' : ''}>
            {i + 1}. {s}
          </span>
        ))}
      </div>

      <div className="mt-10 bg-white rounded-2xl border border-yatra-primary/10 p-6 shadow-yatra">
        {step === 0 && (
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="text-sm font-medium">Yatra name</label>
              <input
                className="w-full mt-1 border rounded-xl px-4 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Monsoon Yatra to Goa"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Start</label>
              <input
                type="datetime-local"
                className="w-full mt-1 border rounded-xl px-4 py-2"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">End</label>
              <input
                type="datetime-local"
                className="w-full mt-1 border rounded-xl px-4 py-2"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 1 && <MultiStopPlanner stops={stops} setStops={setStops} />}

        {step === 2 && (
          <div>
            <p className="text-sm text-yatra-secondary mb-4">
              Route ≈ {distanceKm} km — compare providers (₹)
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {options.map((o) => (
                <button
                  type="button"
                  key={`${o.provider}-${o.vehicleType}`}
                  onClick={() => setSelected(o)}
                  className={`text-left p-4 rounded-2xl border-2 transition-all ${
                    selected?.provider === o.provider && selected?.vehicleType === o.vehicleType
                      ? 'border-yatra-primary shadow-yatra-hover bg-yatra-primary/5'
                      : 'border-yatra-secondary/20 hover:border-yatra-primary/50'
                  }`}
                >
                  <span className="text-3xl">{o.logo}</span>
                  <p className="font-bold text-yatra-dark mt-2">
                    {o.provider} · {o.vehicleType}
                  </p>
                  <p className="text-yatra-primary font-bold text-xl">₹{o.cost}</p>
                  <p className="text-xs text-yatra-dark/60">ETA {o.eta} · ⭐ {o.rating}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && booking && (
          <div>
            <p className="text-yatra-dark font-medium">Yatra booking #{booking.id.slice(0, 8)}…</p>
            <p className="text-sm text-yatra-secondary mt-2">
              Complete YatraPay to confirm your ride with {booking.provider}.
            </p>
            <button type="button" className="btn-yatra-primary mt-4" onClick={() => setPayOpen(true)}>
              Open YatraPay (₹{booking.cost})
            </button>
          </div>
        )}

        <div className="flex gap-3 mt-8">
          {step > 0 && step < 3 && (
            <button
              type="button"
              className="px-5 py-2 rounded-xl border border-yatra-secondary text-yatra-secondary"
              onClick={() => setStep((s) => s - 1)}
            >
              Back
            </button>
          )}
          {step < 2 && (
            <button type="button" disabled={busy} className="btn-yatra-primary !py-2" onClick={goNext}>
              {busy ? 'YATRA…' : 'Next'}
            </button>
          )}
          {step === 2 && (
            <button type="button" disabled={busy} className="btn-yatra-primary !py-2" onClick={goNext}>
              {busy ? '…' : 'Book this Yatra'}
            </button>
          )}
        </div>
      </div>

      <PaymentModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        booking={booking}
        amount={booking?.cost}
        onSuccess={(data) => {
          const payload = {
            transactionId: data.transactionId,
            amount: data.amount ?? booking.cost,
            driverInfo: data.driverInfo,
            bookingId: booking.id,
            tripId: data.tripId ?? tripId,
          };
          saveRideConfirm(booking.id, payload);
          setRideConfirm(payload);
        }}
      />

      <BookingConfirmationModal
        open={!!rideConfirm}
        data={rideConfirm}
        onDone={() => {
          if (booking?.id) clearRideConfirm(booking.id);
          setRideConfirm(null);
          navigate(`/trips/${tripId}`);
        }}
      />
    </div>
  );
}
