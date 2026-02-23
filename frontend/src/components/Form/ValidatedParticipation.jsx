import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const readStep1FromStorage = () => {
  try {
    const raw = localStorage.getItem('participationStep1');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

function ValidatedParticipation() {
    const location = useLocation();
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');

    useEffect(() => {
        const fromNavigation = location.state || {};
        const fromStorage = readStep1FromStorage() || {};

        setFirstname(
          fromNavigation.firstName ||
          fromStorage.firstName ||
          fromStorage.FirstName ||
          ''
        );
        setLastname(
          fromNavigation.lastName ||
          fromStorage.lastName ||
          fromStorage.LastName ||
          ''
        );
    }, [location.state]);

  return (
    <section className="min-h-screen w-full flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl flex flex-col items-center text-center gap-5 p-6 border-2 border-white/10 rounded-2xl text-white">
        <div>
          <h1 className="text-2xl font-semibold">
            Congratulations! {firstname} {lastname} Your participation has been validated.
          </h1>
          <p className="mt-3 text-sm text-gray-300 leading-relaxed">
            Your participation has been validated. You can now access your
            participation details. Thank you for your participation. You will
            receive an email confirmation shortly.
          </p>
        </div>
        <Link
          to="/"
          className="mt-2 inline-flex items-center justify-center bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border border-white/10 rounded-xl px-6 py-2.5 transition-all font-semibold text-sm shadow-[0_8px_24px_rgba(168,85,247,0.35)]"
        >
          Retour a l'accueil
        </Link>
      </div>
    </section>
  );
};

export default ValidatedParticipation;