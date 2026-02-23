import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { eventService } from "../../services/eventService";

export default function EventsPage() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {

        const load = async () => {

            try {
                setError("");
                const data = await eventService.getAll();

                const list = data.data ?? data;
                setEvents(list);

            } catch (e) {
                setError(e.message);
            }
        };
        load();
    }, []);

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

    return (
        <div className="min-h-screen bg-black text-white px-6 py-16">
            {/* Titre */}
            <div className="max-w-6xl mx-auto mb-10">
                <h1 className="text-4xl md:text-6xl font-black tracking-tight">Events</h1>
                <p className="text-white/50 mt-2">Programme du festival</p>
            </div>

            <div className="max-w-6xl mx-auto">
                {error && <div className="text-red-400 mb-6">{error}</div>}

                {/* Grid d'events */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.map((ev) => (
                        <button
                            key={ev.id}
                            onClick={() => navigate(`/event/detail/${ev.id}`)}
                            className="text-left rounded-3xl border border-white/10 bg-white/5 p-7 hover:border-white/20 transition-colors"
                        >

                            <div className="text-xs uppercase tracking-[0.3em] text-white/40">
                                {formatDate(ev.date)}
                            </div>

                            <h2 className="text-2xl font-black mt-3">{ev.title}</h2>

                            {ev.location && (
                                <p className="text-white/60 mt-2">{ev.location}</p>
                            )}

                            {ev.description && (
                                <p className="text-white/40 mt-4 line-clamp-3">{ev.description}</p>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
