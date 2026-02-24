import React from "react";
import { useTranslation } from "react-i18next";
import Sponsors from "./Sponsors";

export default function SponsorsPage() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-black text-white px-6">
            <div className="max-w-7xl mx-auto">
                <div className="pt-28 mb-10">
                    <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/40">
                        {t("home.sponsors.kicker")}
                    </p>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mt-3">
                        {t("home.sponsors.title")}
                    </h1>
                </div>
                <Sponsors />
            </div>
        </div>
    );
}
