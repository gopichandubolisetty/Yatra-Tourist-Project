const getCategoryIcon = (category) => {
  if (category === 'HOTEL') return '🏨';
  if (category === 'RESTAURANT') return '🍽️';
  return '📍';
};

const getCategoryColor = (category) => {
  if (category === 'HOTEL') return 'from-orange-100 to-amber-100';
  if (category === 'RESTAURANT') return 'from-green-100 to-emerald-100';
  return 'from-blue-100 to-cyan-100';
};

export default function NearbyCard({ poi, onSelect, onBook }) {
  const kind = String(poi.category || poi.poiType || poi.type || '').toUpperCase();
  const canBook = kind === 'HOTEL' || kind === 'RESTAURANT';

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(poi)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.(poi)}
      className="bg-white rounded-2xl overflow-hidden border border-yatra-secondary/15 shadow-yatra hover:shadow-yatra-hover transition-all cursor-pointer"
    >
      <div
        className={`w-full h-48 flex flex-col items-center justify-center bg-gradient-to-br ${getCategoryColor(kind)} rounded-t-xl`}
      >
        <span className="text-6xl mb-2" aria-hidden>
          {getCategoryIcon(kind)}
        </span>
        <span className="text-sm font-medium text-gray-500">{kind || poi.category}</span>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-display font-bold text-yatra-dark leading-tight">{poi.name}</h3>
          <span className="text-xs bg-yatra-bg text-yatra-secondary px-2 py-0.5 rounded-full shrink-0">
            {kind || poi.category}
          </span>
        </div>
        <p className="text-sm text-yatra-dark/70 mt-1 line-clamp-2">{poi.address}</p>
        <div className="flex flex-wrap gap-2 mt-2 text-xs">
          <span>⭐ {poi.rating}</span>
          <span className="text-yatra-dark/50">({poi.reviewCount} reviews)</span>
          <span className="capitalize text-yatra-primary">{poi.priceLevel}</span>
          {poi.cuisine && <span>{poi.cuisine}</span>}
        </div>
        <p className="text-xs text-yatra-secondary mt-2">📍 {poi.distanceKm?.toFixed(1)} km away</p>
        {canBook && onBook && (
          <button
            type="button"
            className="mt-3 w-full btn-yatra-primary !py-2 text-sm"
            onClick={(e) => {
              e.stopPropagation();
              onBook({ ...poi, category: kind || poi.category });
            }}
          >
            Book Now
          </button>
        )}
      </div>
    </article>
  );
}
