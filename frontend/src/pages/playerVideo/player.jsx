// ici il y aura tout le code concernant le player de la vidéo
// c'est à dire le player de la vidéo, le player de la vidéo, le player de la vidéo, etc.


import React, { useEffect, useMemo, useState } from 'react';
import RatingSelector from './selectorOption/ratingSelector';
import SelectorMemo from './selectorOption/selectorMemo';
import { playerService } from '../../services/playerService';

const Player = () => {
    const [rating, setRating] = useState(0);
    const [ratingStatus, setRatingStatus] = useState('no');
    const [memo, setMemo] = useState('');
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    const userId = useMemo(() => {
        if (typeof window === 'undefined') return 1;
        const param = new URLSearchParams(window.location.search).get('userId');
        return Number(param) || 1;
    }, []);

    const embedUrl = useMemo(() => {
        if (!video?.youtube_url) return null;
        try {
            const url = new URL(video.youtube_url);
            const videoId = url.searchParams.get('v') || url.pathname.split('/').pop();
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        } catch {
            return null;
        }
    }, [video]);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                const feed = await playerService.getVideoFeed(1);
                const firstVideo = feed?.data?.[0] || null;
                if (!isMounted) return;
                setVideo(firstVideo);

                if (firstVideo) {
                    const [memoData, ratingData] = await Promise.all([
                        playerService.getMemo(firstVideo.id, userId),
                        playerService.getRating(firstVideo.id, userId),
                    ]);

                    if (!isMounted) return;
                    if (memoData?.data) {
                        setMemo(memoData.data.comment || '');
                        setRatingStatus(memoData.data.statut || 'no');
                    }
                    if (ratingData?.data?.rating) {
                        setRating(Number(ratingData.data.rating));
                    }
                }
            } catch (err) {
                if (!isMounted) return;
                setError(err.message || 'Erreur lors du chargement');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleSaveMemo = async (nextMemo = memo, nextStatus = ratingStatus) => {
        if (!video) return;
        try {
            setSaving(true);
            setStatusMessage('');
            await playerService.saveMemo({
                user_id: userId,
                video_id: video.id,
                statut: nextStatus,
                comment: nextMemo,
            });
            setStatusMessage('Memo sauvegarde');
        } catch (err) {
            setStatusMessage(err.message || 'Erreur de sauvegarde');
        } finally {
            setSaving(false);
        }
    };

    const handleRatingChange = async (nextRating) => {
        if (!video) return;
        setRating(nextRating);
        try {
            await playerService.saveRating({
                user_id: userId,
                video_id: video.id,
                rating: nextRating,
            });
        } catch (err) {
            setStatusMessage(err.message || 'Erreur lors de la sauvegarde de la note');
        }
    };

    const handleStatusChange = (nextStatus) => {
        setRatingStatus(nextStatus);
        handleSaveMemo(memo, nextStatus);
    };

    return (
        <div className="min-h-screen bg-black text-white px-6 pt-24 pb-10">
            <div className="max-w-5xl mx-auto space-y-6">
                {loading && (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-gray-400">
                        Chargement de la video...
                    </div>
                )}
                {error && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                        {error}
                    </div>
                )}
            </div>

            {!loading && video && (
                <div className="max-w-5xl mx-auto grid gap-8 lg:grid-cols-[2fr_1fr]">
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                            <div className="p-5 border-b border-white/10">
                                <h1 className="text-2xl font-bold">{video.title}</h1>
                                <p className="text-sm text-gray-400">
                                    par {video.author || 'Auteur inconnu'}
                                </p>
                            </div>
                            <div className="aspect-video bg-black">
                                {embedUrl ? (
                                    <iframe
                                        title="Video player"
                                        src={embedUrl}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <video
                                        className="w-full h-full object-cover"
                                        controls
                                        poster={video.cover || undefined}
                                    >
                                        <source src={video.video_url} type="video/mp4" />
                                        Votre navigateur ne supporte pas la lecture video.
                                    </video>
                                )}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                            <div className="text-sm text-gray-400 mb-4">
                                Statut: {ratingStatus === 'yes'
                                    ? 'Oui, notation active'
                                    : ratingStatus === 'discuss'
                                        ? 'A discuter'
                                        : 'Non, notation bloquee'}
                            </div>
                            <RatingSelector
                                initialRating={rating}
                                initialStatus={ratingStatus}
                                onRatingChange={handleRatingChange}
                                onStatusChange={handleStatusChange}
                            />
                        </div>
                    </div>

                    <aside className="space-y-6">
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                            <SelectorMemo initialMemo={memo} onMemoChange={setMemo} />
                            <button
                                type="button"
                                onClick={() => handleSaveMemo()}
                                disabled={saving}
                                className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-50"
                            >
                                {saving ? 'Sauvegarde...' : 'Enregistrer le memo'}
                            </button>
                            {statusMessage && (
                                <div className="mt-3 text-xs text-gray-400">{statusMessage}</div>
                            )}
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-gray-400">
                            <div className="font-semibold text-white mb-2">Resume local</div>
                            <div>Note: {rating > 0 ? `${rating}/10` : 'Aucune'}</div>
                            <div>Status: {ratingStatus === 'yes' ? 'Oui' : ratingStatus === 'discuss' ? 'A discuter' : 'Non'}</div>
                            <div className="mt-2 line-clamp-4">Memo: {memo || 'Vide'}</div>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
};

export default Player;