import React, { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user?._id) {
      const newSocket = io('http://localhost:5000');
      
      newSocket.on('connect', () => {
        newSocket.emit('register', user._id);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else if (socket) {
      socket.close();
      setSocket(null);
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};