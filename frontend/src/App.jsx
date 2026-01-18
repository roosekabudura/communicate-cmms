import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import WorkOrders from './pages/WorkOrders';
import Engineers from './pages/Engineers';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import PreventiveMaint from './pages/PreventiveMaint';

function App() {
  // Check if user is logged in
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes - Wrapped in MainLayout */}
        <Route element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/pm" element={<PreventiveMaint />} /> {/* 2. ADD THIS ROUTE */}
          <Route path="/work-orders" element={<WorkOrders />} />
          <Route path="/engineers" element={<Engineers />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/reports" element={<Reports />} />
          {/* Default landing page for authenticated users */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Route>

        {/* Catch-all: Redirect to login if path doesn't exist */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;