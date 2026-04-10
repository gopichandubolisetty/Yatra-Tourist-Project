export default function FilterPanel({ filters, setFilters }) {
  return (
    <aside className="bg-white rounded-2xl border border-yatra-secondary/15 p-4 shadow-yatra space-y-4">
      <h2 className="font-display font-bold text-yatra-dark">YATRA filters</h2>
      <div>
        <label className="text-xs font-semibold text-yatra-secondary">Type</label>
        <select
          className="w-full mt-1 border rounded-xl px-3 py-2 bg-yatra-bg"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="ALL">All</option>
          <option value="HOTEL">Hotels</option>
          <option value="RESTAURANT">Restaurants</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-yatra-secondary">Radius (km)</label>
        <input
          type="number"
          min={1}
          max={500}
          className="w-full mt-1 border rounded-xl px-3 py-2 bg-yatra-bg"
          value={filters.radius}
          onChange={(e) => setFilters({ ...filters, radius: e.target.value })}
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-yatra-secondary">Min rating</label>
        <input
          type="number"
          step={0.1}
          min={0}
          max={5}
          className="w-full mt-1 border rounded-xl px-3 py-2 bg-yatra-bg"
          value={filters.minRating}
          onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-yatra-secondary">Price level</label>
        <select
          className="w-full mt-1 border rounded-xl px-3 py-2 bg-yatra-bg"
          value={filters.priceLevel}
          onChange={(e) => setFilters({ ...filters, priceLevel: e.target.value })}
        >
          <option value="">Any</option>
          <option value="budget">Budget</option>
          <option value="mid">Mid</option>
          <option value="luxury">Luxury</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-yatra-secondary">Cuisine contains</label>
        <input
          className="w-full mt-1 border rounded-xl px-3 py-2 bg-yatra-bg"
          placeholder="e.g. South Indian"
          value={filters.cuisine}
          onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
        />
      </div>
    </aside>
  );
}
