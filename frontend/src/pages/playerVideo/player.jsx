import { useState, useEffect, useRef } from 'react';
import ActionButtons from './selectorOption/ActionButtons';
import RatingModal from './selectorOption/RatingModal';
import QuickNotePanel from './selectorOption/QuickNotePanel';
import EmailPanel from './selectorOption/EmailPanel';
import KeyboardShortcuts from './selectorOption/KeyboardShortcuts';
import { playerService } from '../../services/playerService';

const Player = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  
  // États pour les modals/panels
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showNotePanel, setShowNotePanel] = useState(false);
  const [showEmailPanel, setShowEmailPanel] = useState(false);
  
  // États pour rating et memo
  const [ratings, setRatings] = useState({});
  const [memos, setMemos] = useState({});
  const [statuses, setStatuses] = useState({});
  const [saving, setSaving] = useState(false);
  
  const containerRef = useRef(null);
  const videosRef = useRef({});
  const touchStartY = useRef(0);
  const observerRef = useRef(null);
  const tabCountRef = useRef(0);
  const tabTimerRef = useRef(null);
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

  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignorer si un modal/panel est ouvert ou si on tape dans un input/textarea
      if (
        showRatingModal || 
        showNotePanel || 
        showEmailPanel ||
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA'
      ) {
        return;
      }

      switch(e.key.toLowerCase()) {
        case 'y': // Y = Oui
        case 'o': // O = Oui (pour clavier FR)
          e.preventDefault();
          handleStatusClick('yes');
          break;

        case 'delete':
        case 'backspace': // Suppr/Effacer = Non
          e.preventDefault();
          handleStatusClick('no');
          break;

        case 'arrowright': // Flèche droite = À discuter
          e.preventDefault();
          handleStatusClick('discuss');
          break;

        case 'tab': // Compteur de Tab
          e.preventDefault();
          tabCountRef.current += 1;
          
          // Reset après 1 seconde
          if (tabTimerRef.current) {
            clearTimeout(tabTimerRef.current);
          }
          tabTimerRef.current = setTimeout(() => {
            tabCountRef.current = 0;
          }, 1000);
          break;

        case 'enter':
          e.preventDefault();
          // 1 Tab + Enter = Note rapide
          if (tabCountRef.current === 1) {
            setShowNotePanel(true);
            tabCountRef.current = 0;
          } 
          // 2 Tabs + Enter = Email
          else if (tabCountRef.current === 2) {
            setShowEmailPanel(true);
            tabCountRef.current = 0;
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (tabTimerRef.current) {
        clearTimeout(tabTimerRef.current);
      }
    };
  }, [showRatingModal, showNotePanel, showEmailPanel, videos, currentIndex]);

  // Reset tab count quand on change de vidéo
  useEffect(() => {
    tabCountRef.current = 0;
  }, [currentIndex]);

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

  // Gestion du clic sur les boutons de statut
  const handleStatusClick = async (newStatus) => {
    const videoId = videos[currentIndex]?.id;
    if (!videoId) return;

    // Si "Oui" est cliqué, ouvrir le modal de notation
    if (newStatus === 'yes') {
      setShowRatingModal(true);
      return;
    }

    // Sinon, sauvegarder directement le statut
    setStatuses(prev => ({ ...prev, [videoId]: newStatus }));
    
    try {
      // Si "À discuter", ajouter à la playlist
      if (newStatus === 'discuss') {
        await playerService.togglePlaylist(videoId, userId, true);
      }
      
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

  // Sauvegarder la notation depuis le modal
  const handleSaveRating = async (rating) => {
    const videoId = videos[currentIndex]?.id;
    if (!videoId) return;

    setSaving(true);
    try {
      // Sauvegarder le rating
      await playerService.saveRating({
        user_id: userId,
        video_id: videoId,
        rating: rating,
      });

      // Sauvegarder le statut "yes"
      await playerService.saveMemo({
        user_id: userId,
        video_id: videoId,
        statut: 'yes',
        comment: memos[videoId] || '',
      });

      // Mettre à jour les états locaux
      setRatings(prev => ({ ...prev, [videoId]: rating }));
      setStatuses(prev => ({ ...prev, [videoId]: 'yes' }));

      console.log('✅ Notation sauvegardée:', rating);
    } catch (error) {
      console.error('❌ Erreur sauvegarde notation:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  // Sauvegarder la note rapide
  const handleSaveQuickNote = async (note) => {
    const videoId = videos[currentIndex]?.id;
    if (!videoId) return;

    try {
      await playerService.saveMemo({
        user_id: userId,
        video_id: videoId,
        statut: statuses[videoId] || 'no',
        comment: note,
      });

      setMemos(prev => ({ ...prev, [videoId]: note }));
      console.log('✅ Note rapide sauvegardée');
    } catch (error) {
      console.error('❌ Erreur sauvegarde note:', error);
      throw error;
    }
  };

  // Envoyer un email au réalisateur
  const handleSendEmail = async (message) => {
    const videoId = videos[currentIndex]?.id;
    if (!videoId) return;

    try {
      await playerService.sendEmailToCreator({
        video_id: videoId,
        user_id: userId,
        message: message,
      });
      console.log('✅ Email envoyé');
    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
      throw error;
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


          {/* Indicateur de progression et statut */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full">
              <span className="text-white text-xs font-semibold">
                {index + 1} / {videos.length}
              </span>
            </div>
            
            {/* Badge statut de la vidéo */}
            {statuses[video.id] && statuses[video.id] !== 'no' && (
              <div className={`px-3 py-1.5 backdrop-blur-md rounded-full flex items-center gap-2 ${
                statuses[video.id] === 'yes' ? 'bg-green-500/70' :
                statuses[video.id] === 'discuss' ? 'bg-amber-500/70' :
                'bg-red-500/70'
              }`}>
                <span className="text-white text-xs font-semibold">
                  {statuses[video.id] === 'yes' ? 'Selectionne' :
                   statuses[video.id] === 'discuss' ? 'A revoir' :
                   'Non retenu'}
                </span>
                {ratings[video.id] > 0 && statuses[video.id] === 'yes' && (
                  <span className="text-white text-xs font-bold">
                    {ratings[video.id]}/10
                  </span>
                )}
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

      {/* Boutons d'action flottants style Tinder */}
      {videos.length > 0 && (
        <>
          <ActionButtons
            currentStatus={statuses[videos[currentIndex]?.id] || 'no'}
            rating={ratings[videos[currentIndex]?.id] || 0}
            onStatusClick={handleStatusClick}
            onNoteClick={() => setShowNotePanel(true)}
            onEmailClick={() => setShowEmailPanel(true)}
          />
          
          {/* Aide raccourcis clavier */}
          <KeyboardShortcuts />
        </>
      )}

      {/* Modal de notation */}
      {videos.length > 0 && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          videoData={{
            title: videos[currentIndex]?.title,
            author: videos[currentIndex]?.author,
          }}
          initialRating={ratings[videos[currentIndex]?.id] || 0}
          onSave={handleSaveRating}
        />
      )}

      {/* Panel note rapide */}
      {videos.length > 0 && (
        <QuickNotePanel
          isOpen={showNotePanel}
          onClose={() => setShowNotePanel(false)}
          videoData={{
            title: videos[currentIndex]?.title,
            author: videos[currentIndex]?.author,
          }}
          initialNote={memos[videos[currentIndex]?.id] || ''}
          onSave={handleSaveQuickNote}
        />
      )}

      {/* Panel email */}
      {videos.length > 0 && (
        <EmailPanel
          isOpen={showEmailPanel}
          onClose={() => setShowEmailPanel(false)}
          videoData={{
            title: videos[currentIndex]?.title,
            author: videos[currentIndex]?.author,
            email: videos[currentIndex]?.email,
          }}
          onSend={handleSendEmail}
        />
      )}
    </div>
  );
};

export default Player;
