import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from 'components/AppIcon';

const UtilizationChart = ({ selectedFacility }) => {
  const [chartType, setChartType] = useState('hourly');
  const [selectedMetric, setSelectedMetric] = useState('utilization');

  // Mock hourly utilization data
  const hourlyData = [
    { time: '09:00', utilization: 45, capacity: 100, peakHour: false },
    { time: '10:00', utilization: 78, capacity: 100, peakHour: true },
    { time: '11:00', utilization: 85, capacity: 100, peakHour: true },
    { time: '12:00', utilization: 62, capacity: 100, peakHour: false },
    { time: '13:00', utilization: 35, capacity: 100, peakHour: false },
    { time: '14:00', utilization: 72, capacity: 100, peakHour: false },
    { time: '15:00', utilization: 88, capacity: 100, peakHour: true },
    { time: '16:00', utilization: 92, capacity: 100, peakHour: true },
    { time: '17:00', utilization: 76, capacity: 100, peakHour: false },
    { time: '18:00', utilization: 68, capacity: 100, peakHour: false },
    { time: '19:00', utilization: 54, capacity: 100, peakHour: false },
    { time: '20:00', utilization: 28, capacity: 100, peakHour: false }
  ];

  // Mock daily utilization data
  const dailyData = [
    { day: 'Mon', utilization: 78, capacity: 100, efficiency: 85 },
    { day: 'Tue', utilization: 82, capacity: 100, efficiency: 88 },
    { day: 'Wed', utilization: 75, capacity: 100, efficiency: 82 },
    { day: 'Thu', utilization: 88, capacity: 100, efficiency: 91 },
    { day: 'Fri', utilization: 85, capacity: 100, efficiency: 89 },
    { day: 'Sat', utilization: 65, capacity: 100, efficiency: 72 },
    { day: 'Sun', utilization: 45, capacity: 100, efficiency: 58 }
  ];

  const chartData = chartType === 'hourly' ? hourlyData : dailyData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-md">
          <p className="font-medium text-text-primary mb-2">
            {chartType === 'hourly' ? `Time: ${label}` : `Day: ${label}`}
          </p>
          <div className="space-y-1">
            <div className="flex items-center justify-between space-x-4">
              <span className="text-sm text-text-secondary">Utilization:</span>
              <span className="text-sm font-medium text-primary">{data.utilization}%</span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-sm text-text-secondary">Capacity:</span>
              <span className="text-sm font-medium text-text-primary">{data.capacity}%</span>
            </div>
            {data.efficiency && (
              <div className="flex items-center justify-between space-x-4">
                <span className="text-sm text-text-secondary">Efficiency:</span>
                <span className="text-sm font-medium text-secondary">{data.efficiency}%</span>
              </div>
            )}
            {data.peakHour && (
              <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-border">
                <Icon name="TrendingUp" size={14} className="text-warning" />
                <span className="text-xs text-warning font-medium">Peak Hour</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const getPeakHours = () => {
    return hourlyData.filter(item => item.peakHour).map(item => item.time);
  };

  const getAverageUtilization = () => {
    const total = chartData.reduce((sum, item) => sum + item.utilization, 0);
    return Math.round(total / chartData.length);
  };

  const getCapacityInsights = () => {
    const avgUtilization = getAverageUtilization();
    if (avgUtilization >= 85) return { status: 'high', message: 'High utilization - consider capacity expansion' };
    if (avgUtilization >= 70) return { status: 'optimal', message: 'Optimal utilization levels' };
    return { status: 'low', message: 'Low utilization - opportunities for improvement' };
  };

  const capacityInsight = getCapacityInsights();

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="mb-4 lg:mb-0">
          <h2 className="text-xl font-semibold text-text-primary mb-2">Utilization Patterns</h2>
          <p className="text-text-secondary">Track facility usage patterns and identify peak hours</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Chart Type Toggle */}
          <div className="flex items-center space-x-1 bg-background rounded-lg p-1">
            <button
              onClick={() => setChartType('hourly')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150 ${
                chartType === 'hourly' ?'bg-surface text-primary border border-primary-200' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              Hourly
            </button>
            <button
              onClick={() => setChartType('daily')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150 ${
                chartType === 'daily' ?'bg-surface text-primary border border-primary-200' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              Daily
            </button>
          </div>

          {/* Metric Selector */}
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="bg-surface border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="utilization">Utilization Rate</option>
            <option value="efficiency">Efficiency Score</option>
            <option value="capacity">Capacity Usage</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'hourly' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="utilization"
                stroke="#1e40af"
                strokeWidth={3}
                dot={{ fill: '#1e40af', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#1e40af', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="capacity"
                stroke="#e5e7eb"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="day" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="utilization" fill="#1e40af" radius={[4, 4, 0, 0]} />
              {selectedMetric === 'efficiency' && (
                <Bar dataKey="efficiency" fill="#059669" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Insights Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Average Utilization */}
        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
              <Icon name="BarChart3" size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Average Utilization</p>
              <p className="text-xl font-bold text-text-primary">{getAverageUtilization()}%</p>
            </div>
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={16} className="text-warning" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Peak Hours</p>
              <p className="text-sm font-medium text-text-primary">
                {chartType === 'hourly' ? getPeakHours().join(', ') : 'Thu, Fri'}
              </p>
            </div>
          </div>
        </div>

        {/* Capacity Insight */}
        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              capacityInsight.status === 'high' ? 'bg-error-100' :
              capacityInsight.status === 'optimal' ? 'bg-success-100' : 'bg-warning-100'
            }`}>
              <Icon 
                name="AlertCircle" 
                size={16} 
                className={
                  capacityInsight.status === 'high' ? 'text-error' :
                  capacityInsight.status === 'optimal' ? 'text-success' : 'text-warning'
                }
              />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Capacity Status</p>
              <p className="text-xs text-text-primary">{capacityInsight.message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UtilizationChart;