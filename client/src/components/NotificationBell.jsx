import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';

export default function NotificationBell() {
  const [count, setCount] = useState(0);
  const { socket } = useSocket();

  const fetchCount = async () => {
    try {
      const { data } = await api.get('/api/notifications');
      const unread = data.filter((n) => !n.read).length;
      setCount(unread);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    fetchCount();
    const id = setInterval(fetchCount, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onNew = (payload) => {
      toast(payload.message || 'New YATRA update', { icon: '📬' });
      setCount((c) => c + 1);
    };
    socket.on('notification:new', onNew);
    return () => socket.off('notification:new', onNew);
  }, [socket]);

  return (
    <Link
      to="/notifications"
      className="relative p-2 text-yatra-dark hover:text-yatra-primary transition-colors"
      aria-label="Yatra notifications"
    >
      <span className="text-xl">🔔</span>
      {count > 0 && (
        <span className="absolute top-0 right-0 min-w-[18px] h-[18px] bg-yatra-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  );
}
