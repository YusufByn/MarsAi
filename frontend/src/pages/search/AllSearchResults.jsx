import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";
import { getCoverUrl, formatAuthor, Highlight, JuryAvatar } from "@/components/search/searchUtils";

const MAX_ITEMS = 24;
const MIN_QUERY_LENGTH = 2;

export default function AllSearchResults() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Récupère la recherche depuis l'URL
    const urlQuery = searchParams.get("q") ?? "";

    // Valeur locale de l'input
    const [inputValue, setInputValue] = useState(urlQuery);

    // Si l'URL change (retour en arrière/navigation), on resynchronise l'input
    useEffect(() => {
        setInputValue(urlQuery);
    }, [urlQuery]);

    // Recherche globale avec la même logique que la searchbar
    const { q, loading, films, jurors } = useSearchSuggestions({
        enabled: true,
        query: inputValue,
        maxItems: MAX_ITEMS,
        debounceMs: 250,
    });

    const hasEnoughChars = q.length >= MIN_QUERY_LENGTH;
    const hasResults = films.length > 0 || jurors.length > 0;

    // Met à jours l'URL avec un léger délai pour éviter un refresh trop agressif
    useEffect(() => {
        const timer = setTimeout(() => {
            const trimmed = inputValue.trim();

            if (trimmed === urlQuery) return;

            if (trimmed){
                setSearchParams({ q: trimmed }, { replace: true});
            }else{
                setSearchParams({}, { replace: true });
            }
        }, 300);
        
        return () => clearTimeout(timer);
    }, [inputValue, urlQuery, setSearchParams]);

    return (
        <section className="min-h-screen bg-black text-white">
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10">
                {/* En-tête de la page*/}
                <div className="mb-8">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-bold mb-3">
                        Recherche globale
                    </p>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                        Tous les résultats
                    </h1>
                    <p className="mt-3 text-sm md:text-base text-white/60">
                        Recherche parmi les films et le jury.
                    </p>
                </div>

                {/* Barre de recherche */}
                <div className="mb-8">
                    <div className="relative">
                        <svg
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/35"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.8}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>

                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Rechercher un film ou un membre du jury..."
                            className="w-full h-12 md:h-14 rounded-2xl bg-white/5 border border-white/10 pl-12 pr-4 text-sm md:text-base text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/40"
                        />
                    </div>
                </div>

                {/* États : minimum, chargement, vide */}
                {!hasEnoughChars && (
                    <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/50">
                        Tape au moins {MIN_QUERY_LENGTH} caractères pour lancer la recherche.
                    </div>
                )}

                {hasEnoughChars && loading && (
                    <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/50 animate-pulse">
                        Recherche en cours…
                    </div>
                )}

                {hasEnoughChars && !loading && !hasResults && (
                    <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/50">
                        Aucun résultat pour “{q}”.
                    </div>
                )}

                {/* Section Films */}
                {hasEnoughChars && !loading && films.length > 0 && (
                    <div className="mb-10">
                        <div className="mb-4">
                            <h2 className="text-xl md:text-2xl font-bold">Films</h2>
                            <p className="text-sm text-white/45 mt-1">
                                {films.length} résultat{films.length > 1 ? "s" : ""}
                            </p>
                        </div>

                        <div className="space-y-3">
                            {films.map((film) => {
                            const cover = getCoverUrl(film);
                            const author = formatAuthor(film);

                                return (
                                    <button
                                        key={film.id}
                                        type="button"
                                        onClick={() => navigate(`/videoDetails/${film.id}`)}
                                        className="w-full text-left rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition p-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl overflow-hidden bg-white/10 shrink-0">
                                                {cover ? (
                                                    <img
                                                        src={cover}
                                                        alt={film.title || "Film"}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full bg-white/10" />
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <div className="text-base md:text-lg font-semibold text-white truncate">
                                                    <Highlight text={film.title || "Sans titre"} query={q} />
                                                </div>

                                                {author ? (
                                                    <div className="text-sm text-white/55 truncate">
                                                        <Highlight text={author} query={q} />
                                                    </div>
                                                ) : null}

                                                {film.classification ? (
                                                    <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/35">
                                                        {film.classification}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Section Jury */}
                {hasEnoughChars && !loading && jurors.length > 0 && (
                    <div>
                        <div className="mb-4">
                            <h2 className="text-xl md:text-2xl font-bold">Jury</h2>
                            <p className="text-sm text-white/45 mt-1">
                                {jurors.length} résultat{jurors.length > 1 ? "s" : ""}
                            </p>
                        </div>

                        <div className="space-y-3">
                            {jurors.map((juror) => {
                                const fullName =
                                    `${juror?.name ?? ""} ${juror?.lastname ?? ""}`.trim() || "Jury";

                                return (
                                    <button
                                        key={juror.id}
                                        type="button"
                                        onClick={() => navigate(`/jury/profil/${juror.id}`)}
                                        className="w-full text-left rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition p-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl overflow-hidden bg-white/10 shrink-0">
                                                <JuryAvatar jury={juror} />
                                            </div>

                                            <div className="min-w-0">
                                                <div className="text-base md:text-lg font-semibold text-white truncate">
                                                    <Highlight text={fullName} query={q} />
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}