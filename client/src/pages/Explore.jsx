import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FilterPanel from '../components/FilterPanel';
import NearbyCard from '../components/NearbyCard';
import MapView from '../components/MapView';
import HotelBookingModal from '../components/HotelBookingModal';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const DEFAULT = { lat: 17.385, lng: 78.4867 };

export default function Explore() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [hotelPoi, setHotelPoi] = useState(null);
  const [filters, setFilters] = useState({
    type: 'ALL',
    radius: 500,
    minRating: 0,
    priceLevel: '',
    cuisine: '',
  });
  const [pos, setPos] = useState(DEFAULT);
  const [results, setResults] = useState([]);
  const [split, setSplit] = useState(true);
  const [highlight, setHighlight] = useState(null);

  const fetchNearby = async () => {
    try {
      const params = {
        lat: pos.lat,
        lng: pos.lng,
        type: filters.type,
        radius: filters.radius,
        minRating: filters.minRating || 0,
      };
      if (filters.priceLevel) params.priceLevel = filters.priceLevel;
      if (filters.cuisine) params.cuisine = filters.cuisine;
      const { data } = await api.get('/api/location/nearby', { params });
      setResults(data);
      if (!data.length) toast('No places found. Try adjusting your filters!', { icon: '📍' });
    } catch {
      toast.error('YATRA explore failed');
    }
  };

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (p) => {
        setPos({ lat: p.coords.latitude, lng: p.coords.longitude });
      },
      () => {}
    );
  }, []);

  useEffect(() => {
    fetchNearby();
  }, [pos.lat, pos.lng]);

  const markers = results.map((p) => ({
    position: [p.location.lat, p.location.lng],
    type: 'poi',
    label: p.name,
    key: p.id,
  }));

  const handleBook = (poi) => {
    if (loading) {
      toast('Loading your account…', { icon: '⏳' });
      return;
    }
    if (!isAuthenticated) {
      toast.error('Please sign in to book hotels & restaurants');
      navigate('/login');
      return;
    }
    setHotelPoi(poi);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-yatra-dark flex items-center gap-2">
        <span>📍</span> Explore Nearby
      </h1>
      <p className="text-yatra-secondary mt-1">Discover top hotels & restaurants near you — YATRA</p>
      <p className="mt-3">
        <Link
          to="/destinations"
          className="text-yatra-primary font-semibold underline text-sm"
        >
          Browse all Indian states & Union Territories →
        </Link>
      </p>

      <button
        type="button"
        onClick={() => setSplit(!split)}
        className="text-sm text-yatra-primary font-semibold mt-4 underline"
      >
        {split ? 'List only' : 'Split map view'}
      </button>

      <div className={`mt-6 grid gap-8 ${split ? 'lg:grid-cols-3' : ''}`}>
        <div className={split ? 'lg:col-span-1' : ''}>
          <FilterPanel filters={filters} setFilters={setFilters} />
          <button type="button" className="w-full mt-4 btn-yatra-primary !py-2" onClick={fetchNearby}>
            Apply YATRA filters
          </button>
        </div>
        <div className={split ? 'lg:col-span-2' : 'lg:col-span-3'}>
          {split && (
            <MapView
              center={[pos.lat, pos.lng]}
              zoom={5}
              height="280px"
              markers={[
                { position: [pos.lat, pos.lng], type: 'pickup', label: 'You' },
                ...markers,
              ]}
            />
          )}
          <div className={`grid gap-4 mt-6 ${split ? 'sm:grid-cols-2' : 'sm:grid-cols-2 md:grid-cols-3'}`}>
            {results.length === 0 && (
              <p className="text-yatra-dark/60 col-span-full">
                No places found. Try adjusting your filters!
              </p>
            )}
            {results.map((p) => (
              <NearbyCard
                key={p.id}
                poi={p}
                onSelect={() => setHighlight(p.id)}
                onBook={handleBook}
              />
            ))}
          </div>
        </div>
      </div>

      <HotelBookingModal open={!!hotelPoi} poi={hotelPoi} onClose={() => setHotelPoi(null)} />
    </div>
  );
}
