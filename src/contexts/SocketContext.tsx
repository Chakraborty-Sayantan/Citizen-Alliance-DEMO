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
      // Pass userId in the query to identify the user on the backend
      const newSocket = io('http://localhost:5000', {
        query: {
          userId: user._id,
        },
      });

      setSocket(newSocket);

      // Cleanup on component unmount or user logout
      return () => {
        newSocket.close();
      };
    } else {
      // If user logs out, close the existing socket
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};