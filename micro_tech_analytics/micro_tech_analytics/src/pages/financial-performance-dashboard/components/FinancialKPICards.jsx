import React from 'react';
import Icon from 'components/AppIcon';

const FinancialKPICards = ({ data }) => {
  const kpiCards = [
    {
      title: 'Total Revenue',
      value: `₹${(data.totalRevenue / 100000).toFixed(1)}L`,
      change: '+8.2%',
      trend: 'up',
      icon: 'TrendingUp',
      color: 'primary',
      description: 'Current financial year'
    },
    {
      title: 'Collection Rate',
      value: `${data.collectionRate}%`,
      change: '+2.1%',
      trend: 'up',
      icon: 'Target',
      color: 'secondary',
      description: 'Fee collection efficiency'
    },
    {
      title: 'Outstanding Dues',
      value: `₹${(data.outstandingDues / 100000).toFixed(1)}L`,
      change: '-5.3%',
      trend: 'down',
      icon: 'AlertCircle',
      color: 'warning',
      description: 'Pending collections'
    },
    {
      title: 'Monthly Growth',
      value: `${data.monthlyGrowth}%`,
      change: '+1.8%',
      trend: 'up',
      icon: 'BarChart3',
      color: 'secondary',
      description: 'Revenue growth rate'
    },
    {
      title: 'Budget Variance',
      value: `${data.budgetVariance}%`,
      change: 'Improved',
      trend: data.budgetVariance > 0 ? 'up' : 'down',
      icon: 'PieChart',
      color: data.budgetVariance > 0 ? 'secondary' : 'error',
      description: 'vs. planned budget'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      primary: 'bg-primary-50 border-primary-200 text-primary',
      secondary: 'bg-secondary-50 border-secondary-200 text-secondary',
      warning: 'bg-warning-50 border-warning-200 text-warning',
      error: 'bg-error-50 border-error-200 text-error'
    };
    return colorMap[color] || colorMap.primary;
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 'TrendingUp' : 'TrendingDown';
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-secondary' : 'text-error';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
      {kpiCards.map((card, index) => (
        <div key={index} className="bg-surface rounded-lg border border-border p-6 hover:shadow-md transition-shadow duration-150">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(card.color)}`}>
              <Icon name={card.icon} size={24} />
            </div>
            <div className={`flex items-center space-x-1 ${getTrendColor(card.trend)}`}>
              <Icon name={getTrendIcon(card.trend)} size={16} />
              <span className="text-sm font-medium">{card.change}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-text-secondary">{card.title}</h3>
            <p className="text-2xl font-bold text-text-primary">{card.value}</p>
            <p className="text-xs text-text-muted">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FinancialKPICards;