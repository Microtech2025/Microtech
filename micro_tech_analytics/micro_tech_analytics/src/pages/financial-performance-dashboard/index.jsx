import React, { useState, useEffect } from 'react';
import Header from 'components/ui/Header';
import GlobalFilterControls from 'components/ui/GlobalFilterControls';
import Icon from 'components/AppIcon';
import FinancialKPICards from './components/FinancialKPICards';
import RevenueWaterfallChart from './components/RevenueWaterfallChart';
import CashFlowTimeline from './components/CashFlowTimeline';
import AccountsReceivableAging from './components/AccountsReceivableAging';
import TopDefaultersList from './components/TopDefaultersList';
import PaymentNotifications from './components/PaymentNotifications';

const FinancialPerformanceDashboard = () => {
  const [selectedDivisions, setSelectedDivisions] = useState(['all']);
  const [selectedFinancialYear, setSelectedFinancialYear] = useState('2024-25');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [notifications, setNotifications] = useState([]);

  // Mock financial data
  const financialData = {
    kpis: {
      totalRevenue: 2850000,
      collectionRate: 87.5,
      outstandingDues: 425000,
      monthlyGrowth: 12.3,
      budgetVariance: -5.2
    },
    revenueWaterfall: [
      { month: 'Apr', target: 450000, actual: 425000, variance: -25000 },
      { month: 'May', target: 480000, actual: 495000, variance: 15000 },
      { month: 'Jun', target: 520000, actual: 485000, variance: -35000 },
      { month: 'Jul', target: 500000, actual: 520000, variance: 20000 },
      { month: 'Aug', target: 530000, actual: 515000, variance: -15000 },
      { month: 'Sep', target: 550000, actual: 575000, variance: 25000 }
    ],
    cashFlow: [
      { date: '2024-09-01', collections: 45000, method: 'Online' },
      { date: '2024-09-02', collections: 32000, method: 'Cash' },
      { date: '2024-09-03', collections: 58000, method: 'Bank Transfer' },
      { date: '2024-09-04', collections: 41000, method: 'Online' },
      { date: '2024-09-05', collections: 67000, method: 'Cheque' },
      { date: '2024-09-06', collections: 39000, method: 'Online' },
      { date: '2024-09-07', collections: 52000, method: 'Bank Transfer' }
    ],
    accountsReceivable: [
      { category: '0-30 Days', amount: 125000, count: 45, color: '#10b981' },
      { category: '31-60 Days', amount: 85000, count: 28, color: '#f59e0b' },
      { category: '61-90 Days', amount: 65000, count: 18, color: '#ef4444' },
      { category: '90+ Days', amount: 150000, count: 35, color: '#dc2626' }
    ],
    topDefaulters: [
      {
        id: 1,
        studentName: 'Rajesh Kumar',
        course: 'CAPT - Advanced Diploma',
        outstandingAmount: 45000,
        daysPending: 75,
        lastContact: '2024-09-01',
        contactStatus: 'Pending Response',
        phone: '+91 9876543210'
      },
      {
        id: 2,
        studentName: 'Priya Nair',
        course: 'Fashion Designing - Certificate',
        outstandingAmount: 32000,
        daysPending: 45,
        lastContact: '2024-09-03',
        contactStatus: 'Payment Promised',
        phone: '+91 9876543211'
      },
      {
        id: 3,
        studentName: 'Arjun Menon',
        course: 'LBS Skill Training - Welding',
        outstandingAmount: 28000,
        daysPending: 62,
        lastContact: '2024-08-28',
        contactStatus: 'No Response',
        phone: '+91 9876543212'
      },
      {
        id: 4,
        studentName: 'Sneha Pillai',
        course: 'Gama Abacus - Level 3',
        outstandingAmount: 15000,
        daysPending: 38,
        lastContact: '2024-09-05',
        contactStatus: 'Partial Payment',
        phone: '+91 9876543213'
      }
    ]
  };

  const divisions = [
    { value: 'all', label: 'All Divisions' },
    { value: 'capt', label: 'CAPT' },
    { value: 'lbs', label: 'LBS Skill Training' },
    { value: 'gama', label: 'Gama Abacus' },
    { value: 'fashion', label: 'Fashion Designing' }
  ];

  const financialYears = [
    { value: '2024-25', label: '2024-2025' },
    { value: '2023-24', label: '2023-2024' },
    { value: '2022-23', label: '2022-2023' }
  ];

  const paymentStatusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'partial', label: 'Partial' }
  ];

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        setLastRefresh(new Date());
        // Simulate new payment notification
        const newNotification = {
          id: Date.now(),
          type: 'success',
          message: `Payment of ₹${(Math.random() * 50000 + 10000).toFixed(0)} received from ${['Rahul Sharma', 'Meera Krishnan', 'Anil Varma'][Math.floor(Math.random() * 3)]}`,
          timestamp: new Date()
        };
        setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
      }, 30 * 60 * 1000); // 30 minutes
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleDivisionChange = (divisions) => {
    setSelectedDivisions(divisions);
  };

  const handleRefreshData = () => {
    setLastRefresh(new Date());
    // Simulate data refresh
    console.log('Refreshing financial data...');
  };

  const handleExportData = () => {
    // Simulate export functionality
    console.log('Exporting financial data...');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <GlobalFilterControls />
      
      {/* Financial Dashboard Header */}
      <div className="sticky top-32 bg-surface border-b border-border z-50">
        <div className="px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                <Icon name="DollarSign" size={24} color="var(--color-accent)" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">Financial Performance Dashboard</h1>
                <p className="text-sm text-text-secondary">
                  Last updated: {lastRefresh.toLocaleString('en-IN', { 
                    timeZone: 'Asia/Kolkata',
                    day: '2-digit',
                    month: '2-digit', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })} IST
                </p>
              </div>
            </div>

            {/* Financial Controls */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Division Multi-Select */}
              <div className="flex items-center space-x-2">
                <Icon name="Building2" size={16} className="text-text-secondary" />
                <select
                  multiple
                  value={selectedDivisions}
                  onChange={(e) => handleDivisionChange(Array.from(e.target.selectedOptions, option => option.value))}
                  className="bg-surface border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary min-w-40"
                >
                  {divisions.map((division) => (
                    <option key={division.value} value={division.value}>
                      {division.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Financial Year Picker */}
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={16} className="text-text-secondary" />
                <select
                  value={selectedFinancialYear}
                  onChange={(e) => setSelectedFinancialYear(e.target.value)}
                  className="bg-surface border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  {financialYears.map((year) => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Status Filter */}
              <div className="flex items-center space-x-2">
                <Icon name="CreditCard" size={16} className="text-text-secondary" />
                <select
                  value={paymentStatusFilter}
                  onChange={(e) => setPaymentStatusFilter(e.target.value)}
                  className="bg-surface border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  {paymentStatusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Auto-refresh Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors duration-150 ${
                    autoRefresh 
                      ? 'bg-secondary-50 text-secondary border border-secondary-200' :'bg-surface border border-border text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon name="RefreshCw" size={14} className={autoRefresh ? 'animate-spin' : ''} />
                  <span>Auto-refresh</span>
                </button>
              </div>

              {/* Manual Refresh */}
              <button
                onClick={handleRefreshData}
                className="flex items-center space-x-2 px-3 py-2 bg-surface border border-border rounded-md text-sm text-text-secondary hover:text-text-primary hover:bg-background transition-colors duration-150"
              >
                <Icon name="RotateCcw" size={14} />
                <span>Refresh</span>
              </button>

              {/* Export Button */}
              <button
                onClick={handleExportData}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary-600 transition-colors duration-150"
              >
                <Icon name="Download" size={14} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Notifications */}
      <PaymentNotifications notifications={notifications} />

      {/* Main Dashboard Content */}
      <div className="px-6 py-6">
        {/* Financial KPI Cards */}
        <div className="mb-8">
          <FinancialKPICards data={financialData.kpis} />
        </div>

        {/* Main Visualization Area */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Revenue Waterfall Chart */}
          <div className="xl:col-span-2">
            <RevenueWaterfallChart data={financialData.revenueWaterfall} />
          </div>

          {/* Cash Flow Timeline */}
          <div className="xl:col-span-1">
            <CashFlowTimeline data={financialData.cashFlow} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Accounts Receivable Aging */}
          <div className="xl:col-span-2">
            <AccountsReceivableAging data={financialData.accountsReceivable} />
          </div>

          {/* Top Defaulters List */}
          <div className="xl:col-span-1">
            <TopDefaultersList data={financialData.topDefaulters} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialPerformanceDashboard;