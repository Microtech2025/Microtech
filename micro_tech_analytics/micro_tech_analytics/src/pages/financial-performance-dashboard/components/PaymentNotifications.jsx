import React, { useEffect, useState } from 'react';
import Icon from 'components/AppIcon';

const PaymentNotifications = ({ notifications }) => {
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    setVisibleNotifications(notifications.slice(0, 3));
  }, [notifications]);

  const removeNotification = (id) => {
    setVisibleNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      success: 'CheckCircle',
      error: 'XCircle',
      warning: 'AlertTriangle',
      info: 'Info'
    };
    return iconMap[type] || 'Info';
  };

  const getNotificationColor = (type) => {
    const colorMap = {
      success: 'bg-secondary-50 border-secondary-200 text-secondary',
      error: 'bg-error-50 border-error-200 text-error',
      warning: 'bg-warning-50 border-warning-200 text-warning',
      info: 'bg-primary-50 border-primary-200 text-primary'
    };
    return colorMap[type] || colorMap.info;
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString('en-IN');
  };

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-1000 space-y-2 max-w-sm">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg border shadow-lg animate-slide-in-right ${getNotificationColor(notification.type)}`}
        >
          <div className="flex items-start space-x-3">
            <Icon name={getNotificationIcon(notification.type)} size={20} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{notification.message}</p>
              <p className="text-xs opacity-75 mt-1">{formatTime(notification.timestamp)}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors duration-150"
            >
              <Icon name="X" size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentNotifications;