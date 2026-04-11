export default function NearbyCard({ poi, onSelect, onBook }) {
  const kind = String(poi.category || poi.poiType || poi.type || '').toUpperCase();
  const canBook = kind === 'HOTEL' || kind === 'RESTAURANT';

  const categoryEmoji =
    kind === 'HOTEL' ? '🏨' : kind === 'RESTAURANT' ? '🍽️' : '📍';

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(poi)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.(poi)}
      className="bg-white rounded-2xl overflow-hidden border border-yatra-secondary/15 shadow-yatra hover:shadow-yatra-hover transition-all cursor-pointer"
    >
      <div className="w-full h-48 flex items-center justify-center text-6xl bg-gradient-to-br from-orange-100 to-orange-200 rounded-t-2xl">
        <span aria-hidden>{categoryEmoji}</span>
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
