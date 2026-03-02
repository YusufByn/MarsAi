import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_URL } from "@/config";
import { videoService } from "@/services/videoService";
import { juryService } from "@/services/juryService";

const MAX_ITEMS = 5;

function getCoverUrl(video) {
    const src = video.cover_url || (video.cover ? `/uploads/covers/${video.cover}` : null);
    if (!src) return null;
    if (src.startsWith("http")) return src;
    return `${API_URL}${src}`;
}

function formatAuthor(video) {
    return video.author || [video.realisator_name, video.realisator_lastname].filter(Boolean).join(" ");
}

function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function Highlight({ text, query }) {
    const value = String(text ?? "");
    const q = String(query ?? "").trim();
    if (!q || q.length < 2) return <>{value}</>;

    const re = new RegExp(`(${escapeRegExp(q)})`, "ig");
    const parts = value.split(re);

    return (
        <>
            {parts.map((part, i) => {
                const isMatch = part.toLowerCase() === q.toLowerCase();
                return isMatch ? (
                    <span key={i} className="text-white bg-mars-primary/25 px-1 rounded-md">
                        {part}
                    </span>
                ) : (
                    <span key={i}>{part}</span>
                );
            })}
        </>
    );
}

function JuryAvatar({ jury }) {
    const src = jury.illustration;
    const initials = `${jury.name?.[0] ?? ""}${jury.lastname?.[0] ?? ""}`.toUpperCase();

    return src ? (
        <img src={src} alt={`${jury.name} ${jury.lastname}`} className="h-full w-full object-cover" />
    ) : (
        <div className="h-full w-full flex items-center justify-center text-xs font-black text-white/70">
            {initials || "?"}
        </div>
    );
}

