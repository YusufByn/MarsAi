import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FormDirector from './pages/user/FormDirector';
import JuryDetails from './pages/user/JuryDetails';
import AllJury from './pages/user/AllJury';
import NewsletterAdmin from './pages/admin/NewsletterAdmin';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jury" element={<AllJury />} />
            <Route path="/jury/profil/:id" element={<JuryDetails />} />
            <Route path="/admin/newsletter" element={<NewsletterAdmin />} />
            <Route path="/formsubmission" element={<FormDirector />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
