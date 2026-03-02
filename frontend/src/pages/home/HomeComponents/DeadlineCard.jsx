import React, { useEffect, useMemo, useState } from "react";
import { API_URL } from "../../../config";

// Constants pour le calcul de la date et l'affichage relatif
const MS_DAY = 1000 * 60 * 60 * 24;

// Formatage de la date en français
function formatFR(date) {
    return new Intl.DateTimeFormat("fr-FR", {
        timeZone: "Europe/Paris",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

// Génération d'un label relatif en fonction de la date limite
function relativeLabel(deadline) {
    const diff = deadline.getTime() - Date.now();
    if (diff <= 0) return "Soumissions clôturées";
    if (diff < MS_DAY) return "dans moins de 24h";
    const days = Math.ceil(diff / MS_DAY);
    return `dans ${days} jour${days > 1 ? "s" : ""}`;
}

// Composant principal de la carte de deadline
export default function DeadlineCard() {
    const [deadline, setDeadline] = useState(null);

    // Récupération de la date limite depuis l'API au chargement du composant
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API_URL}/api/cms/countdown`);
                const data = await res.json();
                const iso = data?.countdown?.phaseDate;
                if (res.ok && data?.success && iso) setDeadline(new Date(iso));
            } catch (e) {
                console.error("[DeadlineCard] fetch error:", e);
            }
        })();
    }, []);

    // Mémorisation du formatage de la date et du label relatif pour éviter les calculs inutiles lors des re-renders
    const dateStr = useMemo(() => (deadline ? formatFR(deadline) : ""), [deadline]);
    const rel = useMemo(() => (deadline ? relativeLabel(deadline) : ""), [deadline]);

    if (!deadline) return null;

    // Calcul de l'expiration pour ajuster le style en conséquence
    const expired = deadline.getTime() <= Date.now();

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 py-3">
            <div className="text-xs uppercase tracking-wider text-white/50 font-bold">
                Fin des soumissions
            </div>
            <div className="mt-1 flex items-baseline justify-between gap-3">
                <div className="text-sm font-semibold text-white">{dateStr}</div>
                <div className={`text-xs font-bold ${expired ? "text-white/40" : "text-mars-primary"}`}>
                    {rel}
                </div>
            </div>
        </div>
    );
}