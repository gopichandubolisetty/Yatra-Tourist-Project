import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LiveTracker from '../components/LiveTracker';
import api from '../services/api';

export default function LiveTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('Yatra');

  useEffect(() => {
    api
      .get(`/api/trips/${id}`)
      .then(({ data }) => setName(data.name))
      .catch(() => navigate('/dashboard'));
  }, [id, navigate]);

  return (
    <LiveTracker tripId={id} tripName={name} onStop={() => navigate(`/trips/${id}`)} />
  );
}
