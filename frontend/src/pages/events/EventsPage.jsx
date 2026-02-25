import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Clock, MapPin } from "lucide-react";
import { eventService } from "../../services/eventService";

const formatDate = (d) => {
    if (!d) return "";
    const iso = typeof d === "string" ? d.replace(" ", "T") : d;
    return new Date(iso).toLocaleString("fr-FR", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export default function EventsPage() {
    const { t } = useTranslation();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        eventService.getAll()
            .then((list) => setEvents(list))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-black text-white">

            {/* Glow de fond */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-mars-primary/8 blur-[150px] rounded-full pointer-events-none z-0" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-20">

                {/* Header */}
                <header className="mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6 backdrop-blur-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-mars-primary animate-pulse" />
                        <span className="text-[10px] tracking-[0.3em] uppercase text-white/60 font-bold">
                            {t("home.events.kicker", { defaultValue: "Agenda" })}
                        </span>
                    </div>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-none">
                        {t("pages.events.title", { defaultValue: "Événements" })}
                    </h1>
                    <p className="text-white/40 mt-4 text-base sm:text-lg font-light max-w-xl">
                        {t("pages.events.subtitle", { defaultValue: "Conférences, workshops et rencontres autour du cinéma IA." })}
                    </p>
                </header>

                {/* Erreur */}
                {error && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400 mb-8">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="rounded-3xl border border-white/10 bg-white/5 p-7 animate-pulse h-44"
                            />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && events.length === 0 && (
                    <div className="text-center py-32">
                        <p className="text-white/20 text-sm tracking-widest uppercase">
                            {t("home.events.empty", { defaultValue: "Aucun événement pour le moment." })}
                        </p>
                    </div>
                )}

                {/* Grid d'events */}
                {!loading && events.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {events.map((ev) => (
                            <Link
                                key={ev.id}
                                to={`/event/${ev.id}`}
                                className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7 hover:border-white/20 hover:bg-white/[0.07] transition-colors"
                            >
                                <div className="flex items-center gap-2 text-[11px] font-bold text-white/40 uppercase tracking-[0.2em]">
                                    <Clock size={11} />
                                    <span>{formatDate(ev.date)}</span>
                                </div>

                                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white mt-4 leading-snug flex-grow">
                                    {ev.title}
                                </h2>

                                {ev.description && (
                                    <p className="text-white/40 text-sm mt-3 line-clamp-2 leading-relaxed">
                                        {ev.description}
                                    </p>
                                )}

                                {ev.location && (
                                    <div className="flex items-center gap-1.5 mt-4 text-xs text-white/30">
                                        <MapPin size={11} />
                                        <span className="truncate">{ev.location}</span>
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
