import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CalendarDays, Clock, Mic, Wrench } from "lucide-react";

export default function Events() {
    const { t } = useTranslation();

    // Jours des événements
    // Tableau de config pour les jours, avec une clé d'identification et un label (i18n)
    const days = [
        { key: "day01", label: t("home.events.days.day01", { defaultValue: "Jour 01" }) },
        { key: "day02", label: t("home.events.days.day02", { defaultValue: "Jour 02" }) },
        { key: "day03", label: t("home.events.days.day03", { defaultValue: "Jour 03" }) },
    ];

    // State : jour actif pour filtrer les événements affichés
    const [activeDay, setActiveDay] = useState(days[0].key);

    // Data events
    // Affichage de 4 événements par jour (2 au-dessus du fold, 2 en-dessous) => on slice le tableau après filtrage
    // Chaque événement a un titre, un type (workshop ou conférence) et une heure
    // 1 event = 1 card avec title, type (workshop/conférence) et heure
    const events = [
    // DAY 01
        {
            day: "day01",
            title: t("home.events.items.day01.event1.title", { defaultValue: "Opening Keynote" }),
            type: "conference",
            time: "10:00",
        },
        {
            day: "day01",
            title: t("home.events.items.day01.event2.title", { defaultValue: "Workshop: AI Storytelling" }),
            type: "workshop",
            time: "14:00",
        },
        {
            day: "day01",
            title: t("home.events.items.day01.event3.title", { defaultValue: "Panel: Ethics & Cinema" }),
            type: "conference",
            time: "16:30",
        },
        {
            day: "day01",
            title: t("home.events.items.day01.event4.title", { defaultValue: "Workshop: Prompt to Film" }),
            type: "workshop",
            time: "18:00",
        },

        // DAY 02
        {
            day: "day02",
            title: t("home.events.items.day02.event1.title", { defaultValue: "Conference: Future of AI Cinema" }),
            type: "conference",
            time: "09:30",
        },
        {
            day: "day02",
            title: t("home.events.items.day02.event2.title", { defaultValue: "Workshop: Visual Generation" }),
            type: "workshop",
            time: "11:00",
        },
        {
            day: "day02",
            title: t("home.events.items.day02.event3.title", { defaultValue: "Conference: Creative Pipelines" }),
            type: "conference",
            time: "15:00",
        },
        {
            day: "day02",
            title: t("home.events.items.day02.event4.title", { defaultValue: "Workshop: Sound & AI" }),
            type: "workshop",
            time: "17:30",
        },

        // DAY 03
        {
            day: "day03",
            title: t("home.events.items.day03.event1.title", { defaultValue: "Conference: Ecology & Tech" }),
            type: "conference",
            time: "10:30",
        },
        {
            day: "day03",
            title: t("home.events.items.day03.event2.title", { defaultValue: "Workshop: Documentary with AI" }),
            type: "workshop",
            time: "13:00",
        },
        {
            day: "day03",
            title: t("home.events.items.day03.event3.title", { defaultValue: "Conference: Democracy & Media" }),
            type: "conference",
            time: "16:00",
        },
        {
            day: "day03",
            title: t("home.events.items.day03.event4.title", { defaultValue: "Closing Talk" }),
            type: "conference",
            time: "18:30",
        },
    ];

    // --- Filtrage des events selon le jour choisi ---
    // On limite à 4 pour afficher exactement 2 au-dessus / 2 en-dessous
    const filteredEvents = useMemo(() => {
        return events.filter((e) => e.day === activeDay).slice(0, 4);
    }, [activeDay, events]);

    // --- Helpers UI ---
    const typeBadge = (type) => {
        const isWorkshop = type === "workshop";
        return (
            <span
                className={`px-3 py-1 rounded-full text-[10px] font-black tracking-[0.25em] uppercase border ${
                    isWorkshop
                    ? "bg-white/5 border-white/10 text-white/70"
                    : "bg-mars-primary/10 border-mars-primary/20 text-mars-primary"
                }`}
            >
                {isWorkshop
                    ? t("home.events.type.workshop", { defaultValue: "Workshop" })
                    : t("home.events.type.conference", { defaultValue: "Conférence" })}
            </span>
        );
    };

    const typeIcon = (type) => {
        return type === "workshop" ? <Wrench size={18} /> : <Mic size={18} />;
    };

return (
    <section className="relative px-6 py-16 md:py-24 overflow-hidden">

        {/* Glow léger */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[500px] bg-mars-primary/5 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
            
            {/* Titre section */}
            <div className="text-center max-w-2xl mx-auto mb-10">
                <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/40">
                    {t("home.events.kicker", { defaultValue: "Agenda" })}
                </p>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight mt-3">
                    {t("home.events.title", { defaultValue: "Événements" })}
                </h2>
            </div>

            {/* Card : Sélecteur de jour */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 md:p-5 backdrop-blur-sm mb-8">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    {/* Label */}
                    <div className="flex items-center gap-3 text-white/70">
                        <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                            <CalendarDays size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-black">
                                {t("home.events.dayPicker.title", { defaultValue: "Choisir un jour" })}
                            </p>
                            <p className="text-xs text-white/40">
                                {t("home.events.dayPicker.subtitle", { defaultValue: "Filtrer les événements" })}
                            </p>
                        </div>
                    </div>

                    {/* Boutons jours */}
                    <div className="flex gap-2">
                        {days.map((d) => {
                            const isActive = d.key === activeDay;
                            return (
                                <button
                                    key={d.key}
                                    onClick={() => setActiveDay(d.key)}
                                    className={`px-4 py-2 rounded-2xl text-xs font-black tracking-wide transition-colors border ${
                                        isActive
                                        ? "bg-mars-primary/15 border-mars-primary/30 text-white"
                                        : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/20"
                                    }`}
                                >
                                    {d.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 4 cards événements (2x2 via grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredEvents.length === 0 ? (
                    <div className="sm:col-span-2 text-center text-white/40 py-10">
                        {t("home.events.empty", { defaultValue: "Aucun événement pour ce jour." })}
                    </div>
                ) : (
                    filteredEvents.map((e) => (
                        <div
                            key={`${e.day}-${e.title}-${e.time}`}
                            className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm hover:border-white/20 transition-colors"
                        >
                            {/* Header card : icon + badge */}
                            <div className="flex items-start justify-between gap-4">
                                <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                                {typeIcon(e.type)}
                                </div>
                                {typeBadge(e.type)}
                            </div>

                            {/* Titre */}
                            <div className="mt-6">
                                <h3 className="text-xl font-black tracking-tight text-white">
                                    {e.title}
                                </h3>

                                {/* Heure */}
                                <div className="mt-3 flex items-center gap-2 text-white/50 text-sm font-bold">
                                    <Clock size={16} />
                                    <span>{e.time}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    </section>
    );
}
