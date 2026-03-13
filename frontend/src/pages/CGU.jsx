import React from 'react';
import { Link } from 'react-router-dom';

const CGU = () => {
  return (
    <div className="min-h-screen bg-black text-white px-6 pt-32 pb-20">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-mars-primary/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-16">

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter italic">
            Mentions <span className="mars-text-gradient">Legales</span>
          </h1>
          <p className="text-white/40 text-sm">Derniere mise a jour : Fevrier 2026</p>
        </div>

        {/* Section 1 - Editeur */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="text-mars-primary">01</span>
            Editeur du site
          </h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3 text-white/70 text-sm leading-relaxed">
            <p>Le site web marsai.fr est edite par :</p>
            <div className="space-y-1">
              <p className="text-white font-semibold">Association MarsAI</p>
              <p>Association loi 1901</p>
              <p>Siege social : 42 Rue de la Creation, 13500 Martigues, France</p>
              <p>Email : <a href="mailto:contact@marsai.fr" className="text-mars-primary hover:underline">contact@marsai.fr</a></p>
              <p>Telephone : +33 (0)4 XX XX XX XX</p>
              <p>N SIRET : 123 456 789 00012</p>
              <p>N RNA : W131234567</p>
            </div>
            <div className="pt-3 border-t border-white/10 space-y-1">
              <p className="text-white font-semibold">Directeur de la publication :</p>
              <p>[Prenom NOM], President de l'association</p>
              <p>Email : <a href="mailto:president@marsai.fr" className="text-mars-primary hover:underline">president@marsai.fr</a></p>
            </div>
          </div>
        </section>

        {/* Section 2 - Hebergement */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="text-mars-primary">02</span>
            Hebergement
          </h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-1 text-white/70 text-sm leading-relaxed">
            <p className="text-white font-semibold">OVH SAS</p>
            <p>2 rue Kellermann</p>
            <p>59100 Roubaix, France</p>
            <p>Telephone : 1007</p>
            <p>Site web : <a href="https://www.ovh.com" target="_blank" rel="noopener noreferrer" className="text-mars-primary hover:underline">www.ovh.com</a></p>
          </div>
        </section>

        {/* Section 3 - Propriete intellectuelle */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="text-mars-primary">03</span>
            Propriete intellectuelle
          </h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6 text-white/70 text-sm leading-relaxed">
            <div className="space-y-2">
              <h3 className="text-white font-semibold">3.1 Contenu du site</h3>
              <p>
                L'ensemble du contenu du site marsai.fr (textes, images, videos, logos, charte graphique)
                est protege par le droit d'auteur et reste la propriete exclusive de l'Association MarsAI,
                sauf mention contraire.
              </p>
              <p>
                Toute reproduction, representation, modification, publication ou adaptation de tout ou partie
                des elements du site est interdite sans autorisation ecrite prealable.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-white font-semibold">3.2 Films soumis au festival</h3>
              <p>
                Les films courts-metrages soumis au Festival MarsAI restent la propriete de leurs auteurs.
                En soumettant un film, les participants accordent a l'Association MarsAI une licence
                non-exclusive de diffusion dans le cadre du festival et de sa promotion.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 - RGPD */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="text-mars-primary">04</span>
            Donnees personnelles (RGPD)
          </h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6 text-white/70 text-sm leading-relaxed">
            <p>
              Conformement au Reglement General sur la Protection des Donnees (RGPD) et a la loi
              Informatique et Libertes, vous disposez d'un droit d'acces, de rectification, de suppression
              et de portabilite de vos donnees personnelles.
            </p>

            <div className="space-y-1">
              <p className="text-white font-semibold">Responsable du traitement :</p>
              <p>Association MarsAI</p>
              <p>42 Rue de la Creation, 13500 Martigues</p>
            </div>

            <div className="space-y-2">
              <p className="text-white font-semibold">Donnees collectees :</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Nom, prenom, email des participants</li>
                <li>Informations sur les films soumis</li>
                <li>Donnees de connexion (cookies)</li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-white font-semibold">Finalite du traitement :</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Gestion des inscriptions au festival</li>
                <li>Communication sur l'evenement</li>
                <li>Selection et diffusion des films</li>
                <li>Statistiques de frequentation du site</li>
              </ul>
            </div>

            <div className="space-y-1">
              <p className="text-white font-semibold">Duree de conservation :</p>
              <p>Les donnees sont conservees pendant la duree du festival et 3 ans apres pour archivage.</p>
            </div>

            <div className="space-y-1">
              <p className="text-white font-semibold">Exercice de vos droits :</p>
              <p>Pour exercer vos droits, contactez : <a href="mailto:dpo@marsai.fr" className="text-mars-primary hover:underline">dpo@marsai.fr</a></p>
            </div>
          </div>
        </section>

        {/* Section 5 - Cookies */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="text-mars-primary">05</span>
            Cookies
          </h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4 text-white/70 text-sm leading-relaxed">
            <p>
              Le site utilise des cookies pour ameliorer l'experience utilisateur et etablir des
              statistiques de visite. Vous pouvez refuser les cookies via les parametres de votre navigateur.
            </p>
            <div className="space-y-2">
              <p className="text-white font-semibold">Cookies utilises :</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Cookies techniques (fonctionnement du site)</li>
                <li>Cookies analytiques (Google Analytics / Matomo)</li>
                <li>Cookies de reseaux sociaux (partage)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 6 - Credits */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="text-mars-primary">06</span>
            Credits
          </h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3 text-white/70 text-sm leading-relaxed">
            <div className="space-y-1">
              <p className="text-white font-semibold">Conception et developpement :</p>
              <p>[Nom de l'agence ou developpeur]</p>
            </div>
            <div className="space-y-1">
              <p className="text-white font-semibold">Design graphique :</p>
              <p>[Nom du designer]</p>
            </div>
          </div>
        </section>

        {/* Section 7 - Liens hypertextes */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="text-mars-primary">07</span>
            Liens hypertextes
          </h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70 text-sm leading-relaxed">
            <p>
              Le site peut contenir des liens vers des sites externes. L'Association MarsAI ne peut
              etre tenue responsable du contenu de ces sites tiers.
            </p>
          </div>
        </section>

        {/* Section 8 - Limitation de responsabilite */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="text-mars-primary">08</span>
            Limitation de responsabilite
          </h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70 text-sm leading-relaxed">
            <p>
              L'Association MarsAI s'efforce d'assurer l'exactitude des informations diffusees sur le site
              mais ne peut garantir l'absence d'erreurs. L'Association decline toute responsabilite en cas
              d'interruption du service, de bugs ou de problemes techniques.
            </p>
          </div>
        </section>

        {/* Section 9 - Droit applicable */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <span className="text-mars-primary">09</span>
            Droit applicable
          </h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70 text-sm leading-relaxed">
            <p>
              Les presentes mentions legales sont soumises au droit francais. Tout litige sera soumis
              aux tribunaux competents de Marseille.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="space-y-4">
          <div className="rounded-2xl border border-mars-primary/20 bg-mars-primary/5 p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold">Contact</h2>
            <p className="text-white/60 text-sm">Pour toute question relative aux mentions legales :</p>
            <div className="space-y-1 text-sm">
              <p>Email : <a href="mailto:legal@marsai.fr" className="text-mars-primary hover:underline">legal@marsai.fr</a></p>
              <p className="text-white/60">Association MarsAI, 42 Rue de la Creation, 13500 Martigues, France</p>
            </div>
            <Link
              to="/"
              className="inline-block mt-4 px-6 py-3 rounded-xl bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors"
            >
              Retour a l'accueil
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default CGU;
