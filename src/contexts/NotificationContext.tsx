import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSocket } from './SocketContext';
import { Notification, fetchNotifications, markAllNotificationsAsRead } from '@/lib/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socket = useSocket();
  const queryClient = useQueryClient();

  const { data: initialNotifications } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    staleTime: Infinity,
    enabled: !!socket, // only fetch when socket is ready (user is logged in)
  });

  useEffect(() => {
    if (initialNotifications) {
      setNotifications(initialNotifications);
      setUnreadCount(initialNotifications.filter(n => !n.read).length);
    }
  }, [initialNotifications]);

  useEffect(() => {
    if (socket) {
      socket.on('new_notification', (newNotification: Notification) => {
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      return () => {
        socket.off('new_notification');
      };
    }
  }, [socket]);

  const markAllAsRead = useCallback(async () => {
    if (unreadCount > 0) {
      try {
        await markAllNotificationsAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      } catch (error) {
        console.error("Failed to mark notifications as read", error);
      }
    }
  }, [unreadCount, queryClient]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};