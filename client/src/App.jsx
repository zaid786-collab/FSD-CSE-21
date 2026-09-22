import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProjectDetail } from './pages/ProjectDetail';
import { AdminDashboard } from './pages/AdminDashboard';
import { PortfolioProvider } from './context/PortfolioContext';

export default function App() {
  return (
    <PortfolioProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/mzk-control" element={<AdminDashboard />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </PortfolioProvider>
  );
}