import React from 'react';
import Icon from 'components/AppIcon';

const KPIMetricsRow = ({ metrics, comparison }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-IN').format(number);
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-secondary';
      case 'down':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return 'TrendingUp';
      case 'down':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  const kpiCards = [
    {
      title: 'Total Enrollment',
      value: formatNumber(metrics.totalEnrollment.current),
      trend: metrics.totalEnrollment.trend,
      percentage: metrics.totalEnrollment.percentage,
      icon: 'Users',
      description: 'Active students across all divisions'
    },
    {
      title: 'Revenue Achievement',
      value: formatCurrency(metrics.revenueAchievement.current),
      target: formatCurrency(metrics.revenueAchievement.target),
      percentage: metrics.revenueAchievement.percentage,
      trend: 'up',
      icon: 'DollarSign',
      description: `${metrics.revenueAchievement.percentage}% of target achieved`
    },
    {
      title: 'Student Success Rate',
      value: `${metrics.studentSuccessRate.current}%`,
      trend: metrics.studentSuccessRate.trend,
      percentage: metrics.studentSuccessRate.percentage,
      icon: 'Award',
      description: 'Course completion and certification rate'
    },
    {
      title: 'Capacity Utilization',
      value: `${metrics.capacityUtilization.current}%`,
      trend: metrics.capacityUtilization.trend,
      percentage: metrics.capacityUtilization.percentage,
      icon: 'Building2',
      description: 'Infrastructure and resource utilization'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {kpiCards.map((card, index) => (
        <div key={index} className="bg-surface border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-150">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                <Icon name={card.icon} size={20} color="var(--color-primary)" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-text-secondary">{card.title}</h3>
              </div>
            </div>
            {card.trend && (
              <div className={`flex items-center space-x-1 ${getTrendColor(card.trend)}`}>
                <Icon name={getTrendIcon(card.trend)} size={16} />
                <span className="text-sm font-medium">
                  {Math.abs(card.percentage)}%
                </span>
              </div>
            )}
          </div>

          {/* Main Value */}
          <div className="mb-3">
            <div className="text-2xl font-bold text-text-primary">{card.value}</div>
            {card.target && (
              <div className="text-sm text-text-secondary">
                Target: {card.target}
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-text-secondary">{card.description}</p>

          {/* Progress Bar for Revenue Achievement */}
          {card.title === 'Revenue Achievement' && (
            <div className="mt-4">
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(card.percentage, 100)}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Sparkline placeholder for other metrics */}
          {card.title !== 'Revenue Achievement' && (
            <div className="mt-4 h-8 bg-background rounded flex items-center justify-center">
              <div className="flex items-center space-x-1">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-primary-200 rounded"
                    style={{
                      height: `${Math.random() * 20 + 8}px`,
                      opacity: card.trend === 'up' ? (i + 1) / 12 : (12 - i) / 12
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default KPIMetricsRow;