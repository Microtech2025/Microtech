import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ExecutiveOverviewDashboard from "pages/executive-overview-dashboard";
import FinancialPerformanceDashboard from "pages/financial-performance-dashboard";
import OperationsMonitoringDashboard from "pages/operations-monitoring-dashboard";
import StudentAnalyticsDashboard from "pages/student-analytics-dashboard";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<ExecutiveOverviewDashboard />} />
          <Route path="/executive-overview-dashboard" element={<ExecutiveOverviewDashboard />} />
          <Route path="/financial-performance-dashboard" element={<FinancialPerformanceDashboard />} />
          <Route path="/operations-monitoring-dashboard" element={<OperationsMonitoringDashboard />} />
          <Route path="/student-analytics-dashboard" element={<StudentAnalyticsDashboard />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;