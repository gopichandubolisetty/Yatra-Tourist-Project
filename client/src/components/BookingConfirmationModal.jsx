import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const STORAGE_PREFIX = 'yatra_ride_confirm_';

export function getStoredRideConfirm(bookingId) {
  if (!bookingId) return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${bookingId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveRideConfirm(bookingId, payload) {
  localStorage.setItem(`${STORAGE_PREFIX}${bookingId}`, JSON.stringify(payload));
}

export function clearRideConfirm(bookingId) {
  localStorage.removeItem(`${STORAGE_PREFIX}${bookingId}`);
}

export default function BookingConfirmationModal({ open, data, onDone }) {
  if (!open || !data) return null;

  const { transactionId, amount, driverInfo, tripId, bookingId } = data;
  const tel = driverInfo?.phone?.replace(/\s/g, '') || '';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-yatra-dark/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-yatra-hover border-2 border-green-500/30 p-8 my-8">
        <div className="text-center">
          <div className="text-6xl mb-2" aria-hidden>
            ✅
          </div>
          <h2 className="font-display text-2xl font-bold text-yatra-dark">Booking Confirmed!</h2>
          <p className="text-sm text-yatra-secondary mt-1">Your YATRA ride is paid and assigned.</p>
        </div>

        <div className="mt-6 space-y-2 text-sm bg-yatra-bg/80 rounded-xl p-4">
          <p>
            <span className="text-yatra-secondary">Transaction ID</span>
            <br />
            <span className="font-mono font-semibold text-yatra-dark">{transactionId}</span>
          </p>
          <p>
            <span className="text-yatra-secondary">Amount paid</span>
            <br />
            <span className="text-2xl font-bold text-yatra-primary">₹{amount}</span>
          </p>
        </div>

        {driverInfo && (
          <div className="mt-6">
            <h3 className="font-display font-bold text-lg text-yatra-dark mb-3">Your Driver</h3>
            <div className="flex gap-4 items-start bg-yatra-bg rounded-xl p-4">
              <img
                src={driverInfo.photo}
                alt=""
                className="w-20 h-20 rounded-full border-2 border-yatra-primary/20 bg-white"
              />
              <div className="flex-1 min-w-0 space-y-1 text-sm">
                <p className="font-bold text-yatra-dark text-lg">{driverInfo.name}</p>
                <p className="text-yatra-dark/80">
                  🚗 {driverInfo.vehicle} · {driverInfo.plate}
                </p>
                <p className="text-yatra-dark/80">⭐ {driverInfo.rating?.toFixed?.(1) ?? driverInfo.rating}</p>
                <p>
                  <a href={`tel:${tel}`} className="text-yatra-primary font-semibold underline">
                    📞 {driverInfo.phone}
                  </a>
                </p>
                <p className="text-yatra-dark/70">📍 {driverInfo.locationName}</p>
                <p className="text-yatra-dark/70">🕐 ETA to pickup: {driverInfo.eta}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-wrap gap-3">
          {tripId && (
            <Link
              to={`/trips/${tripId}/track`}
              className="btn-yatra-primary text-center !py-3"
            >
              Track Live
            </Link>
          )}
          <a href={`tel:${tel}`} className="text-center px-5 py-3 rounded-xl border-2 border-yatra-secondary text-yatra-secondary font-semibold">
            Call Driver
          </a>
          <button
            type="button"
            className="px-5 py-3 rounded-xl border border-yatra-dark/20 text-yatra-dark font-semibold"
            onClick={() => {
              toast.success('Receipt downloaded (demo).');
            }}
          >
            Download Receipt
          </button>
          <button type="button" className="btn-yatra-primary !bg-yatra-secondary" onClick={onDone}>
            Done
          </button>
        </div>
        <p className="text-xs text-center text-yatra-dark/40 mt-4 font-mono">Ref: {bookingId}</p>
      </div>
    </div>
  );
}
