import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_URL } from "@/config";
import { videoService } from "@/services/videoService";
import { juryService } from "@/services/juryService";

const MAX_ITEMS = 6;

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
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-left transition
                ${active ? "bg-white/10" : "hover:bg-white/5"}`}
        >
            <div className="h-10 w-10 rounded-xl overflow-hidden bg-white/10 shrink-0">
            {   img}
            </div>

            <div className="min-w-0">
                <div className="text-sm font-semibold text-white truncate">{title}</div>
                    {subtitle ? <div className="text-xs text-white/50 truncate">{subtitle}</div> : null}
                </div>
        </button>
    );
}

export default function MobileSearchOverlay({ open, onClose }) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const inputRef = useRef(null);
    const listRef = useRef(null);
    const rowRefs = useRef([]);

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
        return films.length + jurors.length + (q ? 1 : 0);
    }, [films.length, jurors.length, q]);

    useEffect(() => {
        if (!open) return;

        // lock scroll derrière
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        // focus input
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

    // reset selection quand query change
    useEffect(() => {
        setActiveIndex(-1);
        rowRefs.current = [];
    }, [q, open]);

    // scroll to active row
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
            setLoading(true);
            try {
                const filmRes = await videoService.getAll({
                    limit: MAX_ITEMS,
                    offset: 0,
                    search: q,
                    classification: "all",
                });
                setFilms(filmRes?.data ?? []);

                if (!juryCacheRef.current) {
                    const juryRes = await juryService.getAll();
                    juryCacheRef.current = juryRes?.data ?? [];
                }

                const low = q.toLowerCase();
                const filtered = (juryCacheRef.current || [])
                    .filter((j) => `${j.name ?? ""} ${j.lastname ?? ""}`.toLowerCase().includes(low))
                    .slice(0, MAX_ITEMS);

                setJurors(filtered);
            } catch (e) {
                console.error("[MobileSearchOverlay] error:", e);
                setFilms([]);
                setJurors([]);
            } finally {
                setLoading(false);
            }
        }, 250);

        return () => clearTimeout(debounceRef.current);
    }, [open, q]);

    const closeAndReset = () => {
        setQuery("");
        setFilms([]);
        setJurors([]);
        setActiveIndex(-1);
        onClose?.();
    };

    const goToAll = () => {
        const qLocal = q;
        if (!qLocal) return;
        closeAndReset();
        navigate(`/videos?q=${encodeURIComponent(qLocal)}`);
    };

    const selectIndex = (index) => {
        const filmCount = films.length;
        const juryCount = jurors.length;

        if (index >= 0 && index < filmCount) {
            const v = films[index];
            closeAndReset();
            navigate(`/videoDetails/${v.id}`);
            return;
        }

        if (index >= filmCount && index < filmCount + juryCount) {
            const j = jurors[index - filmCount];
            closeAndReset();
            navigate(`/jury/profil/${j.id}`);
            return;
        }

        if (q) goToAll();
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

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm">
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
                                if (e.key === "ArrowDown") { e.preventDefault(); moveDown(); }
                                if (e.key === "ArrowUp") { e.preventDefault(); moveUp(); }
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    if (activeIndex >= 0) selectIndex(activeIndex);
                                    else goToAll();
                                }
                            }}
                            className="w-full h-10 rounded-2xl bg-white/5 border border-white/10 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-mars-primary/40"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-16 px-4">
                <div className="max-w-[1440px] mx-auto">
                    <div ref={listRef} className="rounded-3xl border border-white/10 bg-black/80 backdrop-blur-xl p-2 max-h-[70vh] overflow-auto">
                        {loading && <div className="px-3 py-3 text-xs text-white/50 animate-pulse">Recherche…</div>}
                        {!loading && !hasResults && q.length >= 2 && <div className="px-3 py-3 text-xs text-white/50">Aucun résultat</div>}

                        {!loading && films.length > 0 && (
                            <div className="mb-2">
                                <div className="px-3 py-1 text-[10px] tracking-[0.3em] uppercase text-white/40 font-bold">Films</div>
                                <div className="space-y-1">
                                    {films.map((v, i) => {
                                        const cover = getCoverUrl(v);
                                        const author = formatAuthor(v);
                                        const idx = i;

                                        return (
                                            <Row
                                                key={`film-${v.id}`}
                                                rowRef={(el) => (rowRefs.current[idx] = el)}
                                                active={activeIndex === idx}
                                                onMouseEnter={() => setActiveIndex(idx)}
                                                img={cover ? <img src={cover} alt={v.title} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-white/10" />}
                                                title={<Highlight text={v.title || "Sans titre"} query={q} />}
                                                subtitle={author ? <Highlight text={author} query={q} /> : null}
                                                onClick={() => selectIndex(idx)}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {!loading && jurors.length > 0 && (
                            <div className="mb-1">
                                <div className="px-3 py-1 text-[10px] tracking-[0.3em] uppercase text-white/40 font-bold">Jury</div>
                                <div className="space-y-1">
                                    {jurors.map((j, jIndex) => {
                                        const idx = films.length + jIndex;
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

                        {!loading && q && (
                            <div className="mt-2 pt-2 border-t border-white/10">
                                {(() => {
                                    const idx = films.length + jurors.length;
                                    return (
                                        <button
                                            ref={(el) => (rowRefs.current[idx] = el)}
                                            onMouseEnter={() => setActiveIndex(idx)}
                                            onClick={() => selectIndex(idx)}
                                            className={`w-full px-3 py-3 rounded-2xl text-sm font-semibold transition text-left
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
            </div>
        </div>
    );
}