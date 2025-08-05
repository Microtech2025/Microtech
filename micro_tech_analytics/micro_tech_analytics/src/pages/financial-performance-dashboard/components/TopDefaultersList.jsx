import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const TopDefaultersList = ({ data }) => {
  const [selectedDefaulter, setSelectedDefaulter] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactType, setContactType] = useState('');

  const formatCurrency = (value) => {
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Pending Response': 'bg-warning-50 text-warning border-warning-200',
      'Payment Promised': 'bg-secondary-50 text-secondary border-secondary-200',
      'No Response': 'bg-error-50 text-error border-error-200',
      'Partial Payment': 'bg-primary-50 text-primary border-primary-200'
    };
    return statusColors[status] || 'bg-background text-text-secondary border-border';
  };

  const getPriorityLevel = (daysPending) => {
    if (daysPending >= 90) return { level: 'Critical', color: 'text-error', icon: 'AlertTriangle' };
    if (daysPending >= 60) return { level: 'High', color: 'text-warning', icon: 'AlertCircle' };
    if (daysPending >= 30) return { level: 'Medium', color: 'text-accent', icon: 'Clock' };
    return { level: 'Low', color: 'text-secondary', icon: 'Info' };
  };

  const handleContactAction = (defaulter, type) => {
    setSelectedDefaulter(defaulter);
    setContactType(type);
    setShowContactModal(true);
  };

  const closeContactModal = () => {
    setShowContactModal(false);
    setSelectedDefaulter(null);
    setContactType('');
  };

  const executeContactAction = () => {
    // Simulate contact action
    console.log(`Executing ${contactType} for ${selectedDefaulter.studentName}`);
    closeContactModal();
  };

  const getContactMessage = (type, defaulter) => {
    const messages = {
      sms: `Dear ${defaulter.studentName}, your fee payment of ${formatCurrency(defaulter.outstandingAmount)} for ${defaulter.course} is pending for ${defaulter.daysPending} days. Please make the payment at the earliest. - Micro Tech Analytics`,
      email: `Subject: Fee Payment Reminder - ${defaulter.course}

Dear ${defaulter.studentName},

This is a friendly reminder that your fee payment of ${formatCurrency(defaulter.outstandingAmount)} for ${defaulter.course} has been pending for ${defaulter.daysPending} days.

Please make the payment at your earliest convenience to avoid any disruption in your studies.

For any queries, please contact our finance department.

Best regards,
Micro Tech Analytics Team`,
      whatsapp: `Hi ${defaulter.studentName}! 👋

Your fee payment of ${formatCurrency(defaulter.outstandingAmount)} for ${defaulter.course} is pending for ${defaulter.daysPending} days.

Please make the payment soon to continue your studies without interruption.

Need help? Reply to this message! 📞

- Micro Tech Analytics`
    };
    return messages[type] || '';
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Top Defaulters</h3>
          <p className="text-sm text-text-secondary">Students with highest outstanding amounts</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-text-secondary hover:text-text-primary transition-colors duration-150">
            <Icon name="Filter" size={16} />
          </button>
          <button className="p-2 text-text-secondary hover:text-text-primary transition-colors duration-150">
            <Icon name="MoreHorizontal" size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((defaulter, index) => {
          const priority = getPriorityLevel(defaulter.daysPending);
          
          return (
            <div key={defaulter.id} className="p-4 bg-background rounded-lg border border-border hover:shadow-sm transition-shadow duration-150">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {defaulter.studentName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">{defaulter.studentName}</h4>
                    <p className="text-sm text-text-secondary">{defaulter.course}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name={priority.icon} size={16} className={priority.color} />
                  <span className={`text-xs font-medium ${priority.color}`}>{priority.level}</span>
                </div>
              </div>

              {/* Amount and Status */}
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-text-secondary">Outstanding Amount</p>
                  <p className="text-lg font-bold text-error">{formatCurrency(defaulter.outstandingAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Days Pending</p>
                  <p className="text-lg font-bold text-text-primary">{defaulter.daysPending}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-text-secondary">Last Contact</p>
                  <p className="text-sm font-medium text-text-primary">{formatDate(defaulter.lastContact)}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(defaulter.contactStatus)}`}>
                  {defaulter.contactStatus}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleContactAction(defaulter, 'sms')}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-primary text-white rounded-md text-xs hover:bg-primary-600 transition-colors duration-150"
                >
                  <Icon name="MessageSquare" size={12} />
                  <span>SMS</span>
                </button>
                <button
                  onClick={() => handleContactAction(defaulter, 'email')}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-secondary text-white rounded-md text-xs hover:bg-secondary-600 transition-colors duration-150"
                >
                  <Icon name="Mail" size={12} />
                  <span>Email</span>
                </button>
                <button
                  onClick={() => handleContactAction(defaulter, 'whatsapp')}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-accent text-white rounded-md text-xs hover:bg-accent-600 transition-colors duration-150"
                >
                  <Icon name="MessageCircle" size={12} />
                  <span>WhatsApp</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-1.5 bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-background rounded-md text-xs transition-colors duration-150">
                  <Icon name="Phone" size={12} />
                  <span>Call</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-text-secondary">Total Outstanding</p>
            <p className="text-lg font-semibold text-error">
              {formatCurrency(data.reduce((sum, item) => sum + item.outstandingAmount, 0))}
            </p>
          </div>
          <div>
            <p className="text-sm text-text-secondary">Avg Days Pending</p>
            <p className="text-lg font-semibold text-text-primary">
              {Math.round(data.reduce((sum, item) => sum + item.daysPending, 0) / data.length)}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Action Modal */}
      {showContactModal && selectedDefaulter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1000">
          <div className="bg-surface rounded-lg border border-border p-6 max-w-lg w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-text-primary">
                Send {contactType.toUpperCase()} to {selectedDefaulter.studentName}
              </h4>
              <button
                onClick={closeContactModal}
                className="p-2 text-text-secondary hover:text-text-primary transition-colors duration-150"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            
            <div className="mb-4 p-4 bg-background rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-secondary">Course: </span>
                  <span className="font-medium">{selectedDefaulter.course}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Amount: </span>
                  <span className="font-medium text-error">{formatCurrency(selectedDefaulter.outstandingAmount)}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Days Pending: </span>
                  <span className="font-medium">{selectedDefaulter.daysPending}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Phone: </span>
                  <span className="font-medium">{selectedDefaulter.phone}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-text-primary mb-2">Message Preview:</label>
              <textarea
                value={getContactMessage(contactType, selectedDefaulter)}
                readOnly
                className="w-full h-32 p-3 bg-background border border-border rounded-md text-sm resize-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={closeContactModal}
                className="px-4 py-2 bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-background rounded-md text-sm transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={executeContactAction}
                className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary-600 transition-colors duration-150"
              >
                Send {contactType.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopDefaultersList;