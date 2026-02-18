import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from './HomeComponents/Hero';
import Objectives from './HomeComponents/Objectives';
import DesirableFuture from './HomeComponents/DesirableFuture';
import Events from './HomeComponents/Events';
import Award from './HomeComponents/Award';
import Jury from './HomeComponents/Jury';
import FestivalLocalisation from './HomeComponents/FestivalLocalisation';

const HomePage = () => {
  // Hook de navigation pour rediriger vers les pages de soumission de film et de découverte du jury
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-mars-primary selection:text-white overflow-x-hidden">
      
        {/* Composant UI => des actions via props */}
        <Hero 
        onSubmitFilm={() => navigate('/formsubmission')} 
        OnDiscoverJury={() => navigate('/jury')} 
        />

        {/* Futurs souhaitable */}
        <DesirableFuture />

        {/* Objectifs et Représentant */}
        <Objectives />

        {/* événements */}
        <Events />

        {/* Jury */}
        <Jury />

        {/* Prix */}
        <Award />

        {/* Localisation du festival */}
        <FestivalLocalisation />
    </div>
  );
};

export default HomePage;
