import React from "react";
import { useTranslation } from "react-i18next";
import { Trophy, PenTool, Cpu } from "lucide-react";

export default function Award() {
    const { t } = useTranslation();

    // Tableau de config : 1 prix = 1 card (icône + titre + récompense)
    // Le JSX reste simple : on change juste le tableau si on ajoute/retire un prix
    const cards = [
        {
            icon: <Trophy size={20} />,
            title: t("home.awards.items.grandJury.title", { defaultValue: "Grand prix du jury" }),
            prize: "$100000",
        },
        {
            icon: <PenTool size={20} />,
            title: t("home.awards.items.bestScript.title", { defaultValue: "Meilleur scénario IA" }),
            prize: "$50000",
        },
        {
            icon: <Cpu size={20} />,
            title: t("home.awards.items.techInnovation.title", { defaultValue: "Innovation technique" }),
            prize: "$25000",
        },
    ];

    return (
        <section className="relative px-6 py-16 md:py-24 overflow-hidden">
            {/* Glow léger */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[500px] bg-mars-primary/5 blur-[140px] rounded-full pointer-events-none" />

            <div className="relative max-w-7xl mx-auto">
            {/* Titre section */}
            <div className="text-center max-w-2xl mx-auto mb-10">
                <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/40">
                    {t("home.awards.kicker", { defaultValue: "Awards" })}
                </p>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight mt-3">
                    {t("home.awards.title", { defaultValue: "Winnings and prizes" })}
                </h2>
            </div>

                {/* 3 cards */}
                {/* Grille responsive : 1 colonne mobile, 3 desktop */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {cards.map((c) => (
                        <div
                            key={c.title}
                            className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm hover:border-white/20 transition-colors"
                        >
                            {/* Icône */}
                            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                                {c.icon}
                            </div>

                            {/* Récompense (mise en avant) */}
                            <div className="mt-6">
                                <div className="text-5xl md:text-6xl font-black tracking-tight mars-text-gradient leading-none">
                                    {c.prize}
                                </div>

                                {/* Titre (moins visible que la récompense) */}
                                <p className="text-sm md:text-base font-bold text-white/70 mt-3">
                                    {c.title}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
