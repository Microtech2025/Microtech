import React from 'react';
import Icon from 'components/AppIcon';

const KPIMetricsStrip = ({ metrics }) => {
  const kpiCards = [
    {
      id: 'enrollments',
      title: 'Active Enrollments',
      value: metrics.activeEnrollments.toLocaleString('en-IN'),
      change: '+12.5%',
      changeType: 'positive',
      icon: 'Users',
      color: 'primary'
    },
    {
      id: 'attendance',
      title: 'Attendance Rate',
      value: `${metrics.attendanceRate}%`,
      change: '+2.3%',
      changeType: 'positive',
      icon: 'Calendar',
      color: 'secondary'
    },
    {
      id: 'performance',
      title: 'Academic Performance',
      value: `${metrics.academicPerformance}%`,
      change: '-1.2%',
      changeType: 'negative',
      icon: 'TrendingUp',
      color: 'accent'
    },
    {
      id: 'dropout',
      title: 'Dropout Risk Alerts',
      value: metrics.dropoutRiskAlerts,
      change: '-8.7%',
      changeType: 'positive',
      icon: 'AlertTriangle',
      color: 'error'
    },
    {
      id: 'placement',
      title: 'Placement Rate',
      value: `${metrics.placementRate}%`,
      change: '+5.4%',
      changeType: 'positive',
      icon: 'Briefcase',
      color: 'secondary'
    },
    {
      id: 'satisfaction',
      title: 'Student Satisfaction',
      value: `${metrics.studentSatisfaction}/5.0`,
      change: '+0.3',
      changeType: 'positive',
      icon: 'Star',
      color: 'accent'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      primary: 'bg-primary-50 text-primary border-primary-200',
      secondary: 'bg-secondary-50 text-secondary border-secondary-200',
      accent: 'bg-accent-50 text-accent border-accent-200',
      error: 'bg-error-50 text-error border-error-200'
    };
    return colorMap[color] || colorMap.primary;
  };

  const getChangeColorClasses = (changeType) => {
    return changeType === 'positive' ?'text-secondary bg-secondary-50' :'text-error bg-error-50';
  };

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((card) => (
          <div key={card.id} className="bg-surface rounded-lg border border-border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${getColorClasses(card.color)}`}>
                <Icon name={card.icon} size={20} />
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getChangeColorClasses(card.changeType)}`}>
                {card.change}
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-text-primary">{card.value}</h3>
              <p className="text-sm text-text-secondary">{card.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KPIMetricsStrip;