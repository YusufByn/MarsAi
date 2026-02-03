import { useState, useEffect, useRef } from 'react';
import RatingSelector from './selectorOption/ratingSelector';
import SelectorMemo from './selectorOption/selectorMemo';
import { playerService } from '../../services/playerService';

const Player = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showControls, setShowControls] = useState(false);
  
  // États pour rating et memo
  const [ratings, setRatings] = useState({});
  const [memos, setMemos] = useState({});
  const [statuses, setStatuses] = useState({});
  const [saving, setSaving] = useState(false);
  
  const containerRef = useRef(null);
  const videosRef = useRef({});
  const touchStartY = useRef(0);
  const observerRef = useRef(null);
  const userId = 1; // À remplacer par l'ID utilisateur réel

  // URL du backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  // Charger les ratings et memos existants (fonction déclarée AVANT useEffect)
  const loadRatingsAndMemos = async (videoList) => {
    try {
      const ratingsData = {};
      const memosData = {};
      const statusesData = {};

      for (const video of videoList) {
        try {
          // Charger le memo
          const memoResponse = await playerService.getMemo(video.id, userId);
          if (memoResponse?.data) {
            memosData[video.id] = memoResponse.data.comment || '';
            statusesData[video.id] = memoResponse.data.statut || 'no';
          } else {
            statusesData[video.id] = 'no';
          }

          // Charger le rating
          const ratingResponse = await playerService.getRating(video.id, userId);
          if (ratingResponse?.data?.rating) {
            ratingsData[video.id] = Number(ratingResponse.data.rating);
          }
        } catch (err) {
          console.log(`Pas de données pour vidéo ${video.id}`);
          statusesData[video.id] = 'no';
        }
      }

      setRatings(ratingsData);
      setMemos(memosData);
      setStatuses(statusesData);
    } catch (error) {
      console.error('Erreur chargement ratings/memos:', error);
    }
  };

  // Récupérer les vidéos depuis le backend
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        console.log('🔄 Chargement des vidéos depuis:', `${API_URL}/api/player/videos`);
        const response = await fetch(`${API_URL}/api/player/videos`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Erreur HTTP:', response.status, errorText);
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('📦 Données reçues:', result);
        const videos = result.data || result;
        
        // Construire l'URL complète pour chaque vidéo
        const videosWithFullUrl = Array.isArray(videos) ? videos.map(video => ({
          ...video,
          video_url: video.video_url 
            ? `${API_URL}${video.video_url}` 
            : video.filename 
              ? `${API_URL}/upload/${video.filename}`
              : null
        })) : [];
        
        console.log('✅ Vidéos chargées:', videosWithFullUrl.length);
        videosWithFullUrl.forEach((v, i) => {
          console.log(`  ${i + 1}. ${v.title} - ${v.video_url}`);
        });
        
        setVideos(videosWithFullUrl);
        
        // Charger les ratings et memos pour chaque vidéo
        if (videosWithFullUrl.length > 0) {
          await loadRatingsAndMemos(videosWithFullUrl);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Erreur chargement vidéos:', error);
        setIsLoading(false);
        setVideos([]);
      }
    };

    fetchVideos();
  }, [API_URL, userId]);

  // Intersection Observer pour détecter quelle vidéo est visible
  useEffect(() => {
    if (videos.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoElement = entry.target.querySelector('video');
          if (!videoElement) return;

          const index = parseInt(entry.target.dataset.index);

          if (entry.isIntersecting) {
            setCurrentIndex(index);
            const playPromise = videoElement.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => setIsPaused(false))
                .catch(() => setIsPaused(true));
            }
          } else {
            videoElement.pause();
            videoElement.currentTime = 0;
          }
        });
      },
      { threshold: 0.7 }
    );

    setTimeout(() => {
      const slides = document.querySelectorAll('.video-slide');
      slides.forEach((slide) => {
        if (observerRef.current) {
          observerRef.current.observe(slide);
        }
      });
    }, 100);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [videos]);

  // Gestion du swipe tactile
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < videos.length - 1) {
        goToVideo(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        goToVideo(currentIndex - 1);
      }
    }
  };

  const goToVideo = (index) => {
    const container = containerRef.current;
    container.scrollTo({
      top: index * window.innerHeight,
      behavior: 'smooth',
    });
  };

  // Toggle play/pause
  const handleVideoTap = (e, index) => {
    if (e.target.closest('.action-btn') || e.target.closest('.controls-panel')) return;

    const videoElement = videosRef.current[index];
    if (!videoElement) return;

    if (videoElement.paused) {
      videoElement.play();
      setIsPaused(false);
    } else {
      videoElement.pause();
      setIsPaused(true);
    }
  };

  const handleVideoEnded = (index) => {
    if (index < videos.length - 1) {
      goToVideo(index + 1);
    }
  };

  const handleVideoError = (e, video) => {
    const videoElement = e.target;
    console.error('❌ Erreur de lecture vidéo:', {
      video: video.video_file_name || video.filename || video.id,
      src: videoElement.src,
      error: videoElement.error,
      code: videoElement.error?.code,
      message: videoElement.error?.message
    });
  };

  // Gestion du rating
  const handleRatingChange = async (videoId, newRating) => {
    setRatings(prev => ({ ...prev, [videoId]: newRating }));
    
    try {
      await playerService.saveRating({
        user_id: userId,
        video_id: videoId,
        rating: newRating,
      });
      console.log('✅ Rating sauvegardé:', newRating);
    } catch (error) {
      console.error('❌ Erreur sauvegarde rating:', error);
    }
  };

  // Gestion du status
  const handleStatusChange = async (videoId, newStatus) => {
    setStatuses(prev => ({ ...prev, [videoId]: newStatus }));
    
    try {
      await playerService.saveMemo({
        user_id: userId,
        video_id: videoId,
        statut: newStatus,
        comment: memos[videoId] || '',
      });
      console.log('✅ Status sauvegardé:', newStatus);
    } catch (error) {
      console.error('❌ Erreur sauvegarde status:', error);
    }
  };

  // Gestion du memo
  const handleMemoChange = (videoId, newMemo) => {
    setMemos(prev => ({ ...prev, [videoId]: newMemo }));
  };

  const handleSaveMemo = async (videoId) => {
    setSaving(true);
    try {
      await playerService.saveMemo({
        user_id: userId,
        video_id: videoId,
        statut: statuses[videoId] || 'no',
        comment: memos[videoId] || '',
      });
      console.log('✅ Memo sauvegardé');
    } catch (error) {
      console.error('❌ Erreur sauvegarde memo:', error);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <p className="text-white text-lg">Aucune vidéo disponible</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-y-scroll snap-y snap-mandatory bg-black scrollbar-hide"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {videos.map((video, index) => (
        <div
          key={video.id}
          data-index={index}
          className="video-slide relative w-screen h-screen snap-start snap-always flex items-center justify-center"
          onClick={(e) => handleVideoTap(e, index)}
        >
          {/* Vidéo */}
          <video
            ref={(el) => {
              if (el) {
                videosRef.current[index] = el;
                console.log(`🎥 Vidéo ${index + 1} référencée:`, video.video_url);
              }
            }}
            className="absolute inset-0 w-full h-full object-cover"
            src={video.video_url || ''}
            playsInline
            loop
            preload={index <= currentIndex + 1 ? 'auto' : 'metadata'}
            crossOrigin="anonymous"
            onLoadStart={() => console.log(`🔄 Chargement vidéo ${index + 1}:`, video.video_url)}
            onLoadedData={() => console.log(`✅ Vidéo ${index + 1} chargée`)}
            onEnded={() => handleVideoEnded(index)}
            onError={(e) => handleVideoError(e, video)}
            onPlay={() => console.log(`▶️ Vidéo ${index + 1} en lecture`)}
            onPause={() => console.log(`⏸️ Vidéo ${index + 1} en pause`)}
          />

          {/* Indicateur pause */}
          {isPaused && currentIndex === index && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

          {/* Informations vidéo */}
          <div className="absolute bottom-0 left-0 right-0 p-4 pb-safe z-10 pointer-events-none">
            <div className="pr-16">
              <h3 className="text-white text-base font-semibold leading-tight mb-2 line-clamp-2">
                {video.title}
              </h3>
              {video.author && (
                <p className="text-white/90 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                    {video.author.charAt(0).toUpperCase()}
                  </span>
                  {video.author}
                </p>
              )}
              {video.description && (
                <p className="text-white/80 text-xs mt-2 line-clamp-2">
                  {video.description}
                </p>
              )}
            </div>
          </div>

          {/* Bouton pour afficher les contrôles (rating/memo) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowControls(!showControls);
            }}
            className="action-btn absolute right-3 top-20 w-14 h-14 rounded-full bg-purple-600/90 backdrop-blur-md flex items-center justify-center pointer-events-auto active:scale-90 transition-transform z-50 shadow-lg hover:bg-purple-700"
          >
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H8v-4h4v4zm0-6H8V7h4v4zm6 6h-4v-4h4v4zm0-6h-4V7h4v4z"/>
            </svg>
          </button>

          {/* Panneau de contrôles (Rating + Memo) */}
          {showControls && currentIndex === index && (
            <div 
              className="controls-panel absolute right-3 top-36 w-80 max-h-[60vh] overflow-y-auto bg-black/90 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-4 pointer-events-auto z-50 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-semibold">Évaluation</h4>
                <button
                  onClick={() => setShowControls(false)}
                  className="text-white/60 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>

              {/* Rating Selector */}
              <div className="mb-6">
                <RatingSelector
                  initialRating={ratings[video.id] || 0}
                  initialStatus={statuses[video.id] || 'no'}
                  onRatingChange={(rating) => handleRatingChange(video.id, rating)}
                  onStatusChange={(status) => handleStatusChange(video.id, status)}
                />
              </div>

              {/* Selector Memo */}
              <div className="mb-4">
                <SelectorMemo
                  initialMemo={memos[video.id] || ''}
                  onMemoChange={(memo) => handleMemoChange(video.id, memo)}
                />
              </div>

              {/* Bouton de sauvegarde */}
              <button
                onClick={() => handleSaveMemo(video.id)}
                disabled={saving}
                className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
              >
                {saving ? 'Sauvegarde...' : 'Enregistrer le memo'}
              </button>
            </div>
          )}

          {/* Indicateur de progression */}
          <div className="absolute top-4 left-4 right-20 flex items-center justify-between z-10">
            <div className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full">
              <span className="text-white text-xs font-semibold">
                {index + 1} / {videos.length}
              </span>
            </div>
            {!showControls && (
              <div className="px-3 py-1.5 bg-purple-600/70 backdrop-blur-md rounded-full flex items-center gap-2 animate-pulse">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="text-white text-xs font-semibold">Noter la vidéo</span>
              </div>
            )}
          </div>

          {/* Barre de progression vidéo */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/20 z-10">
            <div 
              className="h-full bg-white transition-all duration-100"
              style={{ 
                width: videosRef.current[index] 
                  ? `${(videosRef.current[index].currentTime / videosRef.current[index].duration) * 100}%` 
                  : '0%' 
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Player;
