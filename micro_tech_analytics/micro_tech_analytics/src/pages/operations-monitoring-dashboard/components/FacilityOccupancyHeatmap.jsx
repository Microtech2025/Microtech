import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const FacilityOccupancyHeatmap = ({ selectedFacility, selectedShift }) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // Mock heatmap data
  const timeSlots = [
    '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const facilities = [
    { id: 'capt-lab1', name: 'CAPT Lab 1', capacity: 30, type: 'lab' },
    { id: 'capt-lab2', name: 'CAPT Lab 2', capacity: 25, type: 'lab' },
    { id: 'capt-class1', name: 'CAPT Classroom 1', capacity: 40, type: 'classroom' },
    { id: 'lbs-workshop', name: 'LBS Workshop', capacity: 20, type: 'workshop' },
    { id: 'lbs-theory', name: 'LBS Theory Room', capacity: 35, type: 'classroom' },
    { id: 'gama-room1', name: 'Gama Room 1', capacity: 15, type: 'classroom' },
    { id: 'gama-room2', name: 'Gama Room 2', capacity: 18, type: 'classroom' },
    { id: 'fashion-studio', name: 'Fashion Studio', capacity: 22, type: 'studio' },
    { id: 'fashion-lab', name: 'Fashion Lab', capacity: 16, type: 'lab' }
  ];

  // Generate mock occupancy data
  const generateOccupancyData = () => {
    const data = {};
    facilities.forEach(facility => {
      data[facility.id] = {};
      timeSlots.forEach(time => {
        const occupancy = Math.floor(Math.random() * facility.capacity);
        const percentage = Math.round((occupancy / facility.capacity) * 100);
        data[facility.id][time] = {
          occupied: occupancy,
          capacity: facility.capacity,
          percentage: percentage,
          batchName: percentage > 0 ? `Batch ${Math.floor(Math.random() * 20) + 1}` : null,
          instructor: percentage > 0 ? `Instructor ${Math.floor(Math.random() * 10) + 1}` : null
        };
      });
    });
    return data;
  };

  const occupancyData = generateOccupancyData();

  const getOccupancyColor = (percentage) => {
    if (percentage === 0) return 'bg-gray-100';
    if (percentage <= 30) return 'bg-green-200';
    if (percentage <= 60) return 'bg-yellow-200';
    if (percentage <= 85) return 'bg-orange-200';
    return 'bg-red-200';
  };

  const getOccupancyTextColor = (percentage) => {
    if (percentage === 0) return 'text-gray-500';
    if (percentage <= 30) return 'text-green-700';
    if (percentage <= 60) return 'text-yellow-700';
    if (percentage <= 85) return 'text-orange-700';
    return 'text-red-700';
  };

  const handleCellClick = (facilityId, timeSlot) => {
    setSelectedTimeSlot({ facilityId, timeSlot });
  };

  const getSelectedCellData = () => {
    if (!selectedTimeSlot) return null;
    const facility = facilities.find(f => f.id === selectedTimeSlot.facilityId);
    const data = occupancyData[selectedTimeSlot.facilityId][selectedTimeSlot.timeSlot];
    return { facility, data, timeSlot: selectedTimeSlot.timeSlot };
  };

  const selectedData = getSelectedCellData();

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">Facility Occupancy Heatmap</h2>
          <p className="text-text-secondary">Real-time room utilization across all facilities</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-text-secondary">Occupancy Level:</span>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-200 rounded"></div>
              <span className="text-xs text-text-muted">Low</span>
              <div className="w-3 h-3 bg-yellow-200 rounded"></div>
              <span className="text-xs text-text-muted">Medium</span>
              <div className="w-3 h-3 bg-orange-200 rounded"></div>
              <span className="text-xs text-text-muted">High</span>
              <div className="w-3 h-3 bg-red-200 rounded"></div>
              <span className="text-xs text-text-muted">Full</span>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header Row */}
          <div className="grid grid-cols-13 gap-1 mb-2">
            <div className="text-sm font-medium text-text-secondary p-2">Room</div>
            {timeSlots.map(time => (
              <div key={time} className="text-sm font-medium text-text-secondary text-center p-2">
                {time}
              </div>
            ))}
          </div>

          {/* Data Rows */}
          {facilities.map(facility => (
            <div key={facility.id} className="grid grid-cols-13 gap-1 mb-1">
              <div className="text-sm text-text-primary p-2 bg-background rounded flex items-center">
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={facility.type === 'lab' ? 'Monitor' : facility.type === 'workshop' ? 'Wrench' : facility.type === 'studio' ? 'Palette' : 'Users'} 
                    size={14} 
                    className="text-text-secondary" 
                  />
                  <span className="truncate">{facility.name}</span>
                </div>
              </div>
              {timeSlots.map(time => {
                const data = occupancyData[facility.id][time];
                return (
                  <div
                    key={`${facility.id}-${time}`}
                    onClick={() => handleCellClick(facility.id, time)}
                    className={`
                      ${getOccupancyColor(data.percentage)} 
                      ${getOccupancyTextColor(data.percentage)}
                      p-2 rounded text-xs font-medium text-center cursor-pointer
                      hover:ring-2 hover:ring-primary hover:ring-opacity-50
                      transition-all duration-150
                      ${selectedTimeSlot?.facilityId === facility.id && selectedTimeSlot?.timeSlot === time ? 'ring-2 ring-primary' : ''}
                    `}
                  >
                    {data.percentage}%
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Cell Details */}
      {selectedData && (
        <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-text-primary mb-2">
                {selectedData.facility.name} - {selectedData.timeSlot}:00
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-secondary">Occupancy:</span>
                  <span className="ml-2 font-medium text-text-primary">
                    {selectedData.data.occupied}/{selectedData.data.capacity} ({selectedData.data.percentage}%)
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary">Batch:</span>
                  <span className="ml-2 font-medium text-text-primary">
                    {selectedData.data.batchName || 'Not Scheduled'}
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary">Instructor:</span>
                  <span className="ml-2 font-medium text-text-primary">
                    {selectedData.data.instructor || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary">Room Type:</span>
                  <span className="ml-2 font-medium text-text-primary capitalize">
                    {selectedData.facility.type}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedTimeSlot(null)}
              className="text-text-secondary hover:text-text-primary transition-colors duration-150"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilityOccupancyHeatmap;