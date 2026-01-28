import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JuryDetails from './pages/user/JuryDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jury/profil/:id" element={<JuryDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
