import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from 'components/AppIcon';

const RevenueBreakdownChart = ({ data, selectedDivision }) => {
  const [viewMode, setViewMode] = useState('stacked');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + entry.value, 0);
      
      return (
        <div className="bg-surface border border-border rounded-lg p-4 shadow-lg">
          <p className="font-medium text-text-primary mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4 mb-1">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm text-text-secondary">{entry.name}:</span>
              </div>
              <span className="text-sm font-medium text-text-primary">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
          <div className="border-t border-border pt-2 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-primary">Total:</span>
              <span className="text-sm font-bold text-text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const getCollectionRate = (category) => {
    const total = category.collected + category.pending + category.overdue;
    return total > 0 ? (category.collected / total) * 100 : 0;
  };

  const viewModeOptions = [
    { value: 'stacked', label: 'Stacked View', icon: 'BarChart3' },
    { value: 'grouped', label: 'Grouped View', icon: 'BarChart2' }
  ];

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Revenue Collection Status</h3>
          <p className="text-sm text-text-secondary">Fee collection breakdown by category</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex bg-background border border-border rounded-md p-1">
            {viewModeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setViewMode(option.value)}
                className={`flex items-center space-x-2 px-3 py-1.5 text-sm rounded transition-colors duration-150 ${
                  viewMode === option.value
                    ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon name={option.icon} size={14} />
                <span className="hidden sm:inline">{option.label}</span>
              </button>
            ))}
          </div>

          {/* Actions */}
          <button className="flex items-center space-x-2 px-3 py-1.5 text-sm text-primary hover:bg-primary-50 rounded-md transition-colors duration-150">
            <Icon name="FileText" size={14} />
            <span className="hidden sm:inline">Collection Report</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-secondary-50 border border-secondary-100 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={20} color="var(--color-secondary)" />
            </div>
            <div>
              <div className="text-lg font-bold text-secondary">{formatCurrency(data.collected)}</div>
              <div className="text-sm text-text-secondary">Collected</div>
            </div>
          </div>
        </div>

        <div className="bg-warning-50 border border-warning-100 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={20} color="var(--color-warning)" />
            </div>
            <div>
              <div className="text-lg font-bold text-warning">{formatCurrency(data.pending)}</div>
              <div className="text-sm text-text-secondary">Pending</div>
            </div>
          </div>
        </div>

        <div className="bg-error-50 border border-error-100 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-error-100 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} color="var(--color-error)" />
            </div>
            <div>
              <div className="text-lg font-bold text-error">{formatCurrency(data.overdue)}</div>
              <div className="text-sm text-text-secondary">Overdue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data.categories} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            <Bar 
              dataKey="collected" 
              stackId={viewMode === 'stacked' ? 'a' : undefined}
              fill="var(--color-secondary)"
              name="Collected"
              radius={viewMode === 'stacked' ? [0, 0, 0, 0] : [4, 4, 0, 0]}
            />
            <Bar 
              dataKey="pending" 
              stackId={viewMode === 'stacked' ? 'a' : undefined}
              fill="var(--color-warning)"
              name="Pending"
              radius={viewMode === 'stacked' ? [0, 0, 0, 0] : [4, 4, 0, 0]}
            />
            <Bar 
              dataKey="overdue" 
              stackId={viewMode === 'stacked' ? 'a' : undefined}
              fill="var(--color-error)"
              name="Overdue"
              radius={viewMode === 'stacked' ? [4, 4, 0, 0] : [4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Collection Rate Summary */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-text-primary">Collection Efficiency by Category</h4>
        {data.categories.map((category, index) => {
          const collectionRate = getCollectionRate(category);
          return (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">{category.name}</span>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-background rounded-full h-2">
                  <div 
                    className="bg-secondary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${collectionRate}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-text-primary w-12 text-right">
                  {collectionRate.toFixed(0)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RevenueBreakdownChart;