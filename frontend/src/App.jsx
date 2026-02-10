import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JuryDetails from './pages/user/JuryDetails';
import AllJury from './pages/user/AllJury';
import NewsletterAdmin from './pages/admin/NewsletterAdmin';
import Player from './pages/playerVideo/player';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import FromVideo from './pages/FromVideo';
import EditVideo from './pages/EditVideo';
import Selector from './pages/selector/selector';
import Videos from './pages/Videos';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

function AppContent() {
  const location = useLocation();
  const isPlayerPage = location.pathname === '/video/player';

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {!isPlayerPage && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jury" element={<AllJury />} />
          <Route path="/jury/profil/:id" element={<JuryDetails />} />
          <Route path="/admin/newsletter" element={<NewsletterAdmin />} />
          <Route path="/video/player" element={<Player />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/FromVideo" element={<FromVideo />} />
          <Route path="/video/edit/:id" element={<EditVideo />} />
          <Route path="/selector" element={<Selector />} />
          <Route path="/videos" element={<Videos />} />
        </Routes>
      </main>
      {!isPlayerPage && <Footer />}
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
