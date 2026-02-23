import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { eventService } from "../../services/eventService";

export default function EventDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setError("");
                const data = await eventService.getById(id);
                const ev = data.data ?? data;
                setEvent(ev);
            } catch (e) {
                setError(e.message);
            }
        };
        load();
    }, [id]);

    const formatDate = (d) => {
        if (!d) return "";
        const iso = typeof d === "string" ? d.replace(" ", "T") : d;
        return new Date(iso).toLocaleString("fr-FR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white px-6 py-16">
                <div className="max-w-3xl mx-auto">
                    <button onClick={() => navigate(-1)} className="mars-button-outline">
                        Retour
                    </button>
                    <p className="text-red-400 mt-6">{error}</p>
                </div>
            </div>
        );
    }

    if (!event) return null;

    return (
        <div className="min-h-screen bg-black text-white px-6 py-16">
            <div className="max-w-3xl mx-auto">
                {/* Retour */}
                <button onClick={() => navigate(-1)} className="mars-button-outline">
                    Retour
                </button>

                {/* Header */}
                <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8">
                    <div className="text-xs uppercase tracking-[0.3em] text-white/40">
                        {formatDate(event.date)}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black mt-3">{event.title}</h1>

                    {event.location && (
                        <p className="text-white/60 mt-3">{event.location}</p>
                    )}

                    {/* Infos utiles */}
                    <div className="grid grid-cols-2 gap-4 mt-8 text-sm text-white/60">
                        {event.duration != null && (
                            <div>
                                <div className="text-white/30">Durée</div>
                                <div>{event.duration} min</div>
                            </div>
                    )}
                    {event.stock != null && (
                        <div>
                            <div className="text-white/30">Capacité</div>
                            <div>{event.stock} places</div>
                        </div>
                    )}
                    </div>

                    {event.description && (
                        <p className="text-white/50 mt-8 leading-relaxed">{event.description}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
