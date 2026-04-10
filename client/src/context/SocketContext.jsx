import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const url = import.meta.env.VITE_API_URL || window.location.origin;
    const s = io(url, {
      transports: ['websocket', 'polling'],
      path: '/socket.io',
    });
    setSocket(s);
    s.on('connect', () => setConnected(true));
    s.on('disconnect', () => setConnected(false));
    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, []);

  useEffect(() => {
    if (!socket || !isAuthenticated) return;
    const token = localStorage.getItem('yatra_token');
    if (token) socket.emit('authenticate', { token });
  }, [socket, isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
