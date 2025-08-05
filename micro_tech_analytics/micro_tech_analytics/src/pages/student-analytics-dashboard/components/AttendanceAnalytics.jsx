import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from 'components/AppIcon';

const AttendanceAnalytics = () => {
  const [selectedView, setSelectedView] = useState('heatmap');
  const [selectedMonth, setSelectedMonth] = useState('current');

  // Mock data for attendance heatmap (simplified for display)
  const attendanceHeatmapData = [
    { day: 'Mon', week1: 92, week2: 88, week3: 94, week4: 89 },
    { day: 'Tue', week1: 89, week2: 91, week3: 87, week4: 93 },
    { day: 'Wed', week1: 94, week2: 86, week3: 92, week4: 88 },
    { day: 'Thu', week1: 87, week2: 93, week3: 89, week4: 91 },
    { day: 'Fri', week1: 91, week2: 89, week3: 93, week4: 87 },
    { day: 'Sat', week1: 85, week2: 87, week3: 86, week4: 89 }
  ];

  // Mock data for attendance trends
  const attendanceTrendsData = [
    { date: '01', attendance: 89.2, target: 90 },
    { date: '02', attendance: 91.5, target: 90 },
    { date: '03', attendance: 87.8, target: 90 },
    { date: '04', attendance: 93.1, target: 90 },
    { date: '05', attendance: 88.7, target: 90 },
    { date: '06', attendance: 92.3, target: 90 },
    { date: '07', attendance: 90.1, target: 90 },
    { date: '08', attendance: 86.9, target: 90 },
    { date: '09', attendance: 94.2, target: 90 },
    { date: '10', attendance: 89.8, target: 90 },
    { date: '11', attendance: 91.7, target: 90 },
    { date: '12', attendance: 88.4, target: 90 },
    { date: '13', attendance: 92.8, target: 90 },
    { date: '14', attendance: 87.6, target: 90 },
    { date: '15', attendance: 90.9, target: 90 }
  ];

  // Mock data for course-wise attendance
  const courseAttendanceData = [
    { course: 'CAPT', attendance: 91.2, trend: '+2.3%', status: 'good' },
    { course: 'LBS Skill Training', attendance: 88.7, trend: '-1.2%', status: 'warning' },
    { course: 'Gama Abacus', attendance: 94.1, trend: '+3.1%', status: 'excellent' },
    { course: 'Fashion Designing', attendance: 86.5, trend: '-2.8%', status: 'warning' },
    { course: 'Digital Marketing', attendance: 89.8, trend: '+1.5%', status: 'good' },
    { course: 'Web Development', attendance: 92.4, trend: '+2.7%', status: 'good' }
  ];

  // Mock data for time-based attendance patterns
  const timePatternData = [
    { time: '9:00 AM', attendance: 95.2 },
    { time: '10:00 AM', attendance: 92.8 },
    { time: '11:00 AM', attendance: 89.5 },
    { time: '12:00 PM', attendance: 87.1 },
    { time: '1:00 PM', attendance: 84.3 },
    { time: '2:00 PM', attendance: 88.7 },
    { time: '3:00 PM', attendance: 91.2 },
    { time: '4:00 PM', attendance: 89.8 },
    { time: '5:00 PM', attendance: 86.4 }
  ];

  // Mock data for early warning alerts
  const earlyWarningAlerts = [
    {
      id: 1,
      student: 'Arjun Menon',
      course: 'CAPT',
      attendanceRate: 72.5,
      consecutiveAbsences: 3,
      riskLevel: 'high',
      lastAttended: '2024-01-15'
    },
    {
      id: 2,
      student: 'Priya Nair',
      course: 'Fashion Designing',
      attendanceRate: 78.2,
      consecutiveAbsences: 2,
      riskLevel: 'medium',
      lastAttended: '2024-01-16'
    },
    {
      id: 3,
      student: 'Rahul Kumar',
      course: 'Web Development',
      attendanceRate: 68.9,
      consecutiveAbsences: 4,
      riskLevel: 'high',
      lastAttended: '2024-01-14'
    },
    {
      id: 4,
      student: 'Sneha Pillai',
      course: 'Digital Marketing',
      attendanceRate: 81.3,
      consecutiveAbsences: 2,
      riskLevel: 'medium',
      lastAttended: '2024-01-16'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-secondary bg-secondary-50 border-secondary-200';
      case 'good': return 'text-primary bg-primary-50 border-primary-200';
      case 'warning': return 'text-accent bg-accent-50 border-accent-200';
      case 'poor': return 'text-error bg-error-50 border-error-200';
      default: return 'text-text-secondary bg-background border-border';
    }
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return 'text-error bg-error-50 border-error-200';
      case 'medium': return 'text-accent bg-accent-50 border-accent-200';
      case 'low': return 'text-secondary bg-secondary-50 border-secondary-200';
      default: return 'text-text-secondary bg-background border-border';
    }
  };

  const getTrendColor = (trend) => {
    return trend.startsWith('+') ? 'text-secondary' : 'text-error';
  };

  const getAttendanceColor = (rate) => {
    if (rate >= 90) return '#059669'; // Green
    if (rate >= 80) return '#d97706'; // Amber
    return '#ef4444'; // Red
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h3 className="text-lg font-semibold text-text-primary">Attendance Analytics</h3>
        <div className="flex items-center space-x-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-surface border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="current">Current Month</option>
            <option value="last">Last Month</option>
            <option value="semester">Current Semester</option>
          </select>
          <select
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
            className="bg-surface border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="heatmap">Heatmap View</option>
            <option value="trends">Trend Analysis</option>
            <option value="patterns">Time Patterns</option>
          </select>
        </div>
      </div>

      {/* Attendance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-primary">87.3%</div>
              <div className="text-sm text-text-secondary">Overall Attendance</div>
            </div>
            <Icon name="Users" size={24} className="text-primary" />
          </div>
        </div>
        <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-secondary">2,485</div>
              <div className="text-sm text-text-secondary">Present Today</div>
            </div>
            <Icon name="CheckCircle" size={24} className="text-secondary" />
          </div>
        </div>
        <div className="bg-accent-50 rounded-lg p-4 border border-accent-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-accent">362</div>
              <div className="text-sm text-text-secondary">Absent Today</div>
            </div>
            <Icon name="XCircle" size={24} className="text-accent" />
          </div>
        </div>
        <div className="bg-error-50 rounded-lg p-4 border border-error-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-error">23</div>
              <div className="text-sm text-text-secondary">At-Risk Students</div>
            </div>
            <Icon name="AlertTriangle" size={24} className="text-error" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trends */}
        <div className="bg-background rounded-lg p-6 border border-border">
          <h4 className="text-md font-semibold text-text-primary mb-4 flex items-center">
            <Icon name="TrendingUp" size={16} className="mr-2" />
            Daily Attendance Trends
          </h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  domain={[80, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value}%`,
                    name === 'attendance' ? 'Attendance' : 'Target'
                  ]}
                  labelStyle={{ color: '#1f2937' }}
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#9ca3af" 
                  strokeDasharray="5 5"
                  name="target"
                />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="attendance"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time-based Attendance Patterns */}
        <div className="bg-background rounded-lg p-6 border border-border">
          <h4 className="text-md font-semibold text-text-primary mb-4 flex items-center">
            <Icon name="Clock" size={16} className="mr-2" />
            Hourly Attendance Patterns
          </h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timePatternData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Attendance Rate']}
                  labelStyle={{ color: '#1f2937' }}
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
                />
                <Bar 
                  dataKey="attendance" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Course-wise Attendance */}
      <div className="bg-background rounded-lg p-6 border border-border">
        <h4 className="text-md font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="BookOpen" size={16} className="mr-2" />
          Course-wise Attendance Performance
        </h4>
        <div className="space-y-4">
          {courseAttendanceData.map((course, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-text-primary">{course.course}</h5>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(course.status)}`}>
                      {course.status}
                    </span>
                    <span className={`text-sm font-medium ${getTrendColor(course.trend)}`}>
                      {course.trend}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <div className="w-full bg-border rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${course.attendance}%`,
                          backgroundColor: getAttendanceColor(course.attendance)
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-text-primary">{course.attendance}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Early Warning Alerts */}
      <div className="bg-background rounded-lg p-6 border border-border">
        <h4 className="text-md font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="AlertTriangle" size={16} className="mr-2" />
          Early Warning Alerts - At-Risk Students
        </h4>
        <div className="space-y-4">
          {earlyWarningAlerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h5 className="font-medium text-text-primary">{alert.student}</h5>
                    <p className="text-sm text-text-secondary">{alert.course}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskLevelColor(alert.riskLevel)}`}>
                    {alert.riskLevel} risk
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-text-secondary">Attendance Rate:</span>
                    <span className="ml-2 font-medium text-text-primary">{alert.attendanceRate}%</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">Consecutive Absences:</span>
                    <span className="ml-2 font-medium text-text-primary">{alert.consecutiveAbsences}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary">Last Attended:</span>
                    <span className="ml-2 font-medium text-text-primary">{alert.lastAttended}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button className="p-2 text-primary hover:bg-primary-50 rounded-md transition-colors duration-150">
                  <Icon name="Phone" size={16} />
                </button>
                <button className="p-2 text-secondary hover:bg-secondary-50 rounded-md transition-colors duration-150">
                  <Icon name="Mail" size={16} />
                </button>
                <button className="p-2 text-accent hover:bg-accent-50 rounded-md transition-colors duration-150">
                  <Icon name="MessageCircle" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Heatmap Calendar */}
      <div className="bg-background rounded-lg p-6 border border-border">
        <h4 className="text-md font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="Calendar" size={16} className="mr-2" />
          Weekly Attendance Heatmap
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-sm font-medium text-text-secondary p-2">Day</th>
                <th className="text-center text-sm font-medium text-text-secondary p-2">Week 1</th>
                <th className="text-center text-sm font-medium text-text-secondary p-2">Week 2</th>
                <th className="text-center text-sm font-medium text-text-secondary p-2">Week 3</th>
                <th className="text-center text-sm font-medium text-text-secondary p-2">Week 4</th>
              </tr>
            </thead>
            <tbody>
              {attendanceHeatmapData.map((row, index) => (
                <tr key={index}>
                  <td className="text-sm font-medium text-text-primary p-2">{row.day}</td>
                  <td className="p-2">
                    <div 
                      className="w-12 h-8 rounded flex items-center justify-center text-xs font-medium text-white mx-auto"
                      style={{ backgroundColor: getAttendanceColor(row.week1) }}
                    >
                      {row.week1}%
                    </div>
                  </td>
                  <td className="p-2">
                    <div 
                      className="w-12 h-8 rounded flex items-center justify-center text-xs font-medium text-white mx-auto"
                      style={{ backgroundColor: getAttendanceColor(row.week2) }}
                    >
                      {row.week2}%
                    </div>
                  </td>
                  <td className="p-2">
                    <div 
                      className="w-12 h-8 rounded flex items-center justify-center text-xs font-medium text-white mx-auto"
                      style={{ backgroundColor: getAttendanceColor(row.week3) }}
                    >
                      {row.week3}%
                    </div>
                  </td>
                  <td className="p-2">
                    <div 
                      className="w-12 h-8 rounded flex items-center justify-center text-xs font-medium text-white mx-auto"
                      style={{ backgroundColor: getAttendanceColor(row.week4) }}
                    >
                      {row.week4}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-center space-x-4 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-secondary rounded"></div>
            <span className="text-text-secondary">90%+ Excellent</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-accent rounded"></div>
            <span className="text-text-secondary">80-89% Good</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-error rounded"></div>
            <span className="text-text-secondary">&lt;80% Needs Attention</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceAnalytics;