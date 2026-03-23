import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import WebLayout from './components/WebLayout';
import CMSLayout from './components/CMSLayout';
import Home from './features/Home';
import CategoryManagement from './features/CategoryManagement';
import SimulationDetail from './features/SimulationDetail';
import CMSDashboard from './features/CMSDashboard';
import Login from './features/Login';
import Register from './features/Register';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Commercial Web Section */}
        <Route path="/" element={<WebLayout />}>
          <Route index element={<Home />} />
          <Route path="simulation/:id" element={<SimulationDetail />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          {/* Redirect old category path to CMS or a public view if needed */}
          <Route path="categories" element={<Navigate to="/cms/categories" replace />} />
        </Route>

        {/* CMS / Admin Section */}
        <Route path="/cms" element={<CMSLayout />}>
          <Route index element={<CMSDashboard />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="simulations" element={<div className="p-8 bg-white rounded-2xl border border-neutral-200 shadow-sm text-center text-neutral-500">Simulation Management Coming Soon</div>} />
          <Route path="users" element={<div className="p-8 bg-white rounded-2xl border border-neutral-200 shadow-sm text-center text-neutral-500">User Management Coming Soon</div>} />
          <Route path="settings" element={<div className="p-8 bg-white rounded-2xl border border-neutral-200 shadow-sm text-center text-neutral-500">Settings Coming Soon</div>} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
