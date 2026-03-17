// Composant d'affichage commun pour les résultats de recherche
// Affiche les sections Films, Jury, Tags et le CTA final

import React from "react";
import { formatAuthor, getCoverUrl, Highlight, JuryAvatar, TagAvatar } from "./searchUtils";

// Nombre minimum de caractères pour afficher le CTA et les états de recherche
const MIN_QUERY_LENGTH = 2;

// Ligne de résultat réutilisable (film/jury/tag)
function Row({ img, title, subtitle, onClick, active, rowRef, onMouseEnter, rounded = "rounded-xl" }) {
    return (
        <button
            ref={rowRef}
            type="button"
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            className={`w-full flex items-center gap-3 px-3 py-2 ${rounded} text-left transition
                ${active ? "bg-white/10" : "hover:bg-white/5"}`}
        >
            {/* Cadre visuel commun pour l'image ou l'avatar */}
            <div className="h-10 w-10 rounded-xl overflow-hidden bg-white/10 shrink-0">{img}</div>

            <div className="min-w-0">
                <div className="text-sm font-semibold text-white truncate">{title}</div>
                    {subtitle ? <div className="text-xs text-white/50 truncate">{subtitle}</div> : null}
                </div>
        </button>
    );
}

export default function SearchResultsList({
    loading,
    q,
    films,
    jurors,
    tags,
    activeIndex,
    setActiveIndex,
    setRowRef,       // Associe une ref à chaque ligne via son index
    onSelectIndex,   // Sélectionne une ligne à partir de son index global
    dense = false,   // true pour le dropdown desktop, false pour l'overlay mobile
}) {
    // Indique s'il existe au moins un résultat dans une des sections
    const hasResults = films.length > 0 || jurors.length > 0 || tags.length > 0;

    // Index global du CTA, placé après tous les résultats
    const ctaIndex = films.length + jurors.length + tags.length;

    return (
        <div className="p-2">
            {loading && <div className="px-3 py-2 text-xs text-white/50 animate-pulse">Recherche…</div>}

            {!loading && !hasResults && q.length >= MIN_QUERY_LENGTH && (
                <div className="px-3 py-2 text-xs text-white/50">Aucun résultat</div>
            )}

            {/* Films */}
            {!loading && films.length > 0 && (
                <div className="mb-2">
                    <div className="px-3 py-1 text-[10px] tracking-[0.3em] uppercase text-white/40 font-bold">Films</div>
                    <div className="space-y-1">
                        {/* l'index global correspond à l'index du film */}
                        {films.map((v, i) => {
                            const cover = getCoverUrl(v);
                            const author = formatAuthor(v);
                            const idx = i;

                            return (
                                <Row
                                    key={`film-${v.id}`}
                                    rowRef={setRowRef(idx)}
                                    active={activeIndex === idx}
                                    onMouseEnter={() => setActiveIndex(idx)}
                                    img={cover ? <img src={cover} alt={v.title} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-white/10" />}
                                    title={<Highlight text={v.title || "Sans titre"} query={q} />}
                                    subtitle={author ? <Highlight text={author} query={q} /> : null}
                                    onClick={() => onSelectIndex(idx)}
                                    rounded={dense ? "rounded-xl" : "rounded-2xl"}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Jury */}
            {!loading && jurors.length > 0 && (
                <div className="mb-1">
                    <div className="px-3 py-1 text-[10px] tracking-[0.3em] uppercase text-white/40 font-bold">Jury</div>
                    <div className="space-y-1">
                        {jurors.map((j, jIndex) => {
                            //  l'index global => les jurés viennent après les films 
                            const idx = films.length + jIndex;
                            // Nom complet affiché avec fallback si les champs sont absents
                            const fullName = `${j.name ?? ""} ${j.lastname ?? ""}`.trim() || "Jury";

                            return (
                                <Row
                                    key={`jury-${j.id}`}
                                    rowRef={setRowRef(idx)}
                                    active={activeIndex === idx}
                                    onMouseEnter={() => setActiveIndex(idx)}
                                    img={<JuryAvatar jury={j} />}
                                    title={<Highlight text={fullName} query={q} />}
                                    subtitle={null}
                                    onClick={() => onSelectIndex(idx)}
                                    rounded={dense ? "rounded-xl" : "rounded-2xl"}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Tags */}
            {!loading && tags.length > 0 && (
                <div className="mb-1">
                    <div className="px-3 py-1 text-[10px] tracking-[0.3em] uppercase text-white/40 font-bold">Tags</div>
                    <div className="space-y-1">
                        {tags.map((tag, tagIndex) => {
                            // Index global => les tags viennent après les films et les jurés
                            const idx = films.length + jurors.length + tagIndex;

                            return (
                                <Row
                                    key={`tag-${tag.id ?? tag.name}`}
                                    rowRef={setRowRef(idx)}
                                    active={activeIndex === idx}
                                    onMouseEnter={() => setActiveIndex(idx)}
                                    img={<TagAvatar />}
                                    title={<Highlight text={tag.name} query={q} />}
                                    subtitle={null}
                                    onClick={() => onSelectIndex(idx)}
                                    rounded={dense ? "rounded-xl" : "rounded-2xl"}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* CTA => bouton final pour afficher la page complète des résultats */}
            {!loading && q.length >= MIN_QUERY_LENGTH && (
                <div className="mt-2 pt-2 border-t border-white/10">
                    <button
                        ref={setRowRef(ctaIndex)}
                        onMouseEnter={() => setActiveIndex(ctaIndex)}
                        onClick={() => onSelectIndex(ctaIndex)}
                        className={`w-full px-3 ${dense ? "py-2 text-xs rounded-xl" : "py-3 text-sm rounded-2xl"} font-semibold transition text-left
                            ${activeIndex === ctaIndex ? "bg-white/10 text-white" : "bg-white/5 hover:bg-white/10 text-white/70"}`}
                    >
                        Voir tous les résultats pour “{q}”
                    </button>
                </div>
            )}
        </div>
    );
}