function Row({ img, title, subtitle, onClick, active, rowRef, onMouseEnter }) {
    return (
        <button
            ref={rowRef}
            type="button"
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition
                ${active ? "bg-white/10" : "hover:bg-white/5"}`}
        >
            {/* cadre commun 40x40 */}
            <div className="h-10 w-10 rounded-xl overflow-hidden bg-white/10 shrink-0">
                {img}
            </div>

            <div className="min-w-0">
                <div className="text-sm font-semibold text-white truncate">{title}</div>
                {subtitle ? <div className="text-xs text-white/50 truncate">{subtitle}</div> : null}
            </div>
        </button>
    );
}

export default function NavbarSearch({ onAfterNavigate }) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const wrapRef = useRef(null);
    const listRef = useRef(null);
    const rowRefs = useRef([]);

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [films, setFilms] = useState([]);
    const [jurors, setJurors] = useState([]);
    const [activeIndex, setActiveIndex] = useState(-1);

    const debounceRef = useRef(null);
    const juryCacheRef = useRef(null);

    const q = useMemo(() => query.trim(), [query]);
    const hasResults = films.length > 0 || jurors.length > 0;

    const totalSelectable = useMemo(() => {
        return films.length + jurors.length + (q ? 1 : 0); // + CTA "voir tous"
    }, [films.length, jurors.length, q]);

    // ferme si clic outside
    useEffect(() => {
        const onDown = (e) => {
            if (!wrapRef.current) return;
            if (!wrapRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, []);

    // reset sélection quand on ouvre/ferme ou que la query change
    useEffect(() => {
        setActiveIndex(-1);
        rowRefs.current = [];
    }, [open, q]);

    // scroll vers l'item actif
    useEffect(() => {
        if (activeIndex < 0) return;
        const el = rowRefs.current[activeIndex];
        if (el) el.scrollIntoView({ block: "nearest" });
    }, [activeIndex]);

    // fetch suggestions (debounce)
    useEffect(() => {
        clearTimeout(debounceRef.current);

        if (!open || q.length < 2) {
            setFilms([]);
            setJurors([]);
            setLoading(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            let cancelled = false;
            setLoading(true);

            try {
                const filmRes = await videoService.getAll({
                    limit: MAX_ITEMS,
                    offset: 0,
                    search: q,
                    classification: "all",
                });
                if (!cancelled) setFilms(filmRes?.data ?? []);

                if (!juryCacheRef.current) {
                    const juryRes = await juryService.getAll();
                    juryCacheRef.current = juryRes?.data ?? [];
                }

                const low = q.toLowerCase();
                const filtered = (juryCacheRef.current || [])
                    .filter((j) => `${j.name ?? ""} ${j.lastname ?? ""}`.toLowerCase().includes(low))
                    .slice(0, MAX_ITEMS);

                if (!cancelled) setJurors(filtered);
            } catch (e) {
                console.error("[NavbarSearch] error:", e);
                setFilms([]);
                setJurors([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }, 250);

        return () => clearTimeout(debounceRef.current);
    }, [open, q]);

    const goToAll = () => {
        const qLocal = q;
        if (!qLocal) return;
        setOpen(false);
        setQuery(""); 
        navigate(`/videos?q=${encodeURIComponent(qLocal)}`);
        onAfterNavigate?.();
    };

    const selectIndex = (index) => {
        const filmCount = films.length;
        const juryCount = jurors.length;

        // films
        if (index >= 0 && index < filmCount) {
            const v = films[index];
            setOpen(false);
            setQuery(""); // ✅ ici
            navigate(`/videoDetails/${v.id}`);
            onAfterNavigate?.();
            return;
        }

        // jurys
        if (index >= filmCount && index < filmCount + juryCount) {
            const j = jurors[index - filmCount];
            setOpen(false);
            setQuery(""); // ✅ ici
            navigate(`/jury/profil/${j.id}`);
            onAfterNavigate?.();
            return;
        }

        // CTA
        if (q) {
            goToAll();
        }
    };

    const moveDown = () => {
        if (totalSelectable <= 0) return;
        setActiveIndex((i) => (i < 0 ? 0 : (i + 1) % totalSelectable));
    };

    const moveUp = () => {
        if (totalSelectable <= 0) return;
        setActiveIndex((i) => {
            if (i < 0) return totalSelectable - 1;
            return (i - 1 + totalSelectable) % totalSelectable;
        });
    };

    return (
        <div ref={wrapRef} className="relative flex items-center">
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
                    <div className="flex items-center px-1">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t("navbar.searchPlaceholder")}
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === "Escape") {
                                    setOpen(false);
                                    return;
                                }
                                if (e.key === "ArrowDown") {
                                    e.preventDefault();
                                    moveDown();
                                    return;
                                }
                                if (e.key === "ArrowUp") {
                                    e.preventDefault();
                                    moveUp();
                                    return;
                                }
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    if (activeIndex >= 0) selectIndex(activeIndex);
                                    else goToAll();
                                }
                            }}
                            className="w-56 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-mars-primary/50"
                        />
                    </div>

                    {(loading || hasResults || q.length >= 2) && (
                        <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-[360px] rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl overflow-hidden z-[200]">
                            <div className="p-2 max-h-[360px] overflow-auto" ref={listRef}>
                                {loading && (
                                    <div className="px-3 py-2 text-xs text-white/50 animate-pulse">
                                        Recherche…
                                    </div>
                                )}

                                {!loading && !hasResults && q.length >= 2 && (
                                    <div className="px-3 py-2 text-xs text-white/50">Aucun résultat</div>
                                )}

                                {/* FILMS */}
                                {!loading && films.length > 0 && (
                                    <div className="mb-2">
                                        <div className="px-3 py-1 text-[10px] tracking-[0.3em] uppercase text-white/40 font-bold">
                                            Films
                                        </div>
                                        <div className="space-y-1">
                                            {films.map((v, i) => {
                                                const cover = getCoverUrl(v);
                                                const author = formatAuthor(v);
                                                const idx = i; // index global (films commencent à 0)

                                                return (
                                                    <Row
                                                        key={`film-${v.id}`}
                                                        rowRef={(el) => (rowRefs.current[idx] = el)}
                                                        active={activeIndex === idx}
                                                        onMouseEnter={() => setActiveIndex(idx)}
                                                        img={
                                                            cover ? (
                                                                <img src={cover} alt={v.title} className="h-full w-full object-cover" />
                                                            ) : (
                                                                <div className="h-full w-full bg-white/10" />
                                                            )
                                                        }
                                                        title={<Highlight text={v.title || "Sans titre"} query={q} />}
                                                        subtitle={author ? <Highlight text={author} query={q} /> : null}
                                                        onClick={() => selectIndex(idx)}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* JURY */}
                                {!loading && jurors.length > 0 && (
                                    <div className="mb-1">
                                        <div className="px-3 py-1 text-[10px] tracking-[0.3em] uppercase text-white/40 font-bold">
                                            Jury
                                        </div>
                                        <div className="space-y-1">
                                            {jurors.map((j, jIndex) => {
                                                const idx = films.length + jIndex; // index global après films
                                                const fullName = `${j.name ?? ""} ${j.lastname ?? ""}`.trim() || "Jury";

                                                return (
                                                    <Row
                                                        key={`jury-${j.id}`}
                                                        rowRef={(el) => (rowRefs.current[idx] = el)}
                                                        active={activeIndex === idx}
                                                        onMouseEnter={() => setActiveIndex(idx)}
                                                        img={<JuryAvatar jury={j} />}
                                                        title={<Highlight text={fullName} query={q} />}
                                                        subtitle={null}
                                                        onClick={() => selectIndex(idx)}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* CTA "voir tous" (sélectionnable clavier) */}
                                {!loading && q && (
                                    <div className="mt-2 pt-2 border-t border-white/10">
                                        {(() => {
                                            const idx = films.length + jurors.length; // dernier index
                                            return (
                                                <button
                                                    ref={(el) => (rowRefs.current[idx] = el)}
                                                    onMouseEnter={() => setActiveIndex(idx)}
                                                    onClick={() => selectIndex(idx)} // ✅ centralisé
                                                    className={`w-full px-3 py-2 rounded-xl text-xs font-semibold transition text-left
                                                    ${activeIndex === idx ? "bg-white/10 text-white" : "bg-white/5 hover:bg-white/10 text-white/70"}`}
                                                >
                                                    Voir tous les résultats pour “{q}”
                                                </button>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}