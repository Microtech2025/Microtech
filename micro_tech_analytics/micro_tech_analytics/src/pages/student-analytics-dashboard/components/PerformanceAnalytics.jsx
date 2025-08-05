import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, Area, AreaChart } from 'recharts';
import Icon from 'components/AppIcon';

const PerformanceAnalytics = () => {
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('grades');

  // Mock data for grade distribution
  const gradeDistributionData = [
    { grade: 'A+', count: 245, percentage: 15.2 },
    { grade: 'A', count: 380, percentage: 23.6 },
    { grade: 'B+', count: 420, percentage: 26.1 },
    { grade: 'B', count: 315, percentage: 19.6 },
    { grade: 'C+', count: 180, percentage: 11.2 },
    { grade: 'C', count: 65, percentage: 4.0 },
    { grade: 'F', count: 5, percentage: 0.3 }
  ];

  // Mock data for course-wise performance comparison
  const coursePerformanceData = [
    { course: 'CAPT', avgScore: 82.5, passRate: 94.2, excellenceRate: 38.7 },
    { course: 'LBS Skill Training', avgScore: 78.3, passRate: 91.8, excellenceRate: 32.4 },
    { course: 'Gama Abacus', avgScore: 85.1, passRate: 96.7, excellenceRate: 45.2 },
    { course: 'Fashion Designing', avgScore: 79.8, passRate: 89.5, excellenceRate: 35.1 },
    { course: 'Digital Marketing', avgScore: 81.2, passRate: 93.1, excellenceRate: 41.3 },
    { course: 'Web Development', avgScore: 83.7, passRate: 95.4, excellenceRate: 43.8 }
  ];

  // Mock data for performance trends
  const performanceTrendsData = [
    { month: 'Jan', avgScore: 76.2, passRate: 89.5 },
    { month: 'Feb', avgScore: 77.8, passRate: 91.2 },
    { month: 'Mar', avgScore: 79.1, passRate: 92.8 },
    { month: 'Apr', avgScore: 80.5, passRate: 94.1 },
    { month: 'May', avgScore: 81.3, passRate: 95.2 },
    { month: 'Jun', avgScore: 82.7, passRate: 96.1 },
    { month: 'Jul', avgScore: 81.9, passRate: 94.8 },
    { month: 'Aug', avgScore: 80.2, passRate: 93.5 },
    { month: 'Sep', avgScore: 78.9, passRate: 92.1 },
    { month: 'Oct', avgScore: 79.8, passRate: 93.7 },
    { month: 'Nov', avgScore: 81.5, passRate: 95.3 },
    { month: 'Dec', avgScore: 82.1, passRate: 96.0 }
  ];

  // Mock data for subject-wise performance
  const subjectPerformanceData = [
    { subject: 'Mathematics', avgScore: 78.5, difficulty: 'High', improvement: '+2.3%' },
    { subject: 'English', avgScore: 82.1, difficulty: 'Medium', improvement: '+1.8%' },
    { subject: 'Computer Science', avgScore: 85.3, difficulty: 'Medium', improvement: '+3.1%' },
    { subject: 'Business Studies', avgScore: 79.8, difficulty: 'Medium', improvement: '+0.9%' },
    { subject: 'Design Fundamentals', avgScore: 81.7, difficulty: 'Low', improvement: '+2.7%' },
    { subject: 'Communication Skills', avgScore: 84.2, difficulty: 'Low', improvement: '+1.5%' }
  ];

  const courses = [
    { value: 'all', label: 'All Courses' },
    { value: 'capt', label: 'CAPT' },
    { value: 'lbs', label: 'LBS Skill Training' },
    { value: 'gama', label: 'Gama Abacus' },
    { value: 'fashion', label: 'Fashion Designing' },
    { value: 'digital', label: 'Digital Marketing' },
    { value: 'web', label: 'Web Development' }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'High': return 'text-error bg-error-50 border-error-200';
      case 'Medium': return 'text-accent bg-accent-50 border-accent-200';
      case 'Low': return 'text-secondary bg-secondary-50 border-secondary-200';
      default: return 'text-text-secondary bg-background border-border';
    }
  };

  const getImprovementColor = (improvement) => {
    return improvement.startsWith('+') 
      ? 'text-secondary' :'text-error';
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h3 className="text-lg font-semibold text-text-primary">Performance Analytics</h3>
        <div className="flex items-center space-x-4">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="bg-surface border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {courses.map((course) => (
              <option key={course.value} value={course.value}>{course.label}</option>
            ))}
          </select>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="bg-surface border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="grades">Grade Distribution</option>
            <option value="trends">Performance Trends</option>
            <option value="subjects">Subject Analysis</option>
          </select>
        </div>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-primary">78.5%</div>
              <div className="text-sm text-text-secondary">Average Score</div>
            </div>
            <Icon name="TrendingUp" size={24} className="text-primary" />
          </div>
        </div>
        <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-secondary">94.2%</div>
              <div className="text-sm text-text-secondary">Pass Rate</div>
            </div>
            <Icon name="CheckCircle" size={24} className="text-secondary" />
          </div>
        </div>
        <div className="bg-accent-50 rounded-lg p-4 border border-accent-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-accent">39.1%</div>
              <div className="text-sm text-text-secondary">Excellence Rate</div>
            </div>
            <Icon name="Award" size={24} className="text-accent" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution */}
        <div className="bg-background rounded-lg p-6 border border-border">
          <h4 className="text-md font-semibold text-text-primary mb-4 flex items-center">
            <Icon name="BarChart3" size={16} className="mr-2" />
            Grade Distribution
          </h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="grade" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'count' ? `${value} students` : `${value}%`,
                    name === 'count' ? 'Students' : 'Percentage'
                  ]}
                  labelStyle={{ color: '#1f2937' }}
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
                />
                <Bar dataKey="count" fill="#3b82f6" name="count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Trends */}
        <div className="bg-background rounded-lg p-6 border border-border">
          <h4 className="text-md font-semibold text-text-primary mb-4 flex items-center">
            <Icon name="TrendingUp" size={16} className="mr-2" />
            Performance Trends
          </h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'avgScore' ? `${value}%` : `${value}%`,
                    name === 'avgScore' ? 'Average Score' : 'Pass Rate'
                  ]}
                  labelStyle={{ color: '#1f2937' }}
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="avgScore" 
                  stroke="#3b82f6" 
                  fill="#bfdbfe" 
                  name="avgScore"
                />
                <Line 
                  type="monotone" 
                  dataKey="passRate" 
                  stroke="#059669" 
                  strokeWidth={2}
                  name="passRate"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Course-wise Performance Comparison */}
      <div className="bg-background rounded-lg p-6 border border-border">
        <h4 className="text-md font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="BookOpen" size={16} className="mr-2" />
          Course-wise Performance Comparison
        </h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={coursePerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="course" 
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
                formatter={(value, name) => [
                  `${value}%`,
                  name === 'avgScore' ? 'Average Score' : 
                  name === 'passRate' ? 'Pass Rate' : 'Excellence Rate'
                ]}
                labelStyle={{ color: '#1f2937' }}
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="avgScore" fill="#3b82f6" name="avgScore" />
              <Bar dataKey="passRate" fill="#059669" name="passRate" />
              <Bar dataKey="excellenceRate" fill="#d97706" name="excellenceRate" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject-wise Performance */}
      <div className="bg-background rounded-lg p-6 border border-border">
        <h4 className="text-md font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="BookOpen" size={16} className="mr-2" />
          Subject-wise Performance Analysis
        </h4>
        <div className="space-y-4">
          {subjectPerformanceData.map((subject, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-text-primary">{subject.subject}</h5>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(subject.difficulty)}`}>
                      {subject.difficulty}
                    </span>
                    <span className={`text-sm font-medium ${getImprovementColor(subject.improvement)}`}>
                      {subject.improvement}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <div className="w-full bg-border rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${subject.avgScore}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-text-primary">{subject.avgScore}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;