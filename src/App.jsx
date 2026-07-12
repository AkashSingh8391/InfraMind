import { Routes, Route, Navigate } from 'react-router-dom';

import AuthLayout from './layouts/AuthLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import RoleRoute from './routes/RoleRoute.jsx';

import Landing from './pages/Landing.jsx';
import NotFound from './pages/NotFound.jsx';

import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';

import CitizenDashboard from './pages/citizen/CitizenDashboard.jsx';
import CreateComplaint from './pages/citizen/CreateComplaint.jsx';
import MyComplaints from './pages/citizen/MyComplaints.jsx';
import ComplaintDetail from './pages/citizen/ComplaintDetail.jsx';
import Bookmarks from './pages/citizen/Bookmarks.jsx';
import Profile from './pages/citizen/Profile.jsx';

import OfficerDashboard from './pages/officer/OfficerDashboard.jsx';
import AssignedComplaints from './pages/officer/AssignedComplaints.jsx';
import ComplaintUpdate from './pages/officer/ComplaintUpdate.jsx';

import ManagerDashboard from './pages/manager/ManagerDashboard.jsx';
import ManageOfficers from './pages/manager/ManageOfficers.jsx';
import DepartmentStats from './pages/manager/DepartmentStats.jsx';

import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import UserManagement from './pages/admin/UserManagement.jsx';
import Departments from './pages/admin/Departments.jsx';
import AuditLogs from './pages/admin/AuditLogs.jsx';
import Analytics from './pages/admin/Analytics.jsx';

import { ROLES } from './utils/constants';

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Authenticated */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Citizen */}
          <Route element={<RoleRoute allowedRoles={[ROLES.CITIZEN]} />}>
            <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
            <Route path="/citizen/complaints/new" element={<CreateComplaint />} />
            <Route path="/citizen/complaints" element={<MyComplaints />} />
            <Route path="/citizen/complaints/:id" element={<ComplaintDetail />} />
            <Route path="/citizen/bookmarks" element={<Bookmarks />} />
            <Route path="/citizen/profile" element={<Profile />} />
          </Route>

          {/* Officer */}
          <Route element={<RoleRoute allowedRoles={[ROLES.OFFICER]} />}>
            <Route path="/officer/dashboard" element={<OfficerDashboard />} />
            <Route path="/officer/assigned" element={<AssignedComplaints />} />
            <Route path="/officer/assigned/:id" element={<ComplaintUpdate />} />
            <Route path="/officer/profile" element={<Profile />} />
          </Route>

          {/* Department Manager */}
          <Route element={<RoleRoute allowedRoles={[ROLES.MANAGER]} />}>
            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            <Route path="/manager/officers" element={<ManageOfficers />} />
            <Route path="/manager/stats" element={<DepartmentStats />} />
          </Route>

          {/* Super Admin */}
          <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/departments" element={<Departments />} />
            <Route path="/admin/audit-logs" element={<AuditLogs />} />
            <Route path="/admin/analytics" element={<Analytics />} />
          </Route>
        </Route>
      </Route>

      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
