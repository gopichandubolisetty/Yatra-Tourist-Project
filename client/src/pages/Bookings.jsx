import { useEffect, useState } from 'react';
import BookingCard from '../components/BookingCard';
import api from '../services/api';

export default function Bookings() {
  const [list, setList] = useState([]);

  useEffect(() => {
    api.get('/api/bookings').then(({ data }) => setList(data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-yatra-dark">My Yatras & Bookings</h1>
      <p className="text-yatra-secondary text-sm mt-1">YATRA — Your Journey, Your Way</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {list.map((b) => (
          <BookingCard key={b.id} booking={b} />
        ))}
        {list.length === 0 && (
          <p className="text-yatra-dark/60 col-span-full">No bookings yet — plan a Yatra first.</p>
        )}
      </div>
    </div>
  );
}
