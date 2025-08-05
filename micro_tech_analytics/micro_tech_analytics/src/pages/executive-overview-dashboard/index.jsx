import React, { useState, useEffect } from 'react';
import Header from 'components/ui/Header';
import GlobalFilterControls from 'components/ui/GlobalFilterControls';
import Icon from 'components/AppIcon';
import KPIMetricsRow from './components/KPIMetricsRow';
import EnrollmentRevenueChart from './components/EnrollmentRevenueChart';
import DivisionPerformanceRanking from './components/DivisionPerformanceRanking';
import RevenueBreakdownChart from './components/RevenueBreakdownChart';
import AlertsPanel from './components/AlertsPanel';

const ExecutiveOverviewDashboard = () => {
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [selectedComparison, setSelectedComparison] = useState('yoy');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for dashboard
  const dashboardData = {
    kpiMetrics: {
      totalEnrollment: {
        current: 8547,
        previous: 7892,
        trend: 'up',
        percentage: 8.3
      },
      revenueAchievement: {
        current: 2847500,
        target: 3200000,
        percentage: 88.9,
        trend: 'up'
      },
      studentSuccessRate: {
        current: 94.2,
        previous: 91.8,
        trend: 'up',
        percentage: 2.6
      },
      capacityUtilization: {
        current: 78.5,
        previous: 82.1,
        trend: 'down',
        percentage: -4.4
      }
    },
    enrollmentRevenueData: [
      { month: 'Jan', enrollment: 1200, revenue: 380000, target: 400000 },
      { month: 'Feb', enrollment: 1350, revenue: 425000, target: 420000 },
      { month: 'Mar', enrollment: 1180, revenue: 372000, target: 390000 },
      { month: 'Apr', enrollment: 1420, revenue: 448000, target: 450000 },
      { month: 'May', enrollment: 1380, revenue: 435000, target: 440000 },
      { month: 'Jun', enrollment: 1250, revenue: 395000, target: 410000 },
      { month: 'Jul', enrollment: 1480, revenue: 467000, target: 470000 },
      { month: 'Aug', enrollment: 1320, revenue: 417000, target: 430000 },
      { month: 'Sep', enrollment: 1290, revenue: 408000, target: 420000 },
      { month: 'Oct', enrollment: 1380, revenue: 436000, target: 440000 },
      { month: 'Nov', enrollment: 1450, revenue: 458000, target: 460000 },
      { month: 'Dec', enrollment: 1340, revenue: 423000, target: 430000 }
    ],
    divisionPerformance: [
      {
        id: 'capt',
        name: 'CAPT',
        enrollment: 3245,
        revenue: 1247500,
        successRate: 96.2,
        utilization: 82.4,
        trend: 'up',
        alerts: 0
      },
      {
        id: 'lbs',
        name: 'LBS Skill Training',
        enrollment: 2890,
        revenue: 892000,
        successRate: 93.8,
        utilization: 78.9,
        trend: 'up',
        alerts: 1
      },
      {
        id: 'gama',
        name: 'Gama Abacus',
        enrollment: 1847,
        revenue: 485000,
        successRate: 91.5,
        utilization: 74.2,
        trend: 'stable',
        alerts: 0
      },
      {
        id: 'fashion',
        name: 'Fashion Designing',
        enrollment: 565,
        revenue: 223000,
        successRate: 89.7,
        utilization: 68.5,
        trend: 'down',
        alerts: 2
      }
    ],
    revenueBreakdown: {
      collected: 2547500,
      pending: 485000,
      overdue: 167000,
      categories: [
        { name: 'Course Fees', collected: 1847500, pending: 285000, overdue: 98000 },
        { name: 'Exam Fees', collected: 385000, pending: 95000, overdue: 32000 },
        { name: 'Material Fees', collected: 215000, pending: 65000, overdue: 22000 },
        { name: 'Other Fees', collected: 100000, pending: 40000, overdue: 15000 }
      ]
    },
    alerts: [
      {
        id: 1,
        type: 'warning',
        title: 'Low Attendance Alert',
        message: 'Fashion Designing division showing 15% decline in attendance this week',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        division: 'fashion'
      },
      {
        id: 2,
        type: 'error',
        title: 'Payment Default',
        message: '23 students have overdue payments exceeding 30 days',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        division: 'all'
      },
      {
        id: 3,
        type: 'info',
        title: 'Capacity Threshold',
        message: 'CAPT division approaching 85% capacity utilization',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        division: 'capt'
      }
    ]
  };

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleDivisionChange = (division) => {
    setSelectedDivision(division);
  };

  const handleComparisonChange = (comparison) => {
    setSelectedComparison(comparison);
  };

  const handleExportData = () => {
    console.log('Exporting dashboard data...');
    // Export functionality would be implemented here
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <GlobalFilterControls />
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-text-secondary">Loading dashboard data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <GlobalFilterControls />
      
      <main className="px-6 py-6 space-y-6">
        {/* Dashboard Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Executive Overview Dashboard</h1>
            <p className="text-text-secondary">Strategic insights and institutional performance metrics</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Comparison Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-text-secondary">Compare:</span>
              <div className="flex bg-background border border-border rounded-md p-1">
                <button
                  onClick={() => handleComparisonChange('yoy')}
                  className={`px-3 py-1 text-sm rounded transition-colors duration-150 ${
                    selectedComparison === 'yoy' ?'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  YoY
                </button>
                <button
                  onClick={() => handleComparisonChange('qoq')}
                  className={`px-3 py-1 text-sm rounded transition-colors duration-150 ${
                    selectedComparison === 'qoq' ?'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  QoQ
                </button>
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExportData}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors duration-150"
            >
              <Icon name="Download" size={16} />
              <span className="hidden sm:inline">Export Report</span>
            </button>
          </div>
        </div>

        {/* KPI Metrics Row */}
        <KPIMetricsRow 
          metrics={dashboardData.kpiMetrics}
          comparison={selectedComparison}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Main Chart Area */}
          <div className="xl:col-span-8">
            <EnrollmentRevenueChart 
              data={dashboardData.enrollmentRevenueData}
              selectedDivision={selectedDivision}
            />
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-4 space-y-6">
            <DivisionPerformanceRanking 
              divisions={dashboardData.divisionPerformance}
              onDivisionSelect={handleDivisionChange}
            />
            
            <AlertsPanel 
              alerts={dashboardData.alerts}
              selectedDivision={selectedDivision}
            />
          </div>
        </div>

        {/* Revenue Breakdown Chart */}
        <RevenueBreakdownChart 
          data={dashboardData.revenueBreakdown}
          selectedDivision={selectedDivision}
        />

        {/* Footer Summary */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">₹28.5L</div>
              <div className="text-sm text-text-secondary">Total Revenue (Current Month)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">94.2%</div>
              <div className="text-sm text-text-secondary">Overall Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">8,547</div>
              <div className="text-sm text-text-secondary">Active Students</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExecutiveOverviewDashboard;