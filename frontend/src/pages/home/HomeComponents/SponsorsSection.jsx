import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sponsors from "../../sponsors/Sponsors";

export default function SponsorsSection() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <section className="relative px-6 py-16 md:py-24 overflow-hidden">
            {/* Glow */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[500px] bg-mars-primary/5 blur-[140px] rounded-full pointer-events-none" />

            <div className="relative max-w-7xl mx-auto">
                {/* Header section */}
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/40">
                        {t("home.sponsors.kicker")}
                    </p>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mt-3">
                        {t("home.sponsors.title")}
                    </h2>
                </div>

                {/* Sponsors grid preview */}
                <Sponsors preview={true} previewLimit={6} hideTypeTitles={true} />

                {/* CTA */}
                <div className="flex justify-center mt-10">
                    <button onClick={() => navigate("/sponsors")} className="mars-button-outline">
                        {t("home.sponsors.viewAll")}
                    </button>
                </div>
            </div>
        </section>
    );
}
