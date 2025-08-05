import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, FunnelChart, Funnel, Cell, PieChart, Pie } from 'recharts';
import Icon from 'components/AppIcon';

const EnrollmentAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-semester');

  // Mock data for enrollment funnel
  const enrollmentFunnelData = [
    { name: 'Inquiries', value: 1250, fill: '#3b82f6' },
    { name: 'Applications', value: 890, fill: '#2563eb' },
    { name: 'Interviews', value: 720, fill: '#1d4ed8' },
    { name: 'Offers', value: 650, fill: '#1e40af' },
    { name: 'Enrollments', value: 580, fill: '#1e3a8a' }
  ];

  // Mock data for course-wise enrollment
  const courseEnrollmentData = [
    { course: 'CAPT', enrolled: 850, capacity: 1000, percentage: 85 },
    { course: 'LBS Skill Training', enrolled: 720, capacity: 800, percentage: 90 },
    { course: 'Gama Abacus', enrolled: 450, capacity: 500, percentage: 90 },
    { course: 'Fashion Designing', entered: 380, capacity: 400, percentage: 95 },
    { course: 'Digital Marketing', enrolled: 320, capacity: 350, percentage: 91 },
    { course: 'Web Development', enrolled: 280, capacity: 300, percentage: 93 }
  ];

  // Mock data for enrollment trends
  const enrollmentTrendsData = [
    { month: 'Jan', enrollments: 45, inquiries: 120 },
    { month: 'Feb', enrollments: 52, inquiries: 135 },
    { month: 'Mar', enrollments: 68, inquiries: 150 },
    { month: 'Apr', enrollments: 85, inquiries: 180 },
    { month: 'May', enrollments: 92, inquiries: 195 },
    { month: 'Jun', enrollments: 110, inquiries: 220 },
    { month: 'Jul', enrollments: 125, inquiries: 240 },
    { month: 'Aug', enrollments: 98, inquiries: 210 },
    { month: 'Sep', enrollments: 88, inquiries: 195 },
    { month: 'Oct', enrollments: 75, inquiries: 175 },
    { month: 'Nov', enrollments: 65, inquiries: 160 },
    { month: 'Dec', enrollments: 58, inquiries: 145 }
  ];

  // Mock data for demographic distribution
  const demographicData = [
    { name: '18-22 years', value: 45, fill: '#3b82f6' },
    { name: '23-27 years', value: 30, fill: '#2563eb' },
    { name: '28-32 years', value: 15, fill: '#1d4ed8' },
    { name: '33+ years', value: 10, fill: '#1e40af' }
  ];

  const conversionRates = {
    inquiryToApplication: ((890 / 1250) * 100).toFixed(1),
    applicationToInterview: ((720 / 890) * 100).toFixed(1),
    interviewToOffer: ((650 / 720) * 100).toFixed(1),
    offerToEnrollment: ((580 / 650) * 100).toFixed(1),
    overallConversion: ((580 / 1250) * 100).toFixed(1)
  };

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">Enrollment Analytics</h3>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="bg-surface border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="current-semester">Current Semester</option>
          <option value="last-semester">Last Semester</option>
          <option value="academic-year">Academic Year</option>
          <option value="last-year">Last Year</option>
        </select>
      </div>

      {/* Conversion Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
          <div className="text-2xl font-bold text-primary">{conversionRates.inquiryToApplication}%</div>
          <div className="text-sm text-text-secondary">Inquiry → Application</div>
        </div>
        <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-200">
          <div className="text-2xl font-bold text-secondary">{conversionRates.applicationToInterview}%</div>
          <div className="text-sm text-text-secondary">Application → Interview</div>
        </div>
        <div className="bg-accent-50 rounded-lg p-4 border border-accent-200">
          <div className="text-2xl font-bold text-accent">{conversionRates.interviewToOffer}%</div>
          <div className="text-sm text-text-secondary">Interview → Offer</div>
        </div>
        <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-200">
          <div className="text-2xl font-bold text-secondary">{conversionRates.offerToEnrollment}%</div>
          <div className="text-sm text-text-secondary">Offer → Enrollment</div>
        </div>
        <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
          <div className="text-2xl font-bold text-primary">{conversionRates.overallConversion}%</div>
          <div className="text-sm text-text-secondary">Overall Conversion</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Funnel */}
        <div className="bg-background rounded-lg p-6 border border-border">
          <h4 className="text-md font-semibold text-text-primary mb-4 flex items-center">
            <Icon name="Filter" size={16} className="mr-2" />
            Enrollment Funnel
          </h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip 
                  formatter={(value, name) => [`${value.toLocaleString('en-IN')}`, name]}
                  labelStyle={{ color: '#1f2937' }}
                />
                <Funnel
                  dataKey="value"
                  data={enrollmentFunnelData}
                  isAnimationActive={true}
                />
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Demographic Distribution */}
        <div className="bg-background rounded-lg p-6 border border-border">
          <h4 className="text-md font-semibold text-text-primary mb-4 flex items-center">
            <Icon name="Users" size={16} className="mr-2" />
            Age Group Distribution
          </h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demographicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {demographicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {demographicData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.fill }}></div>
                  <span className="text-sm text-text-secondary">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-text-primary">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enrollment Trends */}
      <div className="bg-background rounded-lg p-6 border border-border">
        <h4 className="text-md font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="TrendingUp" size={16} className="mr-2" />
          Monthly Enrollment Trends
        </h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={enrollmentTrendsData}>
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
                formatter={(value, name) => [value, name === 'enrollments' ? 'Enrollments' : 'Inquiries']}
                labelStyle={{ color: '#1f2937' }}
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="inquiries" fill="#bfdbfe" name="inquiries" />
              <Bar dataKey="enrollments" fill="#3b82f6" name="enrollments" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Course-wise Enrollment */}
      <div className="bg-background rounded-lg p-6 border border-border">
        <h4 className="text-md font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="BookOpen" size={16} className="mr-2" />
          Course-wise Enrollment Status
        </h4>
        <div className="space-y-4">
          {courseEnrollmentData.map((course, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-text-primary">{course.course}</h5>
                  <span className="text-sm text-text-secondary">
                    {course.enrolled?.toLocaleString('en-IN') || course.entered?.toLocaleString('en-IN')} / {course.capacity.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${course.percentage}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-text-secondary">Capacity Utilization</span>
                  <span className="text-xs font-medium text-primary">{course.percentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnrollmentAnalytics;