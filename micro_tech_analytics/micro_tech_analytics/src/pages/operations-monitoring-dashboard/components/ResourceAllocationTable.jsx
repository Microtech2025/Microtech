import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ResourceAllocationTable = ({ selectedFacility, selectedShift }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('schedule'); // schedule, teachers, equipment
  const [draggedItem, setDraggedItem] = useState(null);

  // Mock resource allocation data
  const scheduleData = [
    {
      id: 1,
      timeSlot: '09:00 - 10:00',
      room: 'CAPT Lab 1',
      batch: 'CAPT-B1-2024',
      course: 'Computer Applications',
      instructor: 'Rajesh Kumar',
      students: 28,
      capacity: 30,
      status: 'active',
      equipment: ['Projector', 'Computers', 'Whiteboard']
    },
    {
      id: 2,
      timeSlot: '09:00 - 10:00',
      room: 'LBS Workshop',
      batch: 'LBS-W2-2024',
      course: 'Electrical Wiring',
      instructor: 'Priya Nair',
      students: 18,
      capacity: 20,
      status: 'active',
      equipment: ['Tools', 'Safety Equipment', 'Workbenches']
    },
    {
      id: 3,
      timeSlot: '10:00 - 11:00',
      room: 'Fashion Studio',
      batch: 'FD-A1-2024',
      course: 'Pattern Making',
      instructor: 'Meera Pillai',
      students: 15,
      capacity: 22,
      status: 'scheduled',
      equipment: ['Cutting Tables', 'Mannequins', 'Sewing Machines']
    },
    {
      id: 4,
      timeSlot: '10:00 - 11:00',
      room: 'Gama Room 1',
      batch: 'GA-K1-2024',
      course: 'Abacus Level 3',
      instructor: 'Suresh Menon',
      students: 12,
      capacity: 15,
      status: 'active',
      equipment: ['Abacus Sets', 'Whiteboard', 'Audio System']
    },
    {
      id: 5,
      timeSlot: '11:00 - 12:00',
      room: 'CAPT Lab 2',
      batch: 'CAPT-B2-2024',
      course: 'Data Entry',
      instructor: 'Anitha Varma',
      students: 22,
      capacity: 25,
      status: 'scheduled',
      equipment: ['Computers', 'Headphones', 'Projector']
    }
  ];

  const teacherData = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      department: 'CAPT',
      totalHours: 8,
      scheduledHours: 6,
      availableSlots: ['14:00-15:00', '15:00-16:00'],
      currentLoad: 75,
      expertise: ['Computer Applications', 'MS Office', 'Tally']
    },
    {
      id: 2,
      name: 'Priya Nair',
      department: 'LBS',
      totalHours: 8,
      scheduledHours: 7,
      availableSlots: ['13:00-14:00'],
      currentLoad: 87.5,
      expertise: ['Electrical', 'Electronics', 'Safety Training']
    },
    {
      id: 3,
      name: 'Meera Pillai',
      department: 'Fashion',
      totalHours: 8,
      scheduledHours: 5,
      availableSlots: ['11:00-12:00', '16:00-17:00', '17:00-18:00'],
      currentLoad: 62.5,
      expertise: ['Pattern Making', 'Garment Construction', 'Fashion Design']
    },
    {
      id: 4,
      name: 'Suresh Menon',
      department: 'Gama',
      totalHours: 6,
      scheduledHours: 4,
      availableSlots: ['15:00-16:00', '16:00-17:00'],
      currentLoad: 66.7,
      expertise: ['Abacus', 'Mental Math', 'Vedic Math']
    }
  ];

  const equipmentData = [
    {
      id: 1,
      name: 'Projector PJ-001',
      type: 'Projector',
      location: 'CAPT Lab 1',
      status: 'in-use',
      condition: 'good',
      nextMaintenance: '2024-02-15',
      utilizationRate: 85,
      bookings: ['09:00-10:00', '11:00-12:00', '14:00-15:00']
    },
    {
      id: 2,
      name: 'Sewing Machine SM-015',
      type: 'Sewing Machine',
      location: 'Fashion Studio',
      status: 'available',
      condition: 'excellent',
      nextMaintenance: '2024-03-01',
      utilizationRate: 65,
      bookings: ['10:00-11:00', '15:00-16:00']
    },
    {
      id: 3,
      name: 'Computer Set CS-025',
      type: 'Computer',
      location: 'CAPT Lab 2',
      status: 'maintenance',
      condition: 'needs-repair',
      nextMaintenance: '2024-01-20',
      utilizationRate: 0,
      bookings: []
    },
    {
      id: 4,
      name: 'Workbench WB-008',
      type: 'Workbench',
      location: 'LBS Workshop',
      status: 'in-use',
      condition: 'good',
      nextMaintenance: '2024-02-28',
      utilizationRate: 90,
      bookings: ['09:00-12:00', '14:00-17:00']
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success-100';
      case 'scheduled':
        return 'text-primary bg-primary-100';
      case 'in-use':
        return 'text-warning bg-warning-100';
      case 'available':
        return 'text-success bg-success-100';
      case 'maintenance':
        return 'text-error bg-error-100';
      default:
        return 'text-text-secondary bg-background';
    }
  };

  const getLoadColor = (load) => {
    if (load >= 90) return 'text-error';
    if (load >= 75) return 'text-warning';
    return 'text-success';
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetSlot) => {
    e.preventDefault();
    if (draggedItem) {
      console.log('Rescheduling:', draggedItem, 'to', targetSlot);
      // Implement rescheduling logic here
      setDraggedItem(null);
    }
  };

  const renderScheduleView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-medium text-text-secondary">Time Slot</th>
            <th className="text-left py-3 px-4 font-medium text-text-secondary">Room</th>
            <th className="text-left py-3 px-4 font-medium text-text-secondary">Batch</th>
            <th className="text-left py-3 px-4 font-medium text-text-secondary">Course</th>
            <th className="text-left py-3 px-4 font-medium text-text-secondary">Instructor</th>
            <th className="text-left py-3 px-4 font-medium text-text-secondary">Occupancy</th>
            <th className="text-left py-3 px-4 font-medium text-text-secondary">Status</th>
            <th className="text-left py-3 px-4 font-medium text-text-secondary">Actions</th>
          </tr>
        </thead>
        <tbody>
          {scheduleData.map((item) => (
            <tr
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, item.timeSlot)}
              className="border-b border-border hover:bg-background transition-colors duration-150 cursor-move"
            >
              <td className="py-3 px-4 text-sm text-text-primary font-medium">{item.timeSlot}</td>
              <td className="py-3 px-4 text-sm text-text-primary">{item.room}</td>
              <td className="py-3 px-4 text-sm text-text-primary">{item.batch}</td>
              <td className="py-3 px-4 text-sm text-text-secondary">{item.course}</td>
              <td className="py-3 px-4 text-sm text-text-primary">{item.instructor}</td>
              <td className="py-3 px-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-text-primary">{item.students}/{item.capacity}</span>
                  <div className="w-16 bg-background rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(item.students / item.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-text-secondary hover:text-primary transition-colors duration-150">
                    <Icon name="Edit" size={16} />
                  </button>
                  <button className="p-1 text-text-secondary hover:text-error transition-colors duration-150">
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderTeachersView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {teacherData.map((teacher) => (
        <div key={teacher.id} className="bg-background rounded-lg p-4 border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Icon name="User" size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-text-primary">{teacher.name}</h3>
                <p className="text-sm text-text-secondary">{teacher.department} Department</p>
              </div>
            </div>
            <span className={`text-sm font-medium ${getLoadColor(teacher.currentLoad)}`}>
              {teacher.currentLoad}% Load
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-xs text-text-secondary">Scheduled Hours</span>
              <p className="text-sm font-medium text-text-primary">{teacher.scheduledHours}/{teacher.totalHours}</p>
            </div>
            <div>
              <span className="text-xs text-text-secondary">Available Slots</span>
              <p className="text-sm font-medium text-text-primary">{teacher.availableSlots.length}</p>
            </div>
          </div>

          <div className="mb-4">
            <span className="text-xs text-text-secondary">Expertise</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {teacher.expertise.map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-primary-50 text-primary text-xs rounded-md">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-text-secondary">
              Next Available: {teacher.availableSlots[0] || 'No slots'}
            </div>
            <button className="px-3 py-1 bg-primary text-white text-xs rounded-md hover:bg-primary-600 transition-colors duration-150">
              Assign
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEquipmentView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-medium text-text-secondary">Equipment</th>
            <th className="text-left py-3 px-4 font-medium text-text-secondary">Type</th>
            <th className="text-left py-3 px-4 font-medium text-text-secondary">Location</th>
            <th className="text-left py-3 px-4 font-medium text-text-secondary">Status</th>
            <th className="text-left py-3 px-4 font-medium text-text-secondary">Condition</th>
            <th className="text-left py-3 px-4 font-medium text-text-secondary">Utilization</th>
            <th className="text-left py-3 px-4 font-medium text-text-secondary">Next Maintenance</th>
            <th className="text-left py-3 px-4 font-medium text-text-secondary">Actions</th>
          </tr>
        </thead>
        <tbody>
          {equipmentData.map((equipment) => (
            <tr key={equipment.id} className="border-b border-border hover:bg-background transition-colors duration-150">
              <td className="py-3 px-4 text-sm text-text-primary font-medium">{equipment.name}</td>
              <td className="py-3 px-4 text-sm text-text-secondary">{equipment.type}</td>
              <td className="py-3 px-4 text-sm text-text-primary">{equipment.location}</td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(equipment.status)}`}>
                  {equipment.status.replace('-', ' ')}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-text-secondary capitalize">{equipment.condition.replace('-', ' ')}</td>
              <td className="py-3 px-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-text-primary">{equipment.utilizationRate}%</span>
                  <div className="w-16 bg-background rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${equipment.utilizationRate}%` }}
                    ></div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-text-secondary">{equipment.nextMaintenance}</td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-text-secondary hover:text-primary transition-colors duration-150">
                    <Icon name="Calendar" size={16} />
                  </button>
                  <button className="p-1 text-text-secondary hover:text-warning transition-colors duration-150">
                    <Icon name="Settings" size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="mb-4 lg:mb-0">
          <h2 className="text-xl font-semibold text-text-primary mb-2">Resource Allocation</h2>
          <p className="text-text-secondary">Manage schedules, teachers, and equipment assignments</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Date Selector */}
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-text-secondary" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-surface border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          
          {/* Add Resource Button */}
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors duration-150">
            <Icon name="Plus" size={16} />
            <span>Add Booking</span>
          </button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex space-x-1 bg-background rounded-lg p-1 mb-6">
        {[
          { id: 'schedule', label: 'Schedule', icon: 'Calendar' },
          { id: 'teachers', label: 'Teachers', icon: 'Users' },
          { id: 'equipment', label: 'Equipment', icon: 'Monitor' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setViewMode(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
              viewMode === tab.id
                ? 'bg-surface text-primary border border-primary-200' :'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Icon name={tab.icon} size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content based on view mode */}
      {viewMode === 'schedule' && renderScheduleView()}
      {viewMode === 'teachers' && renderTeachersView()}
      {viewMode === 'equipment' && renderEquipmentView()}
    </div>
  );
};

export default ResourceAllocationTable;