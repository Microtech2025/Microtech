import React, { useState } from 'react';
import Icon from '../AppIcon';

const GlobalFilterControls = () => {
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2024');
  const [selectedDateRange, setSelectedDateRange] = useState('current-semester');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  const divisions = [
    { value: 'all', label: 'All Divisions' },
    { value: 'undergraduate', label: 'Undergraduate' },
    { value: 'graduate', label: 'Graduate' },
    { value: 'continuing-ed', label: 'Continuing Education' },
    { value: 'online', label: 'Online Programs' }
  ];

  const academicYears = [
    { value: '2024', label: '2024-2025' },
    { value: '2023', label: '2023-2024' },
    { value: '2022', label: '2022-2023' },
    { value: '2021', label: '2021-2022' }
  ];

  const dateRanges = [
    { value: 'current-semester', label: 'Current Semester' },
    { value: 'last-30-days', label: 'Last 30 Days' },
    { value: 'last-90-days', label: 'Last 90 Days' },
    { value: 'academic-year', label: 'Academic Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleDivisionChange = (value) => {
    setSelectedDivision(value);
    // Apply filter logic here
    console.log('Division filter changed:', value);
  };

  const handleAcademicYearChange = (value) => {
    setSelectedAcademicYear(value);
    // Apply filter logic here
    console.log('Academic year filter changed:', value);
  };

  const handleDateRangeChange = (value) => {
    setSelectedDateRange(value);
    // Apply filter logic here
    console.log('Date range filter changed:', value);
  };

  const handleResetFilters = () => {
    setSelectedDivision('all');
    setSelectedAcademicYear('2024');
    setSelectedDateRange('current-semester');
    // Reset filter logic here
    console.log('Filters reset');
  };

  const toggleFiltersExpanded = () => {
    setIsFiltersExpanded(!isFiltersExpanded);
  };

  const hasActiveFilters = selectedDivision !== 'all' || selectedAcademicYear !== '2024' || selectedDateRange !== 'current-semester';

  return (
    <div className="sticky top-16 bg-surface border-b border-border z-1000">
      {/* Desktop Filter Controls */}
      <div className="hidden lg:block px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Division Filter */}
            <div className="flex items-center space-x-2">
              <Icon name="Building2" size={16} className="text-text-secondary" />
              <label className="text-sm font-medium text-text-primary">Division:</label>
              <select
                value={selectedDivision}
                onChange={(e) => handleDivisionChange(e.target.value)}
                className="bg-surface border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-150"
              >
                {divisions.map((division) => (
                  <option key={division.value} value={division.value}>
                    {division.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Academic Year Filter */}
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={16} className="text-text-secondary" />
              <label className="text-sm font-medium text-text-primary">Academic Year:</label>
              <select
                value={selectedAcademicYear}
                onChange={(e) => handleAcademicYearChange(e.target.value)}
                className="bg-surface border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-150"
              >
                {academicYears.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="flex items-center space-x-2">
              <Icon name="CalendarDays" size={16} className="text-text-secondary" />
              <label className="text-sm font-medium text-text-primary">Date Range:</label>
              <select
                value={selectedDateRange}
                onChange={(e) => handleDateRangeChange(e.target.value)}
                className="bg-surface border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-150"
              >
                {dateRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center space-x-3">
            {hasActiveFilters && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-xs text-text-secondary">Filters Active</span>
              </div>
            )}
            <button
              onClick={handleResetFilters}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:bg-background rounded-md transition-colors duration-150"
            >
              <Icon name="RotateCcw" size={14} />
              <span>Reset</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-1.5 text-sm text-primary hover:bg-primary-50 rounded-md transition-colors duration-150">
              <Icon name="Download" size={14} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Filter Controls */}
      <div className="lg:hidden">
        {/* Filter Toggle Button */}
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={toggleFiltersExpanded}
            className="flex items-center space-x-2 text-sm font-medium text-text-primary"
          >
            <Icon name="Filter" size={16} />
            <span>Filters</span>
            {hasActiveFilters && (
              <div className="w-2 h-2 bg-primary rounded-full ml-1"></div>
            )}
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`transition-transform duration-150 ${isFiltersExpanded ? 'rotate-180' : ''}`}
            />
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleResetFilters}
              className="p-2 text-text-secondary hover:text-text-primary transition-colors duration-150"
            >
              <Icon name="RotateCcw" size={16} />
            </button>
            <button className="p-2 text-primary hover:bg-primary-50 rounded-md transition-colors duration-150">
              <Icon name="Download" size={16} />
            </button>
          </div>
        </div>

        {/* Expandable Filter Panel */}
        {isFiltersExpanded && (
          <div className="px-4 pb-4 space-y-4 border-t border-border">
            {/* Division Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Division</label>
              <select
                value={selectedDivision}
                onChange={(e) => handleDivisionChange(e.target.value)}
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {divisions.map((division) => (
                  <option key={division.value} value={division.value}>
                    {division.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Academic Year Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Academic Year</label>
              <select
                value={selectedAcademicYear}
                onChange={(e) => handleAcademicYearChange(e.target.value)}
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {academicYears.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Date Range</label>
              <select
                value={selectedDateRange}
                onChange={(e) => handleDateRangeChange(e.target.value)}
                className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {dateRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalFilterControls;