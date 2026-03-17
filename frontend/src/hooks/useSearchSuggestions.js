// Hook commun de suggestions de recherche
// - fetch (récupération des données) 
// - cache (garde certaines données en mémoire pour éviter de refaire des appels) 
// - debounce (attend un court délai avant de lancer la recherche)

// Retourne : q (trim), loading, films, jurors, tags

import { useEffect, useMemo, useRef, useState } from "react";
import { videoService } from "@/services/videoService";
import { juryService } from "@/services/juryService";

export function useSearchSuggestions({ enabled, query, maxItems = 6, debounceMs = 250 }) {
    // Requête nettoyée => supprime les espaces inutiles au début et à la fin
    const q = useMemo(() => String(query ?? "").trim(), [query]);

    // États des suggestions et du chargement
    const [loading, setLoading] = useState(false);
    const [films, setFilms] = useState([]);
    const [jurors, setJurors] = useState([]);
    const [tags, setTags] = useState([]);

    // debounceRef : stocke le timer du debounce
    // requestIdRef : empêche une ancienne requête d'écraser une plus récente
    const debounceRef = useRef(null);
    const requestIdRef = useRef(0);

    // Cache local => on charge une fois, puis on filtre côté client
    const juryCacheRef = useRef(null);
    const tagCacheRef = useRef(null);

    useEffect(() => {
        // Si la recherche est désactivée ou trop courte, on vide les suggestions
        if (!enabled || q.length < 2) {
            setLoading(false);
            setFilms([]);
            setJurors([]);
            setTags([]);
            return;
        }

        // Annule le timer précédent si le user continue de taper
        clearTimeout(debounceRef.current);

        // Id unique de la requête courante
        const myRequestId = ++requestIdRef.current;

        // Attend un peu avant de lancer la recherche pour éviter trop d'appels
        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const low = q.toLowerCase();

                // Films : via API (search côté backend)
                const filmRes = await videoService.getAll({
                    limit: maxItems,
                    offset: 0,
                    search: q,
                    classification: "all",
                });

                // Met à jour uniquement si cette requête est toujours la plus récente
                if (requestIdRef.current === myRequestId) setFilms(filmRes?.data ?? []);

                // Jury (charge une fois, puis filtre côté client)
                if (!juryCacheRef.current) {
                    const juryRes = await juryService.getAll();
                    juryCacheRef.current = juryRes?.data ?? [];
                }

                const filteredJurors = (juryCacheRef.current || [])
                    .filter((j) => `${j?.name ?? ""} ${j?.lastname ?? ""}`.toLowerCase().includes(low))
                    .slice(0, maxItems);
                
                if (requestIdRef.current === myRequestId) setJurors(filteredJurors);

                // Tags (charge une fois, puis filtre côté client)
                if (!tagCacheRef.current) {
                    const tagRes = await videoService.getAllTags();
                    tagCacheRef.current = tagRes?.data ?? tagRes ?? [];
                }

                const filteredTags = (tagCacheRef.current || [])
                    .filter((t) => String(t?.name ?? "").toLowerCase().includes(low))
                    .slice(0, maxItems);
                
                if (requestIdRef.current === myRequestId) setTags(filteredTags);

            } catch (error) {
                console.error("[useSearchSuggestions] error:", error);

                // En cas d'erreur, on vide les suggestions de la requête active
                if (requestIdRef.current === myRequestId) {
                    setFilms([]);
                    setJurors([]);
                    setTags([]);
                }
                
            } finally {
                // Arrête le loader seulement si cette requête est toujours la plus récente
                if (requestIdRef.current === myRequestId) setLoading(false);

            }
        }, debounceMs);

        // Nettoyage => annule le timer si la recherche change ou si le composant se démonte (disparaît de l'écran)
        return () => clearTimeout(debounceRef.current);
    }, [enabled, q, maxItems, debounceMs]);

    return { q, loading, films, jurors, tags };
}