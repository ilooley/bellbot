"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";

export type NotificationType = "success" | "warning" | "error" | "info";

export interface NotificationProps {
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // Duration in milliseconds, defaults to 5000 (5 seconds)
  onClose?: () => void;
  showIcon?: boolean;
  showCloseButton?: boolean;
  autoClose?: boolean;
}

export function Notification({
  type = "info",
  title,
  message,
  duration = 5000,
  onClose,
  showIcon = true,
  showCloseButton = true,
  autoClose = true,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Handle auto-close with progress bar
  useEffect(() => {
    if (autoClose && isVisible) {
      const startTime = Date.now();
      const endTime = startTime + duration;
      
      const id = setInterval(() => {
        const now = Date.now();
        const remaining = endTime - now;
        const newProgress = Math.max(0, (remaining / duration) * 100);
        
        setProgress(newProgress);
        
        if (now >= endTime) {
          handleClose();
        }
      }, 16); // ~60fps
      
      setIntervalId(id);
      
      return () => {
        if (id) clearInterval(id);
      };
    }
  }, [autoClose, duration, isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    if (intervalId) clearInterval(intervalId);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-error" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-info" />;
    }
  };

  const getContainerClasses = () => {
    const baseClasses = "notification relative flex items-start p-4 rounded-lg shadow-md border";
    
    switch (type) {
      case "success":
        return `${baseClasses} bg-success-50 border-success-200 dark:bg-success-900/20 dark:border-success-800`;
      case "warning":
        return `${baseClasses} bg-warning-50 border-warning-200 dark:bg-warning-900/20 dark:border-warning-800`;
      case "error":
        return `${baseClasses} bg-error-50 border-error-200 dark:bg-error-900/20 dark:border-error-800`;
      case "info":
      default:
        return `${baseClasses} bg-info-50 border-info-200 dark:bg-info-900/20 dark:border-info-800`;
    }
  };

  const getTitleClasses = () => {
    switch (type) {
      case "success":
        return "text-success-800 dark:text-success-300";
      case "warning":
        return "text-warning-800 dark:text-warning-300";
      case "error":
        return "text-error-800 dark:text-error-300";
      case "info":
      default:
        return "text-info-800 dark:text-info-300";
    }
  };

  const getProgressBarClasses = () => {
    switch (type) {
      case "success":
        return "bg-success";
      case "warning":
        return "bg-warning";
      case "error":
        return "bg-error";
      case "info":
      default:
        return "bg-info";
    }
  };

  return (
    <div className={getContainerClasses()} role="alert">
      {showIcon && <div className="mr-3 flex-shrink-0">{getIcon()}</div>}
      
      <div className="flex-1">
        <h4 className={`text-sm font-semibold ${getTitleClasses()}`}>{title}</h4>
        <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">{message}</div>
      </div>
      
      {showCloseButton && (
        <button 
          onClick={handleClose} 
          className="ml-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      
      {autoClose && (
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
          <div 
            className={`h-full ${getProgressBarClasses()}`} 
            style={{ width: `${progress}%`, transition: "width 16ms linear" }}
          />
        </div>
      )}
    </div>
  );
}
