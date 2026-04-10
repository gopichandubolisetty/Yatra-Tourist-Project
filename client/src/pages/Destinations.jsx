import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { INDIAN_DESTINATIONS } from '../data/indianDestinations';

const REGION_ICONS = {
  Goa: '🏖️',
  Rajasthan: '🏰',
  Kerala: '🌴',
  Ladakh: '🏔️',
  'Andhra Pradesh': '🛕',
  Telangana: '🏙️',
  'Tamil Nadu': '🛕',
  Karnataka: '🌿',
  Maharashtra: '🌆',
  Gujarat: '🪁',
  Punjab: '🌾',
  Assam: '🍃',
  Delhi: '🏛️',
  'Jammu & Kashmir': '❄️',
};

export default function Destinations() {
  const [q, setQ] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(INDIAN_DESTINATIONS[0]?.name || '');

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return INDIAN_DESTINATIONS;
    return INDIAN_DESTINATIONS.filter((d) => {
      if (d.name.toLowerCase().includes(s)) return true;
      return d.cities.some(
        (c) =>
          c.city.toLowerCase().includes(s) ||
          c.stops.some((st) => st.toLowerCase().includes(s))
      );
    });
  }, [q]);

  const activeRegion = filtered.find((region) => region.name === selectedRegion) || filtered[0] || null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-yatra-dark flex items-center gap-2">
            <span>🇮🇳</span> Explore Destinations
          </h1>
          <p className="text-yatra-secondary mt-1">
            All 28 states and 8 Union Territories — curated cities and must-see stops for your YATRA.
          </p>
        </div>
        <Link to="/explore" className="text-yatra-primary font-semibold underline text-sm shrink-0">
          ← Back to Explore Nearby
        </Link>
      </div>

      <div className="mb-8">
        <label htmlFor="dest-search" className="sr-only">
          Search destinations
        </label>
        <input
          id="dest-search"
          type="search"
          placeholder="Search state, city, or attraction…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full max-w-xl border border-yatra-secondary/30 rounded-xl px-4 py-3 bg-white shadow-sm focus:ring-2 focus:ring-yatra-primary/30 outline-none"
        />
        <p className="text-xs text-yatra-dark/50 mt-2">
          Showing {filtered.length} of {INDIAN_DESTINATIONS.length} regions
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filtered.map((region, index) => (
          <button
            key={region.name}
            type="button"
            onClick={() => setSelectedRegion(region.name)}
            className={`rounded-xl p-6 min-h-[100px] border text-center transition hover:bg-orange-100 hover:shadow-lg hover:scale-[1.02] ${
              selectedRegion === region.name
                ? 'bg-gradient-to-br from-yatra-primary to-yatra-secondary text-white border-yatra-primary shadow-lg'
                : index % 2 === 0
                  ? 'bg-orange-50 border-orange-200 text-yatra-dark'
                  : 'bg-yatra-bg border-yatra-primary/20 text-yatra-dark'
            }`}
          >
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <span className="text-2xl" aria-hidden="true">
                {REGION_ICONS[region.name] || '📍'}
              </span>
              <span className="text-lg font-bold leading-snug">{region.name}</span>
              <span
                className={`text-xs uppercase tracking-wider ${
                  selectedRegion === region.name ? 'text-white/80' : 'text-yatra-secondary'
                }`}
              >
                {region.kind === 'ut' ? 'Union Territory' : 'State'}
              </span>
            </div>
          </button>
        ))}
      </div>

      {activeRegion && (
        <div className="mt-8 bg-white rounded-2xl border border-yatra-primary/10 shadow-yatra overflow-hidden">
          <div className="px-5 py-4 border-b border-yatra-primary/5 bg-yatra-bg/70">
            <h2 className="font-display font-bold text-2xl text-yatra-dark">{activeRegion.name}</h2>
            <p className="text-sm text-yatra-secondary mt-1">
              {activeRegion.kind === 'ut' ? 'Union Territory' : 'State'} guide with popular cities and stops
            </p>
          </div>
          <div className="px-5 py-5">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeRegion.cities.map((c) => (
                <div
                  key={`${activeRegion.name}-${c.city}`}
                  className="rounded-xl bg-yatra-bg/80 border border-yatra-secondary/10 p-4"
                >
                  <h3 className="font-display font-bold text-yatra-dark">{c.city}</h3>
                  <p className="text-xs text-yatra-secondary mt-1 font-medium">Popular stops</p>
                  <ul className="mt-2 text-sm text-yatra-dark/80 list-disc list-inside space-y-1">
                    {c.stops.map((st) => (
                      <li key={st}>{st}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-center text-yatra-secondary py-12">No regions match your search.</p>
      )}
    </div>
  );
}
