import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSocket } from '../context/SocketContext';

function Recenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom ?? map.getZoom());
  }, [center, zoom, map]);
  return null;
}

const userIcon = L.divIcon({
  className: 'pulse-wrap',
  html: `<div class="pulse-dot w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const driverIcon = L.divIcon({
  html: `<div style="width:18px;height:18px;background:#E74C3C;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4)"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export default function LiveTracker({ tripId, tripName, onStop }) {
  const { socket } = useSocket();
  const [userPos, setUserPos] = useState(null);
  const [driverPos, setDriverPos] = useState(null);
  const [driverName, setDriverName] = useState('Yatra Driver');

  useEffect(() => {
    if (!socket || !tripId) return;
    socket.emit('join:trip', { tripId });
    const watchId = navigator.geolocation?.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserPos([latitude, longitude]);
        socket.emit('location:update', {
          tripId,
          lat: latitude,
          lng: longitude,
          timestamp: new Date().toISOString(),
        });
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
    const onDriver = (p) => {
      setDriverPos([p.lat, p.lng]);
      if (p.driverName) setDriverName(p.driverName);
    };
    const onLoc = (p) => {
      /* other clients' location — optional */
    };
    socket.on('driver:moved', onDriver);
    socket.on('location:changed', onLoc);
    return () => {
      socket.emit('leave:trip', { tripId });
      socket.off('driver:moved', onDriver);
      socket.off('location:changed', onLoc);
      if (watchId != null) navigator.geolocation.clearWatch(watchId);
    };
  }, [socket, tripId]);

  const center = useMemo(() => {
    if (userPos) return userPos;
    if (driverPos) return driverPos;
    return [17.385, 78.4867];
  }, [userPos, driverPos]);

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-yatra-dark">
      <div className="flex items-center justify-between px-4 py-3 bg-yatra-bg/95 border-b border-yatra-primary/20 shadow">
        <div>
          <p className="text-xs text-yatra-secondary font-semibold">YATRA Live</p>
          <h1 className="font-display font-bold text-yatra-dark">
            Tracking Your Yatra 📍 · {tripName}
          </h1>
        </div>
        <button
          type="button"
          onClick={onStop}
          className="text-sm font-semibold text-white bg-yatra-danger px-4 py-2 rounded-xl"
        >
          🔴 Stop Tracking
        </button>
      </div>
      <div className="flex-1 relative">
        <MapContainer
          center={center}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom
        >
          <TileLayer
            attribution="© OpenStreetMap contributors | Yatra"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Recenter center={center} />
          {userPos && (
            <Marker position={userPos} icon={userIcon}>
              <Popup>You · YATRA traveller</Popup>
            </Marker>
          )}
          {driverPos && <Marker position={driverPos} icon={driverIcon} />}
        </MapContainer>
      </div>
      <div className="bg-yatra-bg border-t border-yatra-primary/20 p-4 shadow-[0_-8px_30px_rgba(0,0,0,.08)]">
        <p className="font-semibold text-yatra-dark">Driver: {driverName}</p>
        <p className="text-sm text-yatra-secondary">Vehicle & ETA shown after YatraPay confirmation</p>
        <p className="text-xs text-yatra-dark/50 mt-2">Map data © OpenStreetMap · YATRA offline-first demo</p>
      </div>
    </div>
  );
}
