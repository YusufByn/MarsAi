import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sponsors from "../../sponsors/Sponsors";

export default function SponsorsSection() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <section className="relative px-6 py-16 md:py-24 overflow-hidden">
            {/* Glow de fond */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-mars-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative max-w-7xl mx-auto">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden">

                    {/* Header */}
                    <div className="px-8 pt-10 pb-8 border-b border-white/5">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                            <div>
                                <p className="text-xs font-bold tracking-[0.3em] uppercase text-mars-primary/70 mb-2">
                                    {t("home.sponsors.kicker", { defaultValue: "Partenaires" })}
                                </p>
                                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                                    {t("home.sponsors.title", { defaultValue: "Nos sponsors" })}
                                </h2>
                            </div>
                            <button
                                onClick={() => navigate("/sponsors")}
                                className="mars-button-outline self-start sm:self-auto flex-shrink-0"
                            >
                                {t("home.sponsors.viewAll", { defaultValue: "Voir nos partenaires" })}
                            </button>
                        </div>
                    </div>

                    {/* Corps : Sponsors en mode preview */}
                    <div className="px-8 py-8">
                        <Sponsors preview={true} previewLimit={8} hideTypeTitles={false} showViewAllLink={false} />
                    </div>

                    {/* Footer discret */}
                    <div className="px-8 pb-6 flex justify-center border-t border-white/5 pt-4">
                        <button
                            onClick={() => navigate("/sponsors")}
                            className="text-xs text-white/30 hover:text-white/60 transition tracking-widest uppercase"
                        >
                            {t("home.sponsors.viewAllLink")}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
