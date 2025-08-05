import React from 'react';
import Icon from 'components/AppIcon';

const OperationalKPICards = () => {
  const kpiData = [
    {
      id: 'facility-utilization',
      title: 'Facility Utilization',
      value: '78.5%',
      change: '+5.2%',
      changeType: 'positive',
      status: 'good',
      icon: 'Building2',
      description: 'Current facility usage across all divisions',
      details: '42 of 54 rooms occupied'
    },
    {
      id: 'teacher-workload',
      title: 'Teacher Workload',
      value: '82.3%',
      change: '+2.1%',
      changeType: 'positive',
      status: 'warning',
      icon: 'Users',
      description: 'Average teacher utilization rate',
      details: '35 teachers active, 8 on break'
    },
    {
      id: 'equipment-availability',
      title: 'Equipment Availability',
      value: '91.2%',
      change: '-1.8%',
      changeType: 'negative',
      status: 'good',
      icon: 'Monitor',
      description: 'Operational equipment status',
      details: '156 of 171 devices functional'
    },
    {
      id: 'batch-occupancy',
      title: 'Batch Occupancy',
      value: '74.6%',
      change: '+8.4%',
      changeType: 'positive',
      status: 'good',
      icon: 'Users2',
      description: 'Student attendance in active batches',
      details: '1,247 of 1,672 seats filled'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'critical':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'good':
        return 'bg-success-50';
      case 'warning':
        return 'bg-warning-50';
      case 'critical':
        return 'bg-error-50';
      default:
        return 'bg-background';
    }
  };

  const getChangeColor = (changeType) => {
    return changeType === 'positive' ? 'text-success' : 'text-error';
  };

  const getChangeIcon = (changeType) => {
    return changeType === 'positive' ? 'TrendingUp' : 'TrendingDown';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiData.map((kpi) => (
        <div key={kpi.id} className="bg-surface rounded-lg border border-border p-6 hover:shadow-md transition-shadow duration-150">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg ${getStatusBgColor(kpi.status)} flex items-center justify-center`}>
              <Icon name={kpi.icon} size={24} className={getStatusColor(kpi.status)} />
            </div>
            <div className="flex items-center space-x-1">
              <Icon name={getChangeIcon(kpi.changeType)} size={16} className={getChangeColor(kpi.changeType)} />
              <span className={`text-sm font-medium ${getChangeColor(kpi.changeType)}`}>
                {kpi.change}
              </span>
            </div>
          </div>

          <div className="mb-2">
            <h3 className="text-sm font-medium text-text-secondary mb-1">{kpi.title}</h3>
            <div className="text-2xl font-bold text-text-primary">{kpi.value}</div>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-text-secondary">{kpi.description}</p>
            <p className="text-xs text-text-muted">{kpi.details}</p>
          </div>

          {/* Status Indicator */}
          <div className="mt-4 flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              kpi.status === 'good' ? 'bg-success' : 
              kpi.status === 'warning' ? 'bg-warning' : 'bg-error'
            }`}></div>
            <span className="text-xs text-text-secondary capitalize">{kpi.status} Status</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OperationalKPICards;