import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const AtRiskStudentPanel = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock data for at-risk students
  const atRiskStudents = [
    {
      id: 1,
      name: 'Arjun Menon',
      course: 'CAPT',
      riskLevel: 'high',
      riskFactors: ['Low Attendance', 'Poor Performance'],
      attendanceRate: 65.2,
      lastGrade: 'C',
      consecutiveAbsences: 5,
      contactInfo: {
        phone: '+91 98765 43210',
        email: 'arjun.menon@email.com'
      },
      interventions: [
        { type: 'counseling', date: '2024-01-15', status: 'scheduled' },
        { type: 'parent-meeting', date: '2024-01-18', status: 'pending' }
      ],
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      id: 2,
      name: 'Priya Nair',
      course: 'Fashion Designing',
      riskLevel: 'medium',
      riskFactors: ['Declining Grades'],
      attendanceRate: 78.5,
      lastGrade: 'C+',
      consecutiveAbsences: 2,
      contactInfo: {
        phone: '+91 98765 43211',
        email: 'priya.nair@email.com'
      },
      interventions: [
        { type: 'tutoring', date: '2024-01-16', status: 'completed' }
      ],
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    {
      id: 3,
      name: 'Rahul Kumar',
      course: 'Web Development',
      riskLevel: 'high',
      riskFactors: ['Low Attendance', 'Poor Performance', 'Financial Issues'],
      attendanceRate: 58.9,
      lastGrade: 'D',
      consecutiveAbsences: 7,
      contactInfo: {
        phone: '+91 98765 43212',
        email: 'rahul.kumar@email.com'
      },
      interventions: [
        { type: 'financial-aid', date: '2024-01-14', status: 'in-progress' },
        { type: 'counseling', date: '2024-01-17', status: 'scheduled' }
      ],
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    {
      id: 4,
      name: 'Sneha Pillai',
      course: 'Digital Marketing',
      riskLevel: 'medium',
      riskFactors: ['Irregular Attendance'],
      attendanceRate: 72.1,
      lastGrade: 'B-',
      consecutiveAbsences: 3,
      contactInfo: {
        phone: '+91 98765 43213',
        email: 'sneha.pillai@email.com'
      },
      interventions: [
        { type: 'mentoring', date: '2024-01-16', status: 'ongoing' }
      ],
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
    },
    {
      id: 5,
      name: 'Kiran Raj',
      course: 'Gama Abacus',
      riskLevel: 'low',
      riskFactors: ['Minor Performance Dip'],
      attendanceRate: 85.3,
      lastGrade: 'B',
      consecutiveAbsences: 1,
      contactInfo: {
        phone: '+91 98765 43214',
        email: 'kiran.raj@email.com'
      },
      interventions: [],
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
    }
  ];

  const riskFilters = [
    { value: 'all', label: 'All Risk Levels', count: atRiskStudents.length },
    { value: 'high', label: 'High Risk', count: atRiskStudents.filter(s => s.riskLevel === 'high').length },
    { value: 'medium', label: 'Medium Risk', count: atRiskStudents.filter(s => s.riskLevel === 'medium').length },
    { value: 'low', label: 'Low Risk', count: atRiskStudents.filter(s => s.riskLevel === 'low').length }
  ];

  const filteredStudents = selectedFilter === 'all' 
    ? atRiskStudents 
    : atRiskStudents.filter(student => student.riskLevel === selectedFilter);

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return 'text-error bg-error-50 border-error-200';
      case 'medium': return 'text-accent bg-accent-50 border-accent-200';
      case 'low': return 'text-secondary bg-secondary-50 border-secondary-200';
      default: return 'text-text-secondary bg-background border-border';
    }
  };

  const getInterventionStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-secondary bg-secondary-50';
      case 'in-progress': return 'text-primary bg-primary-50';
      case 'scheduled': return 'text-accent bg-accent-50';
      case 'ongoing': return 'text-primary bg-primary-50';
      case 'pending': return 'text-text-secondary bg-background';
      default: return 'text-text-secondary bg-background';
    }
  };

  const handleContactStudent = (student, method) => {
    console.log(`Contacting ${student.name} via ${method}`);
    // Implement contact functionality
  };

  const handleScheduleIntervention = (studentId, interventionType) => {
    console.log(`Scheduling ${interventionType} for student ${studentId}`);
    // Implement intervention scheduling
  };

  return (
    <div className="bg-surface rounded-lg border border-border shadow-sm">
      {/* Panel Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary flex items-center">
            <Icon name="AlertTriangle" size={20} className="mr-2 text-error" />
            At-Risk Students
          </h3>
          <div className="text-sm text-text-secondary">
            {filteredStudents.length} students
          </div>
        </div>

        {/* Risk Level Filters */}
        <div className="space-y-2">
          {riskFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedFilter(filter.value)}
              className={`w-full flex items-center justify-between p-2 rounded-md text-sm transition-colors duration-150 ${
                selectedFilter === filter.value
                  ? 'bg-primary-50 text-primary border border-primary-200' :'text-text-secondary hover:text-text-primary hover:bg-background'
              }`}
            >
              <span>{filter.label}</span>
              <span className="bg-background px-2 py-1 rounded-full text-xs">
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Student List */}
      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {filteredStudents.map((student) => (
          <div key={student.id} className="bg-background rounded-lg p-4 border border-border">
            {/* Student Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium text-text-primary">{student.name}</h4>
                  <p className="text-sm text-text-secondary">{student.course}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskLevelColor(student.riskLevel)}`}>
                {student.riskLevel} risk
              </span>
            </div>

            {/* Risk Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
              <div>
                <span className="text-text-secondary">Attendance:</span>
                <span className={`ml-2 font-medium ${
                  student.attendanceRate < 70 ? 'text-error' : 
                  student.attendanceRate < 80 ? 'text-accent' : 'text-secondary'
                }`}>
                  {student.attendanceRate}%
                </span>
              </div>
              <div>
                <span className="text-text-secondary">Last Grade:</span>
                <span className="ml-2 font-medium text-text-primary">{student.lastGrade}</span>
              </div>
              <div className="col-span-2">
                <span className="text-text-secondary">Consecutive Absences:</span>
                <span className={`ml-2 font-medium ${
                  student.consecutiveAbsences > 3 ? 'text-error' : 'text-text-primary'
                }`}>
                  {student.consecutiveAbsences} days
                </span>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="mb-3">
              <div className="text-xs text-text-secondary mb-1">Risk Factors:</div>
              <div className="flex flex-wrap gap-1">
                {student.riskFactors.map((factor, index) => (
                  <span key={index} className="px-2 py-1 bg-error-50 text-error text-xs rounded-full">
                    {factor}
                  </span>
                ))}
              </div>
            </div>

            {/* Active Interventions */}
            {student.interventions.length > 0 && (
              <div className="mb-3">
                <div className="text-xs text-text-secondary mb-1">Active Interventions:</div>
                <div className="space-y-1">
                  {student.interventions.map((intervention, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className="text-text-primary capitalize">
                        {intervention.type.replace('-', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full ${getInterventionStatusColor(intervention.status)}`}>
                        {intervention.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleContactStudent(student, 'phone')}
                  className="p-1.5 text-primary hover:bg-primary-50 rounded-md transition-colors duration-150"
                  title="Call Student"
                >
                  <Icon name="Phone" size={14} />
                </button>
                <button
                  onClick={() => handleContactStudent(student, 'email')}
                  className="p-1.5 text-secondary hover:bg-secondary-50 rounded-md transition-colors duration-150"
                  title="Email Student"
                >
                  <Icon name="Mail" size={14} />
                </button>
                <button
                  onClick={() => handleContactStudent(student, 'whatsapp')}
                  className="p-1.5 text-accent hover:bg-accent-50 rounded-md transition-colors duration-150"
                  title="WhatsApp"
                >
                  <Icon name="MessageCircle" size={14} />
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleScheduleIntervention(student.id, 'counseling')}
                  className="px-3 py-1 bg-primary text-white text-xs rounded-md hover:bg-primary-600 transition-colors duration-150"
                >
                  Schedule Counseling
                </button>
                <button className="p-1.5 text-text-secondary hover:text-text-primary transition-colors duration-150">
                  <Icon name="MoreVertical" size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Panel Footer */}
      <div className="p-4 border-t border-border">
        <button className="w-full flex items-center justify-center space-x-2 py-2 text-sm text-primary hover:bg-primary-50 rounded-md transition-colors duration-150">
          <Icon name="Plus" size={16} />
          <span>Add Manual Alert</span>
        </button>
      </div>
    </div>
  );
};

export default AtRiskStudentPanel;