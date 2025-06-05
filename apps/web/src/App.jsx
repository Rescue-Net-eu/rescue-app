import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import AlertsPage from './pages/AlertsPage';
import AlertDetailPage from './pages/AlertDetailPage';
import MissionsPage from './pages/MissionsPage';
import MissionDetailPage from './pages/MissionDetailPage';
import VolunteersPage from './pages/VolunteersPage';
import VolunteerProfilePage from './pages/VolunteerProfilePage';
import AuthorityPortalPage from './pages/AuthorityPortalPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="flex-1 bg-off-white min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/alerts/:alertId" element={<AlertDetailPage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/missions/:missionId" element={<MissionDetailPage />} />
          <Route path="/volunteers" element={<VolunteersPage />} />
          <Route path="/volunteers/:volunteerId" element={<VolunteerProfilePage />} />
          <Route path="/authority" element={<AuthorityPortalPage />} />
          <Route path="" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
