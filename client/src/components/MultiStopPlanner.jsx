import { useState } from 'react';
import MapView from './MapView';
import toast from 'react-hot-toast';

export default function MultiStopPlanner({ stops, setStops, max = 5 }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const geocode = async () => {
    if (!query.trim()) return;
    if (stops.length >= max) {
      toast.error(`YATRA allows up to ${max} stops`);
      return;
    }
    setLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&limit=1`;
      const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
      const data = await res.json();
      if (!data.length) {
        toast.error('Place not found — try another address');
        return;
      }
      const item = data[0];
      const next = [
        ...stops,
        {
          name: item.display_name.split(',').slice(0, 2).join(','),
          address: item.display_name,
          location: { lat: parseFloat(item.lat), lng: parseFloat(item.lon) },
          type: stops.length === 0 ? 'PICKUP' : stops.length === max - 1 ? 'DROPOFF' : 'WAYPOINT',
        },
      ];
      setStops(next);
      setQuery('');
      toast.success('Stop added to your Yatra');
    } catch {
      toast.error('Geocoding failed — check your connection');
    } finally {
      setLoading(false);
    }
  };

  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= stops.length) return;
    const copy = [...stops];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    copy.forEach((s, idx) => {
      s.type = idx === 0 ? 'PICKUP' : idx === copy.length - 1 ? 'DROPOFF' : 'WAYPOINT';
    });
    setStops(copy);
  };

  const remove = (i) => {
    setStops(stops.filter((_, idx) => idx !== i));
  };

  const markers = stops.map((s, i) => ({
    position: [s.location.lat, s.location.lng],
    type: s.type === 'PICKUP' ? 'pickup' : s.type === 'DROPOFF' ? 'dropoff' : 'waypoint',
    label: `${i + 1}. ${s.name}`,
  }));

  const center =
    stops[0]?.location ? [stops[0].location.lat, stops[0].location.lng] : [17.385, 78.4867];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div>
        <p className="text-sm text-yatra-secondary font-medium mb-2">
          Address search (OpenStreetMap Nominatim)
        </p>
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 border border-yatra-secondary/30 rounded-xl px-4 py-2 bg-white"
            placeholder="Search place in India..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), geocode())}
          />
          <button
            type="button"
            disabled={loading}
            onClick={geocode}
            className="btn-yatra-primary !py-2 shrink-0"
          >
            {loading ? '…' : 'Add'}
          </button>
        </div>
        <p className="text-xs text-yatra-dark/60 mb-2">
          Drag order: use ↑ ↓ — first stop = pickup, last = drop-off
        </p>
        <ul className="space-y-2">
          {stops.map((s, i) => (
            <li
              key={i}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('idx', String(i))}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const from = parseInt(e.dataTransfer.getData('idx'), 10);
                if (Number.isNaN(from) || from === i) return;
                const copy = [...stops];
                const [row] = copy.splice(from, 1);
                copy.splice(i, 0, row);
                copy.forEach((st, idx) => {
                  st.type =
                    idx === 0 ? 'PICKUP' : idx === copy.length - 1 ? 'DROPOFF' : 'WAYPOINT';
                });
                setStops(copy);
              }}
              className="flex items-center gap-2 bg-white border border-yatra-primary/15 rounded-xl p-3 shadow-sm"
            >
              <span className="text-yatra-primary font-bold w-6">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{s.name}</p>
                <p className="text-xs text-yatra-dark/60 truncate">{s.type}</p>
              </div>
              <div className="flex gap-1">
                <button type="button" className="px-2 py-1 text-yatra-secondary" onClick={() => move(i, -1)}>
                  ↑
                </button>
                <button type="button" className="px-2 py-1 text-yatra-secondary" onClick={() => move(i, 1)}>
                  ↓
                </button>
                <button type="button" className="px-2 text-yatra-danger" onClick={() => remove(i)}>
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <MapView center={center} zoom={11} height="360px" markers={markers} />
    </div>
  );
}
