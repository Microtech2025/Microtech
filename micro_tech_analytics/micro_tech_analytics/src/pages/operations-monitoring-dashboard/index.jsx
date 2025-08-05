import React, { useState, useEffect } from 'react';
import Header from 'components/ui/Header';
import GlobalFilterControls from 'components/ui/GlobalFilterControls';
import Icon from 'components/AppIcon';
import OperationalKPICards from './components/OperationalKPICards';
import FacilityOccupancyHeatmap from './components/FacilityOccupancyHeatmap';
import UtilizationChart from './components/UtilizationChart';
import LiveAlertsPanel from './components/LiveAlertsPanel';
import ResourceAllocationTable from './components/ResourceAllocationTable';

const OperationsMonitoringDashboard = () => {
  const [selectedFacility, setSelectedFacility] = useState('all');
  const [selectedShift, setSelectedShift] = useState('all');
  const [liveUpdateEnabled, setLiveUpdateEnabled] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for facilities
  const facilities = [
    { value: 'all', label: 'All Facilities' },
    { value: 'capt', label: 'CAPT Division' },
    { value: 'lbs', label: 'LBS Skill Training' },
    { value: 'gama', label: 'Gama Abacus' },
    { value: 'fashion', label: 'Fashion Designing' }
  ];

  const shifts = [
    { value: 'all', label: 'All Shifts' },
    { value: 'morning', label: 'Morning (9:00 AM - 1:00 PM)' },
    { value: 'afternoon', label: 'Afternoon (1:00 PM - 5:00 PM)' },
    { value: 'evening', label: 'Evening (5:00 PM - 9:00 PM)' }
  ];

  // Auto-refresh functionality
  useEffect(() => {
    if (liveUpdateEnabled) {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
      }, 300000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [liveUpdateEnabled]);

  const handleFacilityChange = (value) => {
    setSelectedFacility(value);
  };

  const handleShiftChange = (value) => {
    setSelectedShift(value);
  };

  const toggleLiveUpdate = () => {
    setLiveUpdateEnabled(!liveUpdateEnabled);
  };

  const formatLastUpdated = (date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Kolkata'
    });
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
              <h1 className="text-3xl font-bold text-text-primary mb-2">Operations Monitoring</h1>
              <p className="text-text-secondary">Real-time facility utilization and resource management</p>
            </div>
            
            {/* Live Update Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Icon name="Clock" size={16} />
                <span>Last updated: {formatLastUpdated(lastUpdated)}</span>
              </div>
              <button
                onClick={toggleLiveUpdate}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                  liveUpdateEnabled
                    ? 'bg-success-100 text-success-600 border border-success-200' :'bg-surface text-text-secondary border border-border hover:bg-background'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${liveUpdateEnabled ? 'bg-success animate-pulse' : 'bg-text-muted'}`}></div>
                <span>{liveUpdateEnabled ? 'Live Updates On' : 'Live Updates Off'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Operations Controls */}
        <div className="mb-8 bg-surface rounded-lg border border-border p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Facility Selector */}
              <div className="flex items-center space-x-2">
                <Icon name="Building2" size={16} className="text-text-secondary" />
                <label className="text-sm font-medium text-text-primary">Facility:</label>
                <select
                  value={selectedFacility}
                  onChange={(e) => handleFacilityChange(e.target.value)}
                  className="bg-surface border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  {facilities.map((facility) => (
                    <option key={facility.value} value={facility.value}>
                      {facility.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Shift Selector */}
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} className="text-text-secondary" />
                <label className="text-sm font-medium text-text-primary">Shift:</label>
                <select
                  value={selectedShift}
                  onChange={(e) => handleShiftChange(e.target.value)}
                  className="bg-surface border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  {shifts.map((shift) => (
                    <option key={shift.value} value={shift.value}>
                      {shift.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors duration-150">
                <Icon name="Plus" size={16} />
                <span>Book Resource</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-surface border border-border text-text-primary rounded-md hover:bg-background transition-colors duration-150">
                <Icon name="Download" size={16} />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="lg:hidden mb-6">
          <div className="flex space-x-1 bg-background rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview', icon: 'BarChart3' },
              { id: 'alerts', label: 'Alerts', icon: 'AlertTriangle' },
              { id: 'resources', label: 'Resources', icon: 'Calendar' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                  activeTab === tab.id
                    ? 'bg-surface text-primary border border-primary-200' :'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Operational KPI Cards */}
        <div className={`mb-8 ${activeTab !== 'overview' ? 'lg:block hidden' : ''}`}>
          <OperationalKPICards />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Monitoring Area */}
          <div className={`lg:col-span-8 space-y-8 ${activeTab !== 'overview' ? 'lg:block hidden' : ''}`}>
            {/* Facility Occupancy Heatmap */}
            <FacilityOccupancyHeatmap selectedFacility={selectedFacility} selectedShift={selectedShift} />
            
            {/* Utilization Chart */}
            <UtilizationChart selectedFacility={selectedFacility} />
          </div>

          {/* Live Alerts Panel */}
          <div className={`lg:col-span-4 ${activeTab === 'alerts' || activeTab === 'overview' ? 'block' : 'hidden lg:block'}`}>
            <LiveAlertsPanel />
          </div>
        </div>

        {/* Resource Allocation Table */}
        <div className={`mt-8 ${activeTab === 'resources' || activeTab === 'overview' ? 'block' : 'hidden lg:block'}`}>
          <ResourceAllocationTable selectedFacility={selectedFacility} selectedShift={selectedShift} />
        </div>
      </div>
    </div>
  );
};

export default OperationsMonitoringDashboard;