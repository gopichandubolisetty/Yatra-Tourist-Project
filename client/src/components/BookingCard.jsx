import { Link } from 'react-router-dom';

const statusColor = {
  PENDING: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-yatra-secondary/15 text-yatra-secondary',
};

export default function BookingCard({ booking }) {
  const st = statusColor[booking.status] || 'bg-gray-100 text-gray-800';
  return (
    <Link
      to={`/bookings/${booking.id}`}
      className="block bg-white rounded-2xl border border-yatra-primary/10 p-5 shadow-yatra hover:shadow-yatra-hover transition-all"
    >
      <div className="flex justify-between items-start gap-2">
        <div>
          <p className="text-2xl mb-1">{booking.provider === 'YatraRide' ? '🚗' : booking.provider === 'SwiftCab' ? '🚙' : '🚐'}</p>
          <h3 className="font-display font-bold text-lg text-yatra-dark">{booking.provider}</h3>
          <p className="text-sm text-yatra-secondary">{booking.vehicleType}</p>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${st}`}>{booking.status}</span>
      </div>
      <p className="mt-3 text-yatra-primary font-bold text-lg">₹{booking.cost}</p>
      <p className="text-xs text-yatra-dark/50 mt-2">YATRA booking · Tap for details</p>
    </Link>
  );
}
