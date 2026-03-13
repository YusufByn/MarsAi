import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SPONSORS = [
    { name: "NovaMind",    tier: "gold"   },
    { name: "Lumina AI",   tier: "gold"   },
    { name: "Synapse Corp",tier: "gold"   },
    { name: "PixelForge",  tier: "silver" },
    { name: "DeepCanvas",  tier: "silver" },
    { name: "Aurora Labs", tier: "silver" },
    { name: "Nexus AI",    tier: "bronze" },
    { name: "Stellar Works",tier: "bronze"},
];

const TIER_STYLES = {
    gold:   "text-xl  font-black  text-white/80",
    silver: "text-lg  font-bold   text-white/50",
    bronze: "text-base font-medium text-white/30",
};

export default function SponsorsSection() {
    const { t } = useTranslation();

    return (
        <section className="relative px-6 py-10 md:py-16 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-mars-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative max-w-7xl mx-auto">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden">

                    {/* Header */}
                    <div className="px-8 pt-10 pb-8 border-b border-white/5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold tracking-[0.3em] uppercase text-mars-primary/70 mb-2">
                                {t("home.sponsors.kicker", { defaultValue: "Partenaires" })}
                            </p>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                                {t("home.sponsors.title", { defaultValue: "Nos sponsors" })}
                            </h2>
                        </div>
                        <Link to="/sponsors" className="mars-button-outline self-start sm:self-auto flex-shrink-0">
                            {t("home.sponsors.viewAll", { defaultValue: "Voir nos partenaires" })}
                        </Link>
                    </div>

                    {/* Grille sponsors fictifs */}
                    <div className="px-8 py-10">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px border border-white/5 rounded-2xl overflow-hidden">
                            {SPONSORS.map((sponsor) => (
                                <div
                                    key={sponsor.name}
                                    className="flex items-center justify-center px-6 py-8 bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                                >
                                    <span className={`tracking-tight leading-none select-none ${TIER_STYLES[sponsor.tier]}`}>
                                        {sponsor.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-8 pb-6 pt-2 flex justify-center border-t border-white/5">
                        <Link
                            to="/sponsors"
                            className="text-xs text-white/30 hover:text-white/60 transition tracking-widest uppercase"
                        >
                            {t("home.sponsors.viewAllLink", { defaultValue: "Voir tous nos partenaires" })}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
