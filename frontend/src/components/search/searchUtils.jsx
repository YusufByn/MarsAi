// Helpers réutilisables pour l'affichage des résultats de recherche

import React from 'react';
import { API_URL } from '@/config';

// Construit l'URL complète de la cover d'un film
export function getCoverUrl(video){
    const src = video?.cover_url || (video?.cover ? `uploads/cover/${video.cover}` : null);
    if (!src) return null;
    if (src.startsWith("http")) return src;
    return `${API_URL}${src}`;
}

// Retourne le nom du réalisateur à afficher
export function formatAuthor(video) {
    return video?.author || [video?.realisator_name, video?.realisator_lastname].filter(Boolean).join(" ");
}

// Échappe les caractères spéciaux d'une chaîne pour l'utiliser dans une RegExp
export function escapeRegExp(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Surligne la partie du texte qui correspond à la recherche
export function Highlight({ text, query }) {
    const value = String(text ?? "");
    const q = String(query ?? "").trim();

    // Pas de surlignage si la recherche est vide ou trop courte
    if (!q || q.length < 2) return <>{value}</>;

    const re = new RegExp(`(${escapeRegExp(q)})`, "ig");
    const parts = value.split(re);

    return(
        <>
            {parts.map((part, i) => {
                // Vérifie si le morceau courant correspond à la recherche
                const isMatch = part.toLowerCase() === q.toLowerCase();
                return isMatch ? (
                    <span key={i} className='text-white bg-mars-primary/25 px-1 rounded-md'>
                        {part}
                    </span>
                ) : (
                    <span key={i}>{part}</span>
                )
            })}
        </>
    )
}

// Avatar du jury -> affiche la photo si elle existe, sinon les initiales
export function JuryAvatar({ jury }){
    const src = jury?.illustration;
    const initials = `${jury?.name?.[0] ?? ""}${jury?.lastname?.[0] ?? ""}`.toLocaleUpperCase();

    return src ? (
        <img src={src} alt={`${jury?.name ?? ""} ${jury?.lastname ?? ""}`} className="h-full w-full object-cover" />
    ) : (
        <div className="h-full w-full flex items-center justify-center text-xs font-black text-white/70">
            {initials || "?"}
        </div>
    );
}

// Avatar minimal pour les tags
export function TagAvatar() {
    return (
        <div className="h-full w-full flex items-center justify-center text-xs font-black text-white/70">
            #
        </div>
    );
}