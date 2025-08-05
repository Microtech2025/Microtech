import React, { useState, useEffect } from 'react';
import Header from 'components/ui/Header';
import GlobalFilterControls from 'components/ui/GlobalFilterControls';
import Icon from 'components/AppIcon';
import KPIMetricsStrip from './components/KPIMetricsStrip';
import EnrollmentAnalytics from './components/EnrollmentAnalytics';
import PerformanceAnalytics from './components/PerformanceAnalytics';
import AttendanceAnalytics from './components/AttendanceAnalytics';
import AtRiskStudentPanel from './components/AtRiskStudentPanel';
import StudentDataTable from './components/StudentDataTable';

const StudentAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('enrollment');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // Mock data for dashboard metrics
  const dashboardMetrics = {
    activeEnrollments: 2847,
    attendanceRate: 87.3,
    academicPerformance: 78.5,
    dropoutRiskAlerts: 23,
    placementRate: 92.1,
    studentSatisfaction: 4.2
  };

  const tabOptions = [
    { id: 'enrollment', label: 'Enrollment Analytics', icon: 'UserPlus' },
    { id: 'performance', label: 'Performance Analytics', icon: 'TrendingUp' },
    { id: 'attendance', label: 'Attendance Analytics', icon: 'Calendar' }
  ];

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    if (isAutoRefresh) {
      interval = setInterval(() => {
        setLastUpdated(new Date());
        // Simulate data refresh
        console.log('Dashboard data refreshed');
      }, 900000); // 15 minutes
    }
    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const toggleAutoRefresh = () => {
    setIsAutoRefresh(!isAutoRefresh);
  };

  const handleManualRefresh = () => {
    setLastUpdated(new Date());
    console.log('Manual refresh triggered');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'enrollment':
        return <EnrollmentAnalytics />;
      case 'performance':
        return <PerformanceAnalytics />;
      case 'attendance':
        return <AttendanceAnalytics />;
      default:
        return <EnrollmentAnalytics />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <GlobalFilterControls />
      
      <div className="pt-32 px-6 pb-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-text-primary mb-2">Student Analytics Dashboard</h1>
              <p className="text-text-secondary">
                Comprehensive enrollment, performance, and retention insights for academic decision making
              </p>
            </div>
            
            {/* Refresh Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Icon name="Clock" size={16} />
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleAutoRefresh}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm transition-colors duration-150 ${
                    isAutoRefresh 
                      ? 'bg-secondary-50 text-secondary border border-secondary-200' :'bg-surface border border-border text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon name={isAutoRefresh ? 'Play' : 'Pause'} size={14} />
                  <span>{isAutoRefresh ? 'Auto' : 'Manual'}</span>
                </button>
                
                <button
                  onClick={handleManualRefresh}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors duration-150"
                >
                  <Icon name="RefreshCw" size={14} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Metrics Strip */}
        <KPIMetricsStrip metrics={dashboardMetrics} />

        {/* Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-16 gap-6 mb-8">
          {/* Main Analytics Panel */}
          <div className="xl:col-span-11">
            <div className="bg-surface rounded-lg border border-border shadow-sm">
              {/* Tab Navigation */}
              <div className="border-b border-border">
                <nav className="flex space-x-8 px-6">
                  {tabOptions.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-150 ${
                        activeTab === tab.id
                          ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                      }`}
                    >
                      <Icon name={tab.icon} size={16} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>

          {/* At-Risk Student Panel */}
          <div className="xl:col-span-5">
            <AtRiskStudentPanel />
          </div>
        </div>

        {/* Student Data Table */}
        <StudentDataTable />
      </div>
    </div>
  );
};

export default StudentAnalyticsDashboard;