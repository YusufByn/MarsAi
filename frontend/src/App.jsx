import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FormDirector from './pages/user/FormDirector';
import JuryDetails from './pages/user/JuryDetails';
import AllJury from './pages/user/AllJury';
import Player from './pages/playerVideo/player';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import EditVideo from './pages/EditVideo';
import Selector from './pages/selector/selector';
import Videos from './pages/Videos';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Admin
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/admin.dashboard';
import AdminFilms from './pages/admin/admin.films';
import AdminJury from './pages/admin/admin.jury';
import AdminEvents from './pages/admin/admin.events';
import AdminConfig from './pages/admin/admin.config';
import NewsletterAdmin from './pages/admin/NewsletterAdmin';

function AppContent() {
  const location = useLocation();
  const isPlayerPage = location.pathname === '/video/player';
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {!isPlayerPage && !isAdminPage && <Navbar />}
      <main className="flex-grow">
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/jury" element={<AllJury />} />
          <Route path="/jury/profil/:id" element={<JuryDetails />} />
          <Route path="/video/player" element={<Player />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/formsubmission" element={<FormDirector />} />
          <Route path="/video/edit/:id" element={<EditVideo />} />
          <Route path="/selector" element={<Selector />} />
          <Route path="/videos" element={<Videos />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="films" element={<AdminFilms />} />
            <Route path="jury" element={<AdminJury />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="config" element={<AdminConfig />} />
            <Route path="newsletter" element={<NewsletterAdmin />} />
          </Route>
        </Routes>
      </main>
      {!isPlayerPage && !isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
