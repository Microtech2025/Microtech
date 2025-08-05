import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
  {
    label: 'Executive Overview',
    path: '/executive-overview-dashboard',
    icon: 'BarChart3'
  },
  {
    label: 'Student Analytics',
    path: '/student-analytics-dashboard',
    icon: 'Users'
  },
  {
    label: 'Financial Performance',
    path: '/financial-performance-dashboard',
    icon: 'DollarSign'
  },
  {
    label: 'Operations Monitoring',
    path: '/operations-monitoring-dashboard',
    icon: 'Activity'
  }];


  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logout clicked');
    setIsUserMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-surface border-b border-border z-1000">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo Section */}
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Icon name="GraduationCap" size={20} color="white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-text-primary">EduAnalytics</span>
              <span className="text-xs text-text-secondary">Dashboard Suite</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navigationItems.map((item) =>
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-out ${
            isActiveRoute(item.path) ?
            'bg-primary-50 text-primary border border-primary-200' : 'text-text-secondary hover:text-text-primary hover:bg-background'}`
            }>

              <Icon name={item.icon} size={16} />
              <span>{item.label}</span>
            </button>
          )}
        </nav>

        {/* User Context Panel */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-text-secondary hover:text-text-primary transition-colors duration-150">
            <Icon name="Bell" size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            </span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={handleUserMenuToggle}
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-background transition-colors duration-150">

              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="#1e40af" />
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-text-primary">Admin User</span>
                <span className="text-xs text-text-secondary">Executive Access</span>
              </div>
              <Icon
                name="ChevronDown"
                size={16}
                className="to the top" />



            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen &&
            <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-border rounded-md shadow-md z-1100">
                <div className="p-3 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} color="#1e40af" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">Admin User</p>
                      <p className="text-xs text-text-secondary">admin@university.edu</p>
                      <p className="text-xs text-accent font-medium">Executive Access</p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background transition-colors duration-150">
                    <Icon name="Settings" size={16} />
                    <span>Account Settings</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background transition-colors duration-150">
                    <Icon name="HelpCircle" size={16} />
                    <span>Help & Support</span>
                  </button>
                  <div className="border-t border-border mt-2 pt-2">
                    <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-error hover:bg-error-50 transition-colors duration-150">

                      <Icon name="LogOut" size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors duration-150">
            <Icon name="Menu" size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden border-t border-border bg-surface">
        <nav className="px-4 py-3 space-y-2">
          {navigationItems.map((item) =>
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-colors duration-150 ${
            isActiveRoute(item.path) ?
            'bg-primary-50 text-primary border border-primary-200' : 'text-text-secondary hover:text-text-primary hover:bg-background'}`
            }>

              <Icon name={item.icon} size={16} />
              <span>{item.label}</span>
            </button>
          )}
        </nav>
      </div>
    </header>);

};

export default Header;