import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSearchSuggestions } from "@/components/search/useSearchSuggestions";
import SearchResultsList from "@/components/search/SearchResultsList";

// Nombre max d'éléments affichés par section
const MAX_ITEMS = 6;

// Barre de recherche desktop dans la navbar
// Gère l'ouverture, la saisie, les suggestions, et la navigation clavier
export default function NavbarSearch({ onAfterNavigate }) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // wrapRef => permet de détecter les clics à l'extérieur du composant
    const wrapRef = useRef(null);
    // rowRefs => stock les ref des lignes pour le scroll vers l'éléments actif
    const rowRefs = useRef([]);

    // état locaux => 
        // - open (ouvre ou ferme la recherche)
        // - query (texte saisi)
        // - activeIndex (élément actuellement sélectionné au clavier)
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(-1);

    // Suggestions partagées (films + jurys + tags)
    const { q, loading, films, jurors, tags } = useSearchSuggestions({
        enabled: open,
        query,
        maxItems: MAX_ITEMS,
        debounceMs: 250,
    });

    // Indique s'il existe au moins un résutat dans une des sections
    const hasResults = films.length > 0 || jurors.length > 0 || tags.length > 0;

    // Nombre total d'éléments navigables au clavier
    // (films + jurés + tags + CTA final)
    const totalSelectable = useMemo(() => {
        return films.length + jurors.length + tags.length + (q ? 1 : 0);
    }, [films.length, jurors.length, tags.length, q]);

    // Associe chaque ligne affichée à sa ref via son index global
    const setRowRef = (idx) => (el) => {
        rowRefs.current[idx] = el;
    };

    // Fermer la recherche si le user clique en dehors du composant
    useEffect(() => {
        const onDown = (e) => {
            if (!wrapRef.current) return;
            if (!wrapRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, []);

    // Réinitialise la sélection quand on ouvre, ferme ou change la recherche
    useEffect(() => {
        setActiveIndex(-1);
        rowRefs.current = [];
    }, [open, q]);

    // Fait défiler la liste pour garder l'élément actif visible
    useEffect(() => {
        if (activeIndex < 0) return;
        const el = rowRefs.current[activeIndex];
        if (el) el.scrollIntoView({ block: "nearest" });
    }, [activeIndex]);

    // Redirige vers la page complète des résultats
    const goToAll = () => {
        if (!q) return;
        setOpen(false);
        setQuery("");
        navigate(`/videos?q=${encodeURIComponent(q)}`);
        onAfterNavigate?.();
    };

    // Ouvre un élément selon son index global
    // (les films, puis les jurés, puis les tags, sinon CTA final)
    const selectIndex = (index) => {
        const filmCount = films.length;
        const juryCount = jurors.length;
        const tagCount = tags.length;

        // Section Films
        if (index >= 0 && index < filmCount) {
            const v = films[index];
            setOpen(false);
            setQuery("");
            navigate(`/videoDetails/${v.id}`);
            onAfterNavigate?.();
            return;
        }

        // Section Jury
        if (index >= filmCount && index < filmCount + juryCount) {
            const j = jurors[index - filmCount];
            setOpen(false);
            setQuery("");
            navigate(`/jury/profil/${j.id}`);
            onAfterNavigate?.();
            return;
        }

        const tagStart = filmCount + juryCount;
        const tagEnd = tagStart + tagCount;

        // Section tags
        if (index >= tagStart && index < tagEnd) {
            const tag = tags[index - tagStart];
            setOpen(false);
            setQuery("");
            navigate(`/videos?q=${encodeURIComponent(tag.name)}`);
            onAfterNavigate?.();
            return;
        }

        // CTA "voir tous"
        goToAll();
    };

    // Navigation clavier vers le bas avec boucle
    const moveDown = () => {
        if (totalSelectable <= 0) return;
        setActiveIndex((i) => (i < 0 ? 0 : (i + 1) % totalSelectable));
    };

    // Navigation clavier vers le haut avec boucle
    const moveUp = () => {
        if (totalSelectable <= 0) return;
        setActiveIndex((i) => {
            if (i < 0) return totalSelectable - 1;
            return (i - 1 + totalSelectable) % totalSelectable;
        });
    };

    return (
        <div ref={wrapRef} className="relative flex items-center">
            {/* état fermé => affiche uniquement le bouton loupe */}
            {!open ? (
                <button
                    onClick={() => setOpen(true)}
                    className="p-2.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                    title={t("navbar.searchFilm")}
                    aria-label={t("navbar.searchFilm")}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            ) : (
                <div className="relative">
                    {/* état ouvert => champ de recherche */}
                    <div className="flex items-center px-1">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t("navbar.searchPlaceholder")}
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === "Escape") return setOpen(false);
                                if (e.key === "ArrowDown") { e.preventDefault(); return moveDown(); }
                                if (e.key === "ArrowUp") { e.preventDefault(); return moveUp(); }
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    if (activeIndex >= 0) return selectIndex(activeIndex);
                                    return goToAll();
                                }
                            }}
                            className="w-56 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-mars-primary/50"
                        />
                    </div>

                    {/* Dropdown des suggestions */}
                    {(loading || hasResults || q.length >= 2) && (
                        <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-[360px] rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl overflow-hidden z-[200]">
                            <div className="max-h-[360px] overflow-auto">
                                <SearchResultsList
                                    dense
                                    loading={loading}
                                    q={q}
                                    films={films}
                                    jurors={jurors}
                                    tags={tags}
                                    activeIndex={activeIndex}
                                    setActiveIndex={setActiveIndex}
                                    setRowRef={setRowRef}
                                    onSelectIndex={selectIndex}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}