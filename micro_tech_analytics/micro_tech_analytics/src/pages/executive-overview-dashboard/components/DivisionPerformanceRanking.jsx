import React from 'react';
import Icon from 'components/AppIcon';

const DivisionPerformanceRanking = ({ divisions, onDivisionSelect }) => {
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

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return { icon: 'TrendingUp', color: 'text-secondary' };
      case 'down':
        return { icon: 'TrendingDown', color: 'text-error' };
      default:
        return { icon: 'Minus', color: 'text-text-secondary' };
    }
  };

  const getPerformanceScore = (division) => {
    // Calculate composite performance score
    const enrollmentWeight = 0.3;
    const revenueWeight = 0.4;
    const successWeight = 0.2;
    const utilizationWeight = 0.1;

    const maxEnrollment = Math.max(...divisions.map(d => d.enrollment));
    const maxRevenue = Math.max(...divisions.map(d => d.revenue));

    const enrollmentScore = (division.enrollment / maxEnrollment) * 100;
    const revenueScore = (division.revenue / maxRevenue) * 100;
    const successScore = division.successRate;
    const utilizationScore = division.utilization;

    return (
      enrollmentScore * enrollmentWeight +
      revenueScore * revenueWeight +
      successScore * successWeight +
      utilizationScore * utilizationWeight
    );
  };

  const sortedDivisions = [...divisions].sort((a, b) => getPerformanceScore(b) - getPerformanceScore(a));

  const handleDivisionClick = (divisionId) => {
    onDivisionSelect(divisionId);
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Division Performance</h3>
          <p className="text-sm text-text-secondary">Ranked by composite performance score</p>
        </div>
        <button className="flex items-center space-x-2 px-3 py-1.5 text-sm text-primary hover:bg-primary-50 rounded-md transition-colors duration-150">
          <Icon name="BarChart3" size={14} />
          <span>View Details</span>
        </button>
      </div>

      {/* Division Rankings */}
      <div className="space-y-4">
        {sortedDivisions.map((division, index) => {
          const performanceScore = getPerformanceScore(division);
          const trendInfo = getTrendIcon(division.trend);

          return (
            <div
              key={division.id}
              onClick={() => handleDivisionClick(division.id)}
              className="p-4 border border-border rounded-lg hover:bg-background cursor-pointer transition-colors duration-150"
            >
              {/* Division Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full">
                    <span className="text-sm font-bold text-primary">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary">{division.name}</h4>
                    <div className="flex items-center space-x-2">
                      <Icon name={trendInfo.icon} size={12} className={trendInfo.color} />
                      <span className="text-xs text-text-secondary">
                        Performance Score: {performanceScore.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {division.alerts > 0 && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-error-50 rounded-full">
                    <Icon name="AlertTriangle" size={12} className="text-error" />
                    <span className="text-xs font-medium text-error">{division.alerts}</span>
                  </div>
                )}
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-sm font-medium text-text-primary">{formatNumber(division.enrollment)}</div>
                  <div className="text-xs text-text-secondary">Students</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-text-primary">{formatCurrency(division.revenue)}</div>
                  <div className="text-xs text-text-secondary">Revenue</div>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs text-text-secondary mb-1">
                    <span>Success Rate</span>
                    <span>{division.successRate}%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-1.5">
                    <div 
                      className="bg-secondary h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${division.successRate}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs text-text-secondary mb-1">
                    <span>Utilization</span>
                    <span>{division.utilization}%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-1.5">
                    <div 
                      className="bg-primary h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${division.utilization}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-primary">4</div>
            <div className="text-xs text-text-secondary">Active Divisions</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-error">3</div>
            <div className="text-xs text-text-secondary">Active Alerts</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DivisionPerformanceRanking;