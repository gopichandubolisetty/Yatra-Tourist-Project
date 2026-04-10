import { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function saffronIcon() {
  return L.divIcon({
    className: 'custom-pin',
    html: `<div style="width:22px;height:22px;background:#FF6B00;border:2px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}
function tealIcon() {
  return L.divIcon({
    className: 'custom-pin',
    html: `<div style="width:22px;height:22px;background:#006B6B;border:2px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}
function orangeIcon() {
  return L.divIcon({
    className: 'custom-pin',
    html: `<div style="width:20px;height:20px;background:#f97316;border:2px solid #fff;border-radius:50%"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}
function purpleIcon() {
  return L.divIcon({
    className: 'custom-pin',
    html: `<div style="width:18px;height:18px;background:#7c3aed;border:2px solid #fff;border-radius:50%"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (!positions?.length) return;
    const pts = positions.map((p) => [p[0], p[1]]);
    if (pts.length === 1) {
      map.setView(pts[0], 13);
      return;
    }
    const b = L.latLngBounds(pts);
    map.fitBounds(b, { padding: [40, 40], maxZoom: 14 });
  }, [map, positions]);
  return null;
}

export default function MapView({
  center = [17.385, 78.4867],
  zoom = 12,
  height = '320px',
  markers = [],
  polyline = null,
  scrollWheelZoom = true,
}) {
  const positions = [
    ...markers.map((m) => [m.position[0], m.position[1]]),
    ...(polyline || []).map((p) => [p.lat, p.lng]),
  ];

  const iconFor = (type) => {
    if (type === 'pickup') return saffronIcon();
    if (type === 'dropoff') return tealIcon();
    if (type === 'poi') return purpleIcon();
    return orangeIcon();
  };

  return (
    <div style={{ height }} className="rounded-xl overflow-hidden border border-yatra-secondary/20 shadow-yatra">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={scrollWheelZoom}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors | Yatra"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {positions.length > 0 && <FitBounds positions={positions} />}
        {polyline && polyline.length > 1 && (
          <Polyline
            positions={polyline.map((p) => [p.lat, p.lng])}
            pathOptions={{ color: '#FF6B00', weight: 4, opacity: 0.85 }}
          />
        )}
        {markers.map((m, i) => (
          <Marker key={m.key ?? i} position={m.position} icon={iconFor(m.type)}>
            {m.label && <Popup>{m.label}</Popup>}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
