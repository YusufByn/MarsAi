import React from "react";
import Countdown from "./Countdown";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Hero() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <header className="relative min-h-[100svh] pt-24 sm:pt-28 md:pt-24 pb-16 md:pb-32 px-4 sm:px-6 flex flex-col items-center justify-start md:justify-center text-center overflow-x-hidden">

            {/* Effet lumineux en background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] md:w-[1000px] md:h-[700px] bg-mars-primary/10 blur-[120px] md:blur-[150px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6 sm:mb-8 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-mars-accent animate-pulse"></div>
                    <span className="text-[9px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.3em] uppercase text-white/60 font-bold">
                        {t("home.badge")}
                    </span>
                </div>

                {/* Titre Principal */}
                <h1 className="text-[3.6rem] sm:text-7xl md:text-[12rem] font-black tracking-tight md:tracking-tighter mb-4 leading-[0.85] italic uppercase max-w-full break-words">
                    Festival mars<span className="mars-text-gradient">AI</span>
                </h1>

                {/* Compte à rebours */}
                <Countdown />

                {/* Sous-titre */}
                <p className="text-base sm:text-lg md:text-2xl text-white/40 font-light mb-10 md:mb-16 tracking-normal sm:tracking-wide max-w-[90vw] sm:max-w-2xl px-2">
                    {t("home.subtitle")}
                </p>

                {/* Boutons d'action (props) */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-5 md:gap-12 w-full max-w-md md:max-w-none">
                    <button
                        onClick={() => navigate("/formsubmission")}
                        className="mars-button-primary w-full md:w-auto"
                    >
                        {t("home.submitFilm")}
                    </button>

                    <button
                        onClick={() => navigate("/jury")}
                        className="mars-button-outline w-full md:w-auto"
                    >
                        {t("home.discoverJury")}
                    </button>
                </div>
            </div>

            {/* Flèche animée */}
            <div className="absolute bottom-8 md:bottom-12 animate-bounce text-white/20">
                <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path>
                </svg>
            </div>
        </header>
    );
}