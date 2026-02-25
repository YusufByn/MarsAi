import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Clock, MapPin } from "lucide-react";
import { eventService } from "../../../services/eventService";

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

export default function Events() {
    const { t } = useTranslation();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        eventService.getAll()
            .then((list) => setEvents(list.slice(0, 4)))
            .catch((err) => console.error("[EVENTS] Erreur chargement:", err));
    }, []);

    return (
        <section className="relative px-6 py-10 md:py-16 overflow-hidden">

            {/* Glow léger */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[500px] bg-mars-primary/5 blur-[140px] rounded-full pointer-events-none" />

            <div className="relative max-w-7xl mx-auto">

                {/* Titre section — cliquable vers EventsPage */}
                <Link to="/events" className="block text-center max-w-2xl mx-auto mb-10 group">
                    <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/40">
                        {t("home.events.kicker", { defaultValue: "Agenda" })}
                    </p>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mt-3 group-hover:text-white/80 transition-colors">
                        {t("home.events.title", { defaultValue: "Événements" })}
                    </h2>
                </Link>

                {/* 4 cards événements — chacune vers EventDetailPage */}
                {events.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                        {events.map((ev) => (
                            <Link
                                key={ev.id}
                                to={`/event/${ev.id}`}
                                className="text-left rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm hover:border-white/20 hover:bg-white/[0.07] transition-colors"
                            >
                                <div className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-[0.2em]">
                                    <Clock size={12} />
                                    <span>{formatDate(ev.date)}</span>
                                </div>

                                <h3 className="text-lg font-black tracking-tight text-white mt-4 leading-snug">
                                    {ev.title}
                                </h3>

                                {ev.location && (
                                    <div className="flex items-center gap-1.5 mt-3 text-xs text-white/40">
                                        <MapPin size={12} />
                                        <span>{ev.location}</span>
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                )}

                {/* CTA → EventsPage */}
                <div className="flex justify-center">
                    <Link to="/events" className="mars-button-outline">
                        {t("home.events.viewAll", { defaultValue: "Voir tous les événements" })}
                    </Link>
                </div>
            </div>
        </section>
    );
}
