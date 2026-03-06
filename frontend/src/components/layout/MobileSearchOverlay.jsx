import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSearchSuggestions } from "@/components/search/useSearchSuggestions";
import SearchResultsList from "@/components/search/SearchResultsList";

// Nombre max d'éléments affichés par section
const MAX_ITEMS = 6;

// Overlay mobile de recherche => saisie, suggestions et navigation clavier
export default function MobileSearchOverlay({ open, onClose }) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // inputRef => permet de focus l'input à l'ouverture 
    const inputRef = useRef(null);
    // rowRefs => stock les refs des lignes pour le scroll vers l'élément actif
    const rowRefs = useRef([]);

    // état locaux => texte saisi et index actuellement sélectionné
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(-1);

    // Suggestions de recherche partagées => films, jurés, tags
    const { q, loading, films, jurors, tags } = useSearchSuggestions({
        enabled: open,
        query,
        maxItems: MAX_ITEMS,
        debounceMs: 250,
    });

    // Indique s'il existe au moins un résultat dans une des sections
    const hasResults = films.length > 0 || jurors.length > 0 || tags.length > 0;

    // Nrombre total d'éléments navigables => films + jurés + tags + CTA final "voir tous"
    const totalSelectable = useMemo(() => {
        return films.length + jurors.length + tags.length + (q ? 1 : 0);
    }, [films.length, jurors.length, tags.length, q]);

    // Associe chaque élément affiché à sa ref via son index global
    const setRowRef = (idx) => (el) => {
        rowRefs.current[idx] = el;
    };

    // À l’ouverture => bloque le scroll de la page, focus l'input, permet de fermer avec Escape
    useEffect(() => {
        if (!open) return;

        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        setTimeout(() => inputRef.current?.focus(), 0);

        const onKey = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        document.addEventListener("keydown", onKey);

        return () => {
            document.body.style.overflow = prev;
            document.removeEventListener("keydown", onKey);
        };
    }, [open, onClose]);

    // Réinitialise la sélection quand on onvre, ferme ou change de recherche
    useEffect(() => {
        setActiveIndex(-1);
        rowRefs.current = [];
    }, [open, q]);

    // Fait défiler la liste pour garder l'éément actif visible
    useEffect(() => {
        if (activeIndex < 0) return;
        const el = rowRefs.current[activeIndex];
        if (el) el.scrollIntoView({ block: "nearest" });
    }, [activeIndex]);

    // Ferme l'overlay et remet l'état local à zéro
    const closeAndReset = () => {
        setQuery("");
        setActiveIndex(-1);
        onClose?.();
    };

    // Redirige vers la page complète des résultats
    const goToAll = () => {
        if (!q) return;
        closeAndReset();
        navigate(`/videos?q=${encodeURIComponent(q)}`);
    };

    // Sélectionne un élément selon son index global => 
    // - d'avord les films, puis les jurés, puis les tags, sinon le CTA final
    const selectIndex = (index) => {
        const filmCount = films.length;
        const juryCount = jurors.length;
        const tagCount = tags.length;

        // Section Films
        if (index >= 0 && index < filmCount) {
            const v = films[index];
            closeAndReset();
            navigate(`/videoDetails/${v.id}`);
            return;
        }

        // Section Jury 
        if (index >= filmCount && index < filmCount + juryCount) {
            const j = jurors[index - filmCount];
            closeAndReset();
            navigate(`/jury/profil/${j.id}`);
            return;
        }

        const tagStart = filmCount + juryCount;
        const tagEnd = tagStart + tagCount;

        // Section Tags
        if (index >= tagStart && index < tagEnd) {
            const tag = tags[index - tagStart];
            closeAndReset();
            navigate(`/videos?q=${encodeURIComponent(tag.name)}`);
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

    // navigation clavier vers le haut avec boucle
    const moveUp = () => {
        if (totalSelectable <= 0) return;
        setActiveIndex((i) => {
            if (i < 0) return totalSelectable - 1;
            return (i - 1 + totalSelectable) % totalSelectable;
        });
    };

    // Ne rend rien tant que l'overlay est fermé
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[200]">
            {/* Fond sombre cliquable = clic en dehors => fermeture */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onMouseDown={closeAndReset}
                aria-hidden="true"
            />

            {/* Contenu au-dessus => stopPropagation pour éviter la fermeture au clic dedans) */}
            <div className="relative z-10" onMouseDown={(e) => e.stopPropagation()}>
                {/* Header avec bouton fermer + input */}
                <div className="absolute inset-x-0 top-0 bg-black/95 border-b border-white/10">
                    <div className="max-w-[1440px] mx-auto px-4 py-3 flex items-center gap-3">
                        <button
                            onClick={closeAndReset}
                            className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center"
                            aria-label="Fermer"
                        >
                            <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="flex-1 relative">
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>

                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={t("navbar.searchPlaceholder")}
                                onKeyDown={(e) => {
                                    if (e.key === "ArrowDown") {
                                        e.preventDefault();
                                        return moveDown();
                                    }
                                    if (e.key === "ArrowUp") {
                                        e.preventDefault();
                                        return moveUp();
                                    }
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        if (activeIndex >= 0) return selectIndex(activeIndex);
                                        return goToAll();
                                    }
                                }}
                                className="w-full h-10 rounded-2xl bg-white/5 border border-white/10 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/40"
                            />
                        </div>
                    </div>
                </div>

                {/* Zone des résultats */}
                <div className="pt-16 px-4">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="rounded-3xl border border-white/10 bg-black/80 backdrop-blur-xl max-h-[70vh] overflow-auto">
                            <SearchResultsList
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

                            {/* Indication affichée tant que le user n'a pas encore saisi 2 caractères */}
                            {!loading && !hasResults && q.length < 2 && (
                                <div className="px-5 py-4 text-xs text-white/40">Tape au moins 2 caractères…</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}