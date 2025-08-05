import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const LiveAlertsPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');

  // Mock alerts data
  const mockAlerts = [
    {
      id: 1,
      type: 'equipment',
      priority: 'high',
      title: 'Projector Malfunction',
      description: 'Projector in CAPT Lab 2 is not responding',
      location: 'CAPT Lab 2',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      status: 'unassigned',
      assignedTo: null,
      estimatedResolution: '15 minutes'
    },
    {
      id: 2,
      type: 'schedule',
      priority: 'medium',
      title: 'Room Double Booking',
      description: 'Fashion Studio has conflicting bookings at 2:00 PM',
      location: 'Fashion Studio',
      timestamp: new Date(Date.now() - 600000), // 10 minutes ago
      status: 'in-progress',
      assignedTo: 'Admin Team',
      estimatedResolution: '10 minutes'
    },
    {
      id: 3,
      type: 'maintenance',
      priority: 'low',
      title: 'AC Filter Replacement',
      description: 'Air conditioning filter needs replacement in LBS Workshop',
      location: 'LBS Workshop',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      status: 'assigned',
      assignedTo: 'Maintenance Team',
      estimatedResolution: '2 hours'
    },
    {
      id: 4,
      type: 'capacity',
      priority: 'high',
      title: 'Overcapacity Alert',
      description: 'Gama Room 1 exceeds safe capacity limits',
      location: 'Gama Room 1',
      timestamp: new Date(Date.now() - 120000), // 2 minutes ago
      status: 'unassigned',
      assignedTo: null,
      estimatedResolution: 'Immediate'
    },
    {
      id: 5,
      type: 'equipment',
      priority: 'medium',
      title: 'Computer Slow Performance',
      description: 'Multiple computers in CAPT Lab 1 running slowly',
      location: 'CAPT Lab 1',
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      status: 'resolved',
      assignedTo: 'IT Support',
      estimatedResolution: 'Completed'
    }
  ];

  useEffect(() => {
    setAlerts(mockAlerts);
  }, []);

  const filterOptions = [
    { value: 'all', label: 'All Alerts', count: mockAlerts.length },
    { value: 'high', label: 'High Priority', count: mockAlerts.filter(a => a.priority === 'high').length },
    { value: 'unassigned', label: 'Unassigned', count: mockAlerts.filter(a => a.status === 'unassigned').length },
    { value: 'in-progress', label: 'In Progress', count: mockAlerts.filter(a => a.status === 'in-progress').length }
  ];

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'high') return alert.priority === 'high';
    if (filter === 'unassigned') return alert.status === 'unassigned';
    if (filter === 'in-progress') return alert.status === 'in-progress';
    return true;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-text-secondary';
    }
  };

  const getPriorityBgColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-error-50 border-error-200';
      case 'medium':
        return 'bg-warning-50 border-warning-200';
      case 'low':
        return 'bg-success-50 border-success-200';
      default:
        return 'bg-background border-border';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'text-success bg-success-100';
      case 'in-progress':
        return 'text-warning bg-warning-100';
      case 'assigned':
        return 'text-primary bg-primary-100';
      case 'unassigned':
        return 'text-error bg-error-100';
      default:
        return 'text-text-secondary bg-background';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'equipment':
        return 'Monitor';
      case 'schedule':
        return 'Calendar';
      case 'maintenance':
        return 'Wrench';
      case 'capacity':
        return 'Users';
      default:
        return 'AlertTriangle';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleAssignAlert = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'assigned', assignedTo: 'Operations Team' }
        : alert
    ));
  };

  const handleResolveAlert = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'resolved' }
        : alert
    ));
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">Live Alerts</h2>
          <p className="text-text-secondary">Real-time operational notifications</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
          <span className="text-sm text-text-secondary">Live</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${
              filter === option.value
                ? 'bg-primary text-white' :'bg-background text-text-secondary hover:text-text-primary hover:bg-border'
            }`}
          >
            <span>{option.label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
              filter === option.value
                ? 'bg-white bg-opacity-20 text-white' :'bg-text-muted text-white'
            }`}>
              {option.count}
            </span>
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
            <p className="text-text-secondary">No alerts matching current filter</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-lg p-4 ${getPriorityBgColor(alert.priority)} hover:shadow-md transition-shadow duration-150`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    alert.priority === 'high' ? 'bg-error-100' :
                    alert.priority === 'medium' ? 'bg-warning-100' : 'bg-success-100'
                  }`}>
                    <Icon 
                      name={getAlertIcon(alert.type)} 
                      size={16} 
                      className={getPriorityColor(alert.priority)}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-text-primary">{alert.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(alert.status)}`}>
                        {alert.status.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mb-2">{alert.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-text-muted">
                      <div className="flex items-center space-x-1">
                        <Icon name="MapPin" size={12} />
                        <span>{alert.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={12} />
                        <span>{formatTimeAgo(alert.timestamp)}</span>
                      </div>
                      {alert.assignedTo && (
                        <div className="flex items-center space-x-1">
                          <Icon name="User" size={12} />
                          <span>{alert.assignedTo}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <span className={`w-2 h-2 rounded-full ${
                    alert.priority === 'high' ? 'bg-error' :
                    alert.priority === 'medium' ? 'bg-warning' : 'bg-success'
                  }`}></span>
                </div>
              </div>

              {/* Alert Actions */}
              {alert.status !== 'resolved' && (
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="text-xs text-text-secondary">
                    ETA: {alert.estimatedResolution}
                  </div>
                  <div className="flex items-center space-x-2">
                    {alert.status === 'unassigned' && (
                      <button
                        onClick={() => handleAssignAlert(alert.id)}
                        className="px-3 py-1 bg-primary text-white text-xs rounded-md hover:bg-primary-600 transition-colors duration-150"
                      >
                        Assign
                      </button>
                    )}
                    <button
                      onClick={() => handleResolveAlert(alert.id)}
                      className="px-3 py-1 bg-success text-white text-xs rounded-md hover:bg-success-600 transition-colors duration-150"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Quick Actions</span>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded-md transition-colors duration-150">
              <Icon name="Settings" size={16} />
            </button>
            <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded-md transition-colors duration-150">
              <Icon name="Bell" size={16} />
            </button>
            <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded-md transition-colors duration-150">
              <Icon name="Download" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveAlertsPanel;