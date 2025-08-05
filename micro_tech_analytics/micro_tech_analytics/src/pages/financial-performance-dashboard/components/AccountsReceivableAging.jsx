import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from 'components/AppIcon';

const AccountsReceivableAging = ({ data }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);

  const formatCurrency = (value) => {
    return `₹${(value / 100000).toFixed(1)}L`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface border border-border rounded-lg p-4 shadow-lg">
          <p className="font-semibold text-text-primary mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-text-secondary">Amount: </span>
              <span className="font-medium">{formatCurrency(data.amount)}</span>
            </p>
            <p className="text-sm">
              <span className="text-text-secondary">Students: </span>
              <span className="font-medium">{data.count}</span>
            </p>
            <p className="text-sm">
              <span className="text-text-secondary">Avg per student: </span>
              <span className="font-medium">{formatCurrency(data.amount / data.count)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data) => {
    setSelectedCategory(data);
    setShowFollowUpModal(true);
  };

  const closeFollowUpModal = () => {
    setShowFollowUpModal(false);
    setSelectedCategory(null);
  };

  const getFollowUpActions = (category) => {
    const actionMap = {
      '0-30 Days': [
        { action: 'Send Payment Reminder', icon: 'Mail', color: 'primary' },
        { action: 'WhatsApp Notification', icon: 'MessageCircle', color: 'secondary' }
      ],
      '31-60 Days': [
        { action: 'Phone Call Follow-up', icon: 'Phone', color: 'warning' },
        { action: 'Email with Payment Plan', icon: 'Mail', color: 'primary' },
        { action: 'SMS Alert', icon: 'MessageSquare', color: 'secondary' }
      ],
      '61-90 Days': [
        { action: 'Urgent Phone Call', icon: 'PhoneCall', color: 'error' },
        { action: 'Final Notice Email', icon: 'AlertTriangle', color: 'warning' },
        { action: 'Parent/Guardian Contact', icon: 'Users', color: 'primary' }
      ],
      '90+ Days': [
        { action: 'Legal Notice', icon: 'FileText', color: 'error' },
        { action: 'Account Suspension', icon: 'Ban', color: 'error' },
        { action: 'Collection Agency', icon: 'Building', color: 'warning' }
      ]
    };
    return actionMap[category] || [];
  };

  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Accounts Receivable Aging</h3>
          <p className="text-sm text-text-secondary">Overdue amounts categorized by time periods</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-text-secondary">Total Outstanding</p>
            <p className="text-lg font-semibold text-text-primary">{formatCurrency(totalAmount)}</p>
          </div>
          <button className="p-2 text-text-secondary hover:text-text-primary transition-colors duration-150">
            <Icon name="MoreHorizontal" size={16} />
          </button>
        </div>
      </div>

      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            layout="horizontal"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={formatCurrency}
            />
            <YAxis 
              type="category"
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="amount" 
              fill={(entry) => entry.color}
              radius={[0, 4, 4, 0]}
              onClick={handleBarClick}
              style={{ cursor: 'pointer' }}
            >
              {data.map((entry, index) => (
                <Bar key={`bar-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Aging Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {data.map((item, index) => (
          <div 
            key={index} 
            className="p-4 bg-background rounded-lg border border-border hover:shadow-sm transition-shadow duration-150 cursor-pointer"
            onClick={() => handleBarClick(item)}
          >
            <div className="flex items-center justify-between mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <Icon name="ChevronRight" size={14} className="text-text-muted" />
            </div>
            <p className="text-xs text-text-secondary mb-1">{item.category}</p>
            <p className="text-lg font-semibold text-text-primary">{formatCurrency(item.amount)}</p>
            <p className="text-xs text-text-muted">{item.count} students</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
        <button className="flex items-center space-x-2 px-3 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary-600 transition-colors duration-150">
          <Icon name="Send" size={14} />
          <span>Send Bulk Reminders</span>
        </button>
        <button className="flex items-center space-x-2 px-3 py-2 bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-background rounded-md text-sm transition-colors duration-150">
          <Icon name="Download" size={14} />
          <span>Export Report</span>
        </button>
        <button className="flex items-center space-x-2 px-3 py-2 bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-background rounded-md text-sm transition-colors duration-150">
          <Icon name="Calendar" size={14} />
          <span>Schedule Follow-up</span>
        </button>
      </div>

      {/* Follow-up Actions Modal */}
      {showFollowUpModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1000">
          <div className="bg-surface rounded-lg border border-border p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-text-primary">
                Follow-up Actions - {selectedCategory.category}
              </h4>
              <button
                onClick={closeFollowUpModal}
                className="p-2 text-text-secondary hover:text-text-primary transition-colors duration-150"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            
            <div className="mb-4 p-4 bg-background rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-text-secondary">Amount</p>
                  <p className="text-lg font-semibold text-text-primary">
                    {formatCurrency(selectedCategory.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Students</p>
                  <p className="text-lg font-semibold text-text-primary">
                    {selectedCategory.count}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="font-medium text-text-primary">Recommended Actions:</h5>
              {getFollowUpActions(selectedCategory.category).map((action, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center space-x-3 p-3 rounded-md text-left transition-colors duration-150 ${
                    action.color === 'primary' ? 'bg-primary-50 hover:bg-primary-100 text-primary' :
                    action.color === 'secondary' ? 'bg-secondary-50 hover:bg-secondary-100 text-secondary' :
                    action.color === 'warning' ? 'bg-warning-50 hover:bg-warning-100 text-warning' :
                    action.color === 'error'? 'bg-error-50 hover:bg-error-100 text-error' : 'bg-background hover:bg-border text-text-primary'
                  }`}
                >
                  <Icon name={action.icon} size={16} />
                  <span className="font-medium">{action.action}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsReceivableAging;