import React from "react";
import { useTranslation } from "react-i18next";
import { Film, Globe2, Timer, Mic } from "lucide-react";

export default function Objectives() {
    const { t } = useTranslation();

    // Tableau de config pour les cartes "Objectives", avec icône, valeur et label (i18n)
    //  1 objectif = 1 carte avec une icône, une valeur chiffrée et un label descriptif
    
    const cards = [
        {
            icon: <Film size={20} />,
            value: "600",
            label: t("home.objectives.films", { defaultValue: "films en compétition" }),
        },
        {
            icon: <Globe2 size={20} />,
            value: "120",
            label: t("home.objectives.countries", { defaultValue: "pays représentés" }),
        },
        {
            icon: <Timer size={20} />,
            value: "50",
            label: t("home.objectives.days", { defaultValue: "jours d’immersion" }),
        },
        {
            icon: <Mic size={20} />,
            value: "50",
            label: t("home.objectives.talks", { defaultValue: "conférences" }),
        },
    ];

    return (
        <section className="relative px-6 py-16 md:py-24 overflow-hidden">
            {/* Glow léger */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[500px] bg-mars-primary/5 blur-[140px] rounded-full pointer-events-none" />
            <div className="relative max-w-7xl mx-auto">
            {/* Titre section*/}
            <div className="text-center max-w-2xl mx-auto mb-10">
                <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/40">
                {t("home.objectives.kicker", { defaultValue: "Objectives" })}
                </p>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight mt-3">
                {t("home.objectives.title", { defaultValue: "Key Figures" })}
                </h2>
            </div>

            {/* 4 cards */}
            {/* Grilles responsive -> 1 colonne, 2 tablette, 4 desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Boucle sur les stats pour générer une par item */}
                {cards.map((c) => (
                <div
                    key={c.label}
                    className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm hover:border-white/20 transition-colors"
                >
                    {/* Icône */}
                    <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                    {c.icon}
                    </div>

                    {/* Valeur */}
                    <div className="mt-6">
                    <div className="text-5xl font-black tracking-tight text-white">
                        {c.value}
                    </div>

                    {/* Label */}
                    <p className="text-sm font-bold text-white/70 mt-2">
                        {c.label}
                    </p>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </section>
    );
}
