import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AppLayout } from './layouts/AppLayout';

// Public pages
import { HomePage } from './pages/public/HomePage';
import { LoginPage } from './pages/public/LoginPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/public/ResetPasswordPage';
import { NoticesPage } from './pages/public/NoticesPage';

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminMines } from './pages/admin/AdminMines';
import { AdminCompliance } from './pages/admin/AdminCompliance';
import { AdminAlerts } from './pages/admin/AdminAlerts';
import { AdminInspections } from './pages/admin/AdminInspections';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminExperts } from './pages/admin/AdminExperts';
import { AdminNotifications } from './pages/admin/AdminNotifications';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminSettings } from './pages/admin/AdminSettings';

// Inspector pages
import { InspectorDashboard } from './pages/inspector/InspectorDashboard';
import { InspectorAlerts } from './pages/inspector/InspectorAlerts';
import { InspectorInspections } from './pages/inspector/InspectorInspections';
import { InspectorViolations } from './pages/inspector/InspectorViolations';
import { InspectorReports } from './pages/inspector/InspectorReports';
import { InspectorProfile } from './pages/inspector/InspectorProfile';

// Mine Authority pages
import { MineDashboard } from './pages/mine/MineDashboard';
import { MineProfile } from './pages/mine/MineProfile';
import { MineSubmitData } from './pages/mine/MineSubmitData';
import { MineCompliance } from './pages/mine/MineCompliance';
import { MineViolations } from './pages/mine/MineViolations';
import { MineActions } from './pages/mine/MineActions';
import { MineInspections } from './pages/mine/MineInspections';
import { MineDocuments } from './pages/mine/MineDocuments';
import { MineHelp } from './pages/mine/MineHelp';

// Root redirect handler
const RootRedirect: React.FC = () => {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#071a2b] text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-300">Loading KOYLA DRISHTI...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'inspector') return <Navigate to="/inspector/dashboard" replace />;
  if (role === 'mine') return <Navigate to="/mine/dashboard" replace />;

  return <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ToastProvider>
          <AuthProvider>
            <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/notices" element={<NoticesPage />} />
            <Route path="/portal" element={<RootRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="mines" element={<AdminMines />} />
              <Route path="compliance" element={<AdminCompliance />} />
              <Route path="alerts" element={<AdminAlerts />} />
              <Route path="inspections" element={<AdminInspections />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="experts" element={<AdminExperts />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Inspector routes */}
            <Route
              path="/inspector"
              element={
                <ProtectedRoute allowedRole="inspector">
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/inspector/dashboard" replace />} />
              <Route path="dashboard" element={<InspectorDashboard />} />
              <Route path="mines" element={<AdminMines />} />
              <Route path="alerts" element={<InspectorAlerts />} />
              <Route path="inspections" element={<InspectorInspections />} />
              <Route path="violations" element={<InspectorViolations />} />
              <Route path="actions" element={<InspectorViolations />} />
              <Route path="evidence" element={<MineDocuments />} />
              <Route path="reports" element={<InspectorReports />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="profile" element={<InspectorProfile />} />
            </Route>

            {/* Mine Authority routes */}
            <Route
              path="/mine"
              element={
                <ProtectedRoute allowedRole="mine">
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/mine/dashboard" replace />} />
              <Route path="dashboard" element={<MineDashboard />} />
              <Route path="profile" element={<MineProfile />} />
              <Route path="submit-data" element={<MineSubmitData />} />
              <Route path="compliance" element={<MineCompliance />} />
              <Route path="violations" element={<MineViolations />} />
              <Route path="actions" element={<MineActions />} />
              <Route path="inspections" element={<MineInspections />} />
              <Route path="documents" element={<MineDocuments />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="help" element={<MineHelp />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </LanguageProvider>
  </BrowserRouter>
  );
}
