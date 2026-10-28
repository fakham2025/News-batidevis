/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { QuoteBuilderPage } from './pages/QuoteBuilderPage';
import { PublicSignPage } from './pages/PublicSignPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/creer-devis" element={<QuoteBuilderPage />} />
        <Route path="/valider/:token" element={<PublicSignPage />} />
        <Route path="/app/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        {/* Alias redirection for convenience */}
        <Route path="/devis" element={<Navigate to="/creer-devis" replace />} />
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
