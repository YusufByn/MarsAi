import React from "react";
import { useTranslation } from "react-i18next";

/**
 * Section Jury (4 cards portrait)
 * - 1 juré = 1 card
 * - image en background via inline style (cover)
 * - bandeau en bas : nom + expertise
*/
export default function Jury() {
    const { t } = useTranslation();

    // Tableau de config : pratique pour changer juste les infos sans toucher au JSX
    // image: mets ici une URL publique, ou un chemin /uploads/... si ton backend sert les images
    const jurors = [
        {
            name: t("home.jury.items.1.name", { defaultValue: "C. Del Toro" }),
            expertise: t("home.jury.items.1.expertise", { defaultValue: "Filmmaker" }),
            image: "images/jury/del_toro.jpg",
        },
        {
            name: t("home.jury.items.2.name", { defaultValue: "C. Nolan" }),
            expertise: t("home.jury.items.2.expertise", { defaultValue: "Filmmaker" }),
            image: "/images/jury/nolan.jpg",
        },
        {
            name: t("home.jury.items.3.name", { defaultValue: "Tarantino" }),
            expertise: t("home.jury.items.3.expertise", { defaultValue: "Filmmaker" }),
            image: "/images/jury/tarantino.jpg",
        },
        {
            name: t("home.jury.items.4.name", { defaultValue: "Spielberg" }),
            expertise: t("home.jury.items.4.expertise", { defaultValue: "PFilmmaker" }),
            image: "/images/jury/spielberg.jpg",
        },
    ];

    return (
        <section className="relative px-6 py-16 md:py-24 overflow-hidden">
            {/* Glow léger */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[500px] bg-mars-primary/5 blur-[140px] rounded-full pointer-events-none" />

            <div className="relative max-w-7xl mx-auto">
                {/* Header section */}
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/40">
                        {t("home.jury.kicker", { defaultValue: "the international jury" })}
                    </p>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mt-3">
                        {t("home.jury.title", { defaultValue: "the international jury" })}
                    </h2>
                </div>

                {/* 4 cards portrait */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {jurors.map((j) => (
                        <article
                            key={j.name}
                            className="group relative rounded-3xl border border-white/10 overflow-hidden bg-white/5 hover:border-white/20 transition-colors"
                        >
                            {/* Ratio portrait */}
                            <div
                                className="relative w-full aspect-[3/4]"
                                style={{
                                    backgroundImage: `url(${j.image})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                {/* Overlay pour lisibilité */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />

                                {/* Bandeau bas (nom + expertise) */}
                                <div className="absolute bottom-0 left-0 right-0 p-5">
                                    <p className="text-lg font-black tracking-tight text-white">
                                        {j.name}
                                    </p>
                                    <p className="text-xs font-bold tracking-[0.25em] uppercase text-white/60 mt-1">
                                        {j.expertise}
                                    </p>
                                </div>

                                {/* Petit hover brillant quand on est sur une card */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute inset-0 bg-white/5" />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
