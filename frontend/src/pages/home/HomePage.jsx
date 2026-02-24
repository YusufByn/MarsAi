import React from 'react';
import Hero from './HomeComponents/Hero';
import Objectives from './HomeComponents/Objectives';
import DesirableFuture from './HomeComponents/DesirableFuture';
import Events from './HomeComponents/Events';
import Award from './HomeComponents/Award';
import Jury from './HomeComponents/Jury';
import FestivalLocalisation from './HomeComponents/FestivalLocalisation';
import SponsorsSection from './HomeComponents/SponsorsSection';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-mars-primary selection:text-white overflow-x-hidden">

        <Hero />

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

        {/* Sponsors */}
        <SponsorsSection />
    </div>
  );
};

export default HomePage;
