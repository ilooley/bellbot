"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { Notification, NotificationProps, NotificationType } from "./notification";
import { createPortal } from "react-dom";
import { v4 as uuidv4 } from "uuid";

// Define the notification item with an ID
interface NotificationItem extends NotificationProps {
  id: string;
}

// Define the context type
interface NotificationContextType {
  showNotification: (props: Omit<NotificationProps, "onClose">) => string;
  closeNotification: (id: string) => void;
  closeAllNotifications: () => void;
}

// Create the context with a default value
const NotificationContext = createContext<NotificationContextType>({
  showNotification: () => "",
  closeNotification: () => {},
  closeAllNotifications: () => {},
});

// Custom hook to use the notification context
export const useNotification = () => useContext(NotificationContext);

interface NotificationProviderProps {
  children: React.ReactNode;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
  maxNotifications?: number;
}

export function NotificationProvider({
  children,
  position = "top-right",
  maxNotifications = 5,
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Add a new notification
  const showNotification = useCallback((props: Omit<NotificationProps, "onClose">) => {
    const id = uuidv4();
    
    setNotifications((prev) => {
      // If we have reached the maximum number of notifications, remove the oldest one
      const updatedNotifications = prev.length >= maxNotifications 
        ? prev.slice(1) 
        : prev;
      
      return [...updatedNotifications, { ...props, id }];
    });
    
    return id;
  }, [maxNotifications]);

  // Close a specific notification
  const closeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  // Close all notifications
  const closeAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Get position classes
  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-4 left-4";
      case "top-center":
        return "top-4 left-1/2 -translate-x-1/2";
      case "top-right":
        return "top-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "bottom-center":
        return "bottom-4 left-1/2 -translate-x-1/2";
      case "bottom-right":
        return "bottom-4 right-4";
      default:
        return "top-4 right-4";
    }
  };

  // Create the value for the context provider
  const contextValue = {
    showNotification,
    closeNotification,
    closeAllNotifications,
  };

  // Render the notifications in a portal
  const renderNotifications = () => {
    if (!isMounted) return null;
    
    return createPortal(
      <div className={`fixed z-50 flex flex-col gap-2 ${getPositionClasses()} w-full max-w-sm`}>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={() => closeNotification(notification.id)}
          />
        ))}
      </div>,
      document.body
    );
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      {renderNotifications()}
    </NotificationContext.Provider>
  );
}

// Helper functions to show different types of notifications
export function useNotificationHelpers() {
  const { showNotification } = useNotification();

  const success = useCallback((title: string, message: string, options?: Partial<NotificationProps>) => {
    return showNotification({
      type: "success",
      title,
      message,
      ...options,
    });
  }, [showNotification]);

  const error = useCallback((title: string, message: string, options?: Partial<NotificationProps>) => {
    return showNotification({
      type: "error",
      title,
      message,
      ...options,
    });
  }, [showNotification]);

  const warning = useCallback((title: string, message: string, options?: Partial<NotificationProps>) => {
    return showNotification({
      type: "warning",
      title,
      message,
      ...options,
    });
  }, [showNotification]);

  const info = useCallback((title: string, message: string, options?: Partial<NotificationProps>) => {
    return showNotification({
      type: "info",
      title,
      message,
      ...options,
    });
  }, [showNotification]);

  return {
    success,
    error,
    warning,
    info,
  };
}
