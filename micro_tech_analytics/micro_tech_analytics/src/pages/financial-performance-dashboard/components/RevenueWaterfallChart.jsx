import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Icon from 'components/AppIcon';

const RevenueWaterfallChart = ({ data }) => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showDrillDown, setShowDrillDown] = useState(false);

  // Mock course-level drill-down data
  const courseBreakdown = {
    'Jun': [
      { course: 'CAPT - Advanced Diploma', revenue: 185000, target: 200000 },
      { course: 'Fashion Designing', revenue: 125000, target: 130000 },
      { course: 'LBS Skill Training', revenue: 95000, target: 100000 },
      { course: 'Gama Abacus', revenue: 80000, target: 90000 }
    ]
  };

  const formatCurrency = (value) => {
    return `₹${(value / 100000).toFixed(1)}L`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface border border-border rounded-lg p-4 shadow-lg">
          <p className="font-semibold text-text-primary mb-2">{label} 2024</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-text-secondary">Target: </span>
              <span className="font-medium">{formatCurrency(data.target)}</span>
            </p>
            <p className="text-sm">
              <span className="text-text-secondary">Actual: </span>
              <span className="font-medium">{formatCurrency(data.actual)}</span>
            </p>
            <p className="text-sm">
              <span className="text-text-secondary">Variance: </span>
              <span className={`font-medium ${data.variance >= 0 ? 'text-secondary' : 'text-error'}`}>
                {data.variance >= 0 ? '+' : ''}{formatCurrency(data.variance)}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data) => {
    setSelectedMonth(data.month);
    setShowDrillDown(true);
  };

  const closeDrillDown = () => {
    setShowDrillDown(false);
    setSelectedMonth(null);
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Revenue Waterfall Analysis</h3>
          <p className="text-sm text-text-secondary">Monthly progression from targets to actuals</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span className="text-sm text-text-secondary">Target</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-secondary rounded"></div>
            <span className="text-sm text-text-secondary">Actual</span>
          </div>
          <button className="p-2 text-text-secondary hover:text-text-primary transition-colors duration-150">
            <Icon name="MoreHorizontal" size={16} />
          </button>
        </div>
      </div>

      <div className="h-80 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={500000} stroke="#f59e0b" strokeDasharray="5 5" />
            <Bar 
              dataKey="target" 
              fill="#1e40af" 
              opacity={0.7}
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="actual" 
              fill="#059669" 
              radius={[2, 2, 0, 0]}
              onClick={handleBarClick}
              style={{ cursor: 'pointer' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-sm text-text-secondary">Total Target</p>
          <p className="text-lg font-semibold text-text-primary">
            ₹{(data.reduce((sum, item) => sum + item.target, 0) / 100000).toFixed(1)}L
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-text-secondary">Total Actual</p>
          <p className="text-lg font-semibold text-text-primary">
            ₹{(data.reduce((sum, item) => sum + item.actual, 0) / 100000).toFixed(1)}L
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-text-secondary">Net Variance</p>
          <p className={`text-lg font-semibold ${
            data.reduce((sum, item) => sum + item.variance, 0) >= 0 ? 'text-secondary' : 'text-error'
          }`}>
            {data.reduce((sum, item) => sum + item.variance, 0) >= 0 ? '+' : ''}
            ₹{(data.reduce((sum, item) => sum + item.variance, 0) / 100000).toFixed(1)}L
          </p>
        </div>
      </div>

      {/* Drill-down Modal */}
      {showDrillDown && selectedMonth && courseBreakdown[selectedMonth] && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1000">
          <div className="bg-surface rounded-lg border border-border p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-text-primary">
                {selectedMonth} 2024 - Course Breakdown
              </h4>
              <button
                onClick={closeDrillDown}
                className="p-2 text-text-secondary hover:text-text-primary transition-colors duration-150"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            
            <div className="space-y-3">
              {courseBreakdown[selectedMonth].map((course, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background rounded-md">
                  <div>
                    <p className="font-medium text-text-primary">{course.course}</p>
                    <p className="text-sm text-text-secondary">
                      Target: {formatCurrency(course.target)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-text-primary">{formatCurrency(course.revenue)}</p>
                    <p className={`text-sm ${
                      course.revenue >= course.target ? 'text-secondary' : 'text-error'
                    }`}>
                      {course.revenue >= course.target ? '+' : ''}
                      {formatCurrency(course.revenue - course.target)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueWaterfallChart;