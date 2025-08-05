import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const AlertsPanel = ({ alerts, selectedDivision }) => {
  const [alertFilter, setAlertFilter] = useState('all');

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error':
        return { icon: 'AlertCircle', color: 'text-error' };
      case 'warning':
        return { icon: 'AlertTriangle', color: 'text-warning' };
      case 'info':
        return { icon: 'Info', color: 'text-primary' };
      default:
        return { icon: 'Bell', color: 'text-text-secondary' };
    }
  };

  const getAlertBgColor = (type) => {
    switch (type) {
      case 'error':
        return 'bg-error-50 border-error-100';
      case 'warning':
        return 'bg-warning-50 border-warning-100';
      case 'info':
        return 'bg-primary-50 border-primary-100';
      default:
        return 'bg-background border-border';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (alertFilter === 'all') return true;
    if (alertFilter === 'division' && selectedDivision !== 'all') {
      return alert.division === selectedDivision || alert.division === 'all';
    }
    return alert.type === alertFilter;
  });

  const alertFilterOptions = [
    { value: 'all', label: 'All Alerts', count: alerts.length },
    { value: 'error', label: 'Critical', count: alerts.filter(a => a.type === 'error').length },
    { value: 'warning', label: 'Warning', count: alerts.filter(a => a.type === 'warning').length },
    { value: 'info', label: 'Info', count: alerts.filter(a => a.type === 'info').length }
  ];

  const handleAlertClick = (alertId) => {
    console.log('Alert clicked:', alertId);
    // Handle alert click - could open detailed view or mark as read
  };

  const handleMarkAllRead = () => {
    console.log('Mark all alerts as read');
    // Handle marking all alerts as read
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">System Alerts</h3>
          <p className="text-sm text-text-secondary">Real-time notifications and warnings</p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:bg-background rounded-md transition-colors duration-150"
        >
          <Icon name="CheckCheck" size={14} />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Alert Filter Tabs */}
      <div className="flex space-x-1 mb-4 bg-background rounded-md p-1">
        {alertFilterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setAlertFilter(option.value)}
            className={`flex items-center space-x-2 px-3 py-2 text-sm rounded transition-colors duration-150 flex-1 justify-center ${
              alertFilter === option.value
                ? 'bg-surface text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <span>{option.label}</span>
            {option.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                alertFilter === option.value
                  ? 'bg-primary text-white' :'bg-text-secondary text-white'
              }`}>
                {option.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => {
            const alertIcon = getAlertIcon(alert.type);
            const alertBgColor = getAlertBgColor(alert.type);

            return (
              <div
                key={alert.id}
                onClick={() => handleAlertClick(alert.id)}
                className={`p-4 border rounded-lg cursor-pointer hover:shadow-sm transition-all duration-150 ${alertBgColor}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Icon name={alertIcon.icon} size={16} className={alertIcon.color} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-text-primary truncate">
                        {alert.title}
                      </h4>
                      <span className="text-xs text-text-secondary flex-shrink-0 ml-2">
                        {formatTimeAgo(alert.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {alert.message}
                    </p>
                    
                    {alert.division !== 'all' && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 text-xs bg-background rounded-full">
                          <Icon name="Building2" size={10} className="mr-1" />
                          {alert.division.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Bell" size={24} className="text-text-secondary" />
            </div>
            <p className="text-text-secondary">No alerts to display</p>
            <p className="text-sm text-text-secondary mt-1">
              {alertFilter !== 'all' ? `No ${alertFilter} alerts found` : 'All systems operating normally'}
            </p>
          </div>
        )}
      </div>

      {/* Alert Summary */}
      {filteredAlerts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">
              Showing {filteredAlerts.length} of {alerts.length} alerts
            </span>
            <button className="text-primary hover:text-primary-600 transition-colors duration-150">
              View All Alerts
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;