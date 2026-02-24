import React from "react";
import { useTranslation } from "react-i18next";
import { Leaf, Sparkles, Scale } from "lucide-react";

export default function DesirableFuture() {
    const { t } = useTranslation();

    // Tableau de config pour les cartes "Desirable Future", avec icône, titre et description (i18n)
    // 1 item = 1 carte avec une icône, un titre et une description (i18n)

    const cards = [
        {
            icon: <Leaf size={20} />,
            title: t("home.desirableFuture.ecology.title", { defaultValue: "Ecology" }),
            description: t("home.desirableFuture.ecology.desc", {
            defaultValue: "A short description about ecology and impact.",
            }),
        },
        {
            icon: <Sparkles size={20} />,
            title: t("home.desirableFuture.possibleFuture.title", {
            defaultValue: "Possible future",
            }),
            description: t("home.desirableFuture.possibleFuture.desc", {
            defaultValue: "A short description about creating possible futures.",
            }),
        },
        {
            icon: <Scale size={20} />,
            title: t("home.desirableFuture.democracy.title", {
            defaultValue: "Democracy",
            }),
            description: t("home.desirableFuture.democracy.desc", {
            defaultValue: "A short description about democracy and society.",
            }),
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
                {t("home.desirableFuture.kicker", { defaultValue: "Vision" })}
                </p>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight mt-3">
                {t("home.desirableFuture.title", { defaultValue: "A Desirable Future" })}
                </h2>
            </div>

            {/* 3 cards */}
            {/* Grille responsive -> 1 colonne mobile, 3 colonnes desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Boucle sur les cards pour générer une card par item */}
                {cards.map((c) => (
                    <div
                        key={c.title}
                        className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm hover:border-white/20 transition-colors"
                    >
                        {/* Icône */}
                        <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                        {c.icon}
                        </div>

                        {/* Contenu */}
                        <div className="mt-6">
                            
                        {/* Titre */}
                        <div className="text-xl font-black tracking-tight text-white">
                            {c.title}
                        </div>

                        {/* Description */}
                        <p className="text-sm font-bold text-white/60 mt-3 leading-relaxed">
                            {c.description}
                        </p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
