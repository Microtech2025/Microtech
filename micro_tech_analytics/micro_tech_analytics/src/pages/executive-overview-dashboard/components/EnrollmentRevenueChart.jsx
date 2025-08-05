import React, { useState } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from 'components/AppIcon';

const EnrollmentRevenueChart = ({ data, selectedDivision }) => {
  const [chartView, setChartView] = useState('combined');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-4 shadow-lg">
          <p className="font-medium text-text-primary mb-2">{`${label} 2024`}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm text-text-secondary">{entry.name}:</span>
              <span className="text-sm font-medium text-text-primary">
                {entry.dataKey === 'enrollment' || entry.dataKey === 'target' 
                  ? formatNumber(entry.value)
                  : formatCurrency(entry.value)
                }
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartViewOptions = [
    { value: 'combined', label: 'Combined View', icon: 'BarChart3' },
    { value: 'enrollment', label: 'Enrollment Only', icon: 'Users' },
    { value: 'revenue', label: 'Revenue Only', icon: 'DollarSign' }
  ];

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Enrollment & Revenue Trends</h3>
          <p className="text-sm text-text-secondary">Monthly performance across all divisions</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Chart View Toggle */}
          <div className="flex bg-background border border-border rounded-md p-1">
            {chartViewOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setChartView(option.value)}
                className={`flex items-center space-x-2 px-3 py-1.5 text-sm rounded transition-colors duration-150 ${
                  chartView === option.value
                    ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon name={option.icon} size={14} />
                <span className="hidden sm:inline">{option.label}</span>
              </button>
            ))}
          </div>

          {/* Drill Down Button */}
          <button className="flex items-center space-x-2 px-3 py-1.5 text-sm text-primary hover:bg-primary-50 rounded-md transition-colors duration-150">
            <Icon name="ZoomIn" size={14} />
            <span className="hidden sm:inline">Drill Down</span>
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              yAxisId="left"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              tickFormatter={formatNumber}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {(chartView === 'combined' || chartView === 'enrollment') && (
              <Bar 
                yAxisId="left"
                dataKey="enrollment" 
                fill="var(--color-primary)"
                name="Enrollment"
                radius={[4, 4, 0, 0]}
              />
            )}
            
            {(chartView === 'combined' || chartView === 'revenue') && (
              <>
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="var(--color-secondary)"
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-secondary)', strokeWidth: 2, r: 4 }}
                  name="Revenue"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="target" 
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 3 }}
                  name="Target"
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Summary */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-lg font-semibold text-text-primary">16,040</div>
          <div className="text-sm text-text-secondary">Total Enrollments (YTD)</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-secondary">₹51.2L</div>
          <div className="text-sm text-text-secondary">Total Revenue (YTD)</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-accent">96.8%</div>
          <div className="text-sm text-text-secondary">Target Achievement</div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentRevenueChart;