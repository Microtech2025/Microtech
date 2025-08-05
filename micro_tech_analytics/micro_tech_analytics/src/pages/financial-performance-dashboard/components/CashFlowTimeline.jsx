import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';


const CashFlowTimeline = ({ data }) => {
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'methods'

  const formatCurrency = (value) => {
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  // Calculate payment method breakdown
  const paymentMethodData = data.reduce((acc, item) => {
    const existing = acc.find(method => method.name === item.method);
    if (existing) {
      existing.value += item.collections;
      existing.count += 1;
    } else {
      acc.push({
        name: item.method,
        value: item.collections,
        count: 1
      });
    }
    return acc;
  }, []);

  const methodColors = {
    'Online': '#1e40af',
    'Cash': '#059669',
    'Bank Transfer': '#d97706',
    'Cheque': '#7c3aed'
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-text-primary mb-1">{formatDate(label)}</p>
          <p className="text-sm">
            <span className="text-text-secondary">Collections: </span>
            <span className="font-medium">{formatCurrency(data.collections)}</span>
          </p>
          <p className="text-sm">
            <span className="text-text-secondary">Method: </span>
            <span className="font-medium">{data.method}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-text-primary mb-1">{data.name}</p>
          <p className="text-sm">
            <span className="text-text-secondary">Amount: </span>
            <span className="font-medium">{formatCurrency(data.value)}</span>
          </p>
          <p className="text-sm">
            <span className="text-text-secondary">Transactions: </span>
            <span className="font-medium">{data.count}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const totalCollections = data.reduce((sum, item) => sum + item.collections, 0);
  const averageDaily = totalCollections / data.length;
  const highestDay = Math.max(...data.map(item => item.collections));

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Cash Flow Timeline</h3>
          <p className="text-sm text-text-secondary">Daily collection patterns with payment methods</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors duration-150 ${
              viewMode === 'timeline' ?'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-background'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setViewMode('methods')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors duration-150 ${
              viewMode === 'methods' ?'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-background'
            }`}
          >
            Methods
          </button>
        </div>
      </div>

      {viewMode === 'timeline' ? (
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={formatDate}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="collections" 
                stroke="#1e40af" 
                strokeWidth={3}
                dot={{ fill: '#1e40af', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#1e40af', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={paymentMethodData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {paymentMethodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={methodColors[entry.name]} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-sm text-text-secondary">Total Collections</p>
          <p className="text-lg font-semibold text-text-primary">{formatCurrency(totalCollections)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-text-secondary">Daily Average</p>
          <p className="text-lg font-semibold text-text-primary">{formatCurrency(averageDaily)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-text-secondary">Highest Day</p>
          <p className="text-lg font-semibold text-secondary">{formatCurrency(highestDay)}</p>
        </div>
      </div>

      {/* Payment Method Legend */}
      {viewMode === 'methods' && (
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {paymentMethodData.map((method, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: methodColors[method.name] }}
              ></div>
              <span className="text-sm text-text-secondary">{method.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CashFlowTimeline;