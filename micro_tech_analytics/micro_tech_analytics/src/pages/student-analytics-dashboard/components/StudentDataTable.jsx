import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const StudentDataTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock student data
  const studentsData = [
    {
      id: 1,
      name: 'Arjun Menon',
      email: 'arjun.menon@email.com',
      phone: '+91 98765 43210',
      course: 'CAPT',
      batch: 'CAPT-2024-A',
      enrollmentDate: '2024-01-15',
      attendanceRate: 87.5,
      currentGrade: 'B+',
      status: 'active',
      riskLevel: 'low',
      lastActivity: '2024-01-18',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      id: 2,
      name: 'Priya Nair',
      email: 'priya.nair@email.com',
      phone: '+91 98765 43211',
      course: 'Fashion Designing',
      batch: 'FD-2024-B',
      enrollmentDate: '2024-01-10',
      attendanceRate: 92.3,
      currentGrade: 'A',
      status: 'active',
      riskLevel: 'low',
      lastActivity: '2024-01-18',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    {
      id: 3,
      name: 'Rahul Kumar',
      email: 'rahul.kumar@email.com',
      phone: '+91 98765 43212',
      course: 'Web Development',
      batch: 'WD-2024-A',
      enrollmentDate: '2024-01-08',
      attendanceRate: 68.9,
      currentGrade: 'C',
      status: 'at-risk',
      riskLevel: 'high',
      lastActivity: '2024-01-16',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    {
      id: 4,
      name: 'Sneha Pillai',
      email: 'sneha.pillai@email.com',
      phone: '+91 98765 43213',
      course: 'Digital Marketing',
      batch: 'DM-2024-A',
      enrollmentDate: '2024-01-12',
      attendanceRate: 85.7,
      currentGrade: 'B',
      status: 'active',
      riskLevel: 'medium',
      lastActivity: '2024-01-18',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
    },
    {
      id: 5,
      name: 'Kiran Raj',
      email: 'kiran.raj@email.com',
      phone: '+91 98765 43214',
      course: 'Gama Abacus',
      batch: 'GA-2024-C',
      enrollmentDate: '2024-01-20',
      attendanceRate: 94.1,
      currentGrade: 'A+',
      status: 'active',
      riskLevel: 'low',
      lastActivity: '2024-01-18',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
    },
    {
      id: 6,
      name: 'Maya Krishnan',
      email: 'maya.krishnan@email.com',
      phone: '+91 98765 43215',
      course: 'LBS Skill Training',
      batch: 'LBS-2024-B',
      enrollmentDate: '2024-01-05',
      attendanceRate: 78.2,
      currentGrade: 'B-',
      status: 'active',
      riskLevel: 'medium',
      lastActivity: '2024-01-17',
      avatar: 'https://randomuser.me/api/portraits/women/6.jpg'
    },
    {
      id: 7,
      name: 'Arun Varma',
      email: 'arun.varma@email.com',
      phone: '+91 98765 43216',
      course: 'CAPT',
      batch: 'CAPT-2024-B',
      enrollmentDate: '2024-01-18',
      attendanceRate: 89.4,
      currentGrade: 'A-',
      status: 'active',
      riskLevel: 'low',
      lastActivity: '2024-01-18',
      avatar: 'https://randomuser.me/api/portraits/men/7.jpg'
    },
    {
      id: 8,
      name: 'Divya Mohan',
      email: 'divya.mohan@email.com',
      phone: '+91 98765 43217',
      course: 'Fashion Designing',
      batch: 'FD-2024-A',
      enrollmentDate: '2024-01-03',
      attendanceRate: 91.8,
      currentGrade: 'A',
      status: 'active',
      riskLevel: 'low',
      lastActivity: '2024-01-18',
      avatar: 'https://randomuser.me/api/portraits/women/8.jpg'
    }
  ];

  const courses = [
    { value: 'all', label: 'All Courses' },
    { value: 'CAPT', label: 'CAPT' },
    { value: 'LBS Skill Training', label: 'LBS Skill Training' },
    { value: 'Gama Abacus', label: 'Gama Abacus' },
    { value: 'Fashion Designing', label: 'Fashion Designing' },
    { value: 'Digital Marketing', label: 'Digital Marketing' },
    { value: 'Web Development', label: 'Web Development' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'at-risk', label: 'At Risk' },
    { value: 'inactive', label: 'Inactive' }
  ];

  // Filter and sort data
  const filteredData = studentsData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || student.course === selectedCourse;
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-secondary bg-secondary-50 border-secondary-200';
      case 'at-risk': return 'text-error bg-error-50 border-error-200';
      case 'inactive': return 'text-text-secondary bg-background border-border';
      default: return 'text-text-secondary bg-background border-border';
    }
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return 'text-error';
      case 'medium': return 'text-accent';
      case 'low': return 'text-secondary';
      default: return 'text-text-secondary';
    }
  };

  const handleStudentAction = (studentId, action) => {
    console.log(`Performing ${action} on student ${studentId}`);
    // Implement action functionality
  };

  return (
    <div className="bg-surface rounded-lg border border-border shadow-sm">
      {/* Table Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <h3 className="text-lg font-semibold text-text-primary">Student Records</h3>
          
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              />
            </div>
            
            {/* Course Filter */}
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
            >
              {courses.map((course) => (
                <option key={course.value} value={course.value}>{course.label}</option>
              ))}
            </select>
            
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
            >
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background">
            <tr>
              <th className="text-left p-4 font-medium text-text-secondary">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 hover:text-text-primary"
                >
                  <span>Student</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-text-secondary">
                <button
                  onClick={() => handleSort('course')}
                  className="flex items-center space-x-1 hover:text-text-primary"
                >
                  <span>Course</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-text-secondary">
                <button
                  onClick={() => handleSort('attendanceRate')}
                  className="flex items-center space-x-1 hover:text-text-primary"
                >
                  <span>Attendance</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-text-secondary">
                <button
                  onClick={() => handleSort('currentGrade')}
                  className="flex items-center space-x-1 hover:text-text-primary"
                >
                  <span>Grade</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-text-secondary">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 hover:text-text-primary"
                >
                  <span>Status</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-text-secondary">Risk Level</th>
              <th className="text-center p-4 font-medium text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((student) => (
              <tr key={student.id} className="border-t border-border hover:bg-background transition-colors duration-150">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-text-primary">{student.name}</div>
                      <div className="text-sm text-text-secondary">{student.email}</div>
                      <div className="text-xs text-text-secondary">{student.batch}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-text-primary">{student.course}</div>
                  <div className="text-sm text-text-secondary">
                    Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-border rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          student.attendanceRate >= 90 ? 'bg-secondary' :
                          student.attendanceRate >= 80 ? 'bg-accent' : 'bg-error'
                        }`}
                        style={{ width: `${student.attendanceRate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-text-primary">
                      {student.attendanceRate}%
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-medium text-text-primary">{student.currentGrade}</span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(student.status)}`}>
                    {student.status}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`font-medium ${getRiskLevelColor(student.riskLevel)}`}>
                    {student.riskLevel}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleStudentAction(student.id, 'counseling')}
                      className="p-2 text-primary hover:bg-primary-50 rounded-md transition-colors duration-150"
                      title="Schedule Counseling"
                    >
                      <Icon name="MessageSquare" size={16} />
                    </button>
                    <button
                      onClick={() => handleStudentAction(student.id, 'contact')}
                      className="p-2 text-secondary hover:bg-secondary-50 rounded-md transition-colors duration-150"
                      title="Contact Student"
                    >
                      <Icon name="Phone" size={16} />
                    </button>
                    <button
                      onClick={() => handleStudentAction(student.id, 'progress')}
                      className="p-2 text-accent hover:bg-accent-50 rounded-md transition-colors duration-150"
                      title="View Progress"
                    >
                      <Icon name="TrendingUp" size={16} />
                    </button>
                    <button
                      onClick={() => handleStudentAction(student.id, 'more')}
                      className="p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded-md transition-colors duration-150"
                      title="More Actions"
                    >
                      <Icon name="MoreVertical" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <span>Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-2 py-1 border border-border rounded text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>of {sortedData.length} students</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-text-secondary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
              <Icon name="ChevronLeft" size={16} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md text-sm transition-colors duration-150 ${
                  currentPage === page
                    ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-background'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-text-secondary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
              <Icon name="ChevronRight" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDataTable;