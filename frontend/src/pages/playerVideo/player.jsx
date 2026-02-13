import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ActionButtons from './selectorOption/ActionButtons';
import RatingModal from './selectorOption/RatingModal';
import QuickNotePanel from './selectorOption/QuickNotePanel';
import EmailPanel from './selectorOption/EmailPanel';
import KeyboardShortcuts from './selectorOption/KeyboardShortcuts';
import { playerService } from '../../services/playerService';

const Player = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
  const [_saving, setSaving] = useState(false);

  // États pour les notifications et feedback visuel
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [actionFeedback, setActionFeedback] = useState({ show: false, type: '' });

  const containerRef = useRef(null);
  const videosRef = useRef({});
  const touchStartY = useRef(0);
  const observerRef = useRef(null);
  const tabCountRef = useRef(0);
  const tabTimerRef = useRef(null);

  // Récupérer l'ID utilisateur réel depuis localStorage
  const [userId, setUserId] = useState(null);

  // URL du backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  // Charger l'utilisateur connecté
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      const authUser = JSON.parse(storedUser);
      setUserId(authUser.id);
      console.log('[PLAYER] User ID:', authUser.id);
    } else {
      console.log('[PLAYER] No user found in localStorage');
    }
  }, []);

  // Charger les ratings et memos existants (fonction déclarée AVANT useEffect)
  const loadRatingsAndMemos = async (videoList, userIdToUse) => {
    if (!userIdToUse) {
      console.log('[PLAYER] Cannot load ratings/memos: userId not available yet');
      return;
    }

    console.log('[PLAYER] Loading ratings/memos for user:', userIdToUse);

    try {
      const ratingsData = {};
      const memosData = {};
      const statusesData = {};

      for (const video of videoList) {
        try {
          // Charger le memo
          const memoResponse = await playerService.getMemo(video.id, userIdToUse);
          if (memoResponse?.data) {
            memosData[video.id] = memoResponse.data.comment || '';
            statusesData[video.id] = memoResponse.data.statut || 'no';
          } else {
            statusesData[video.id] = 'no';
          }

          // Charger le rating
          const ratingResponse = await playerService.getRating(video.id, userIdToUse);
          if (ratingResponse?.data?.rating) {
            ratingsData[video.id] = Number(ratingResponse.data.rating);
          }
        } catch (err) {
          console.log('[PLAYER] Error loading data for video', video.id, err.message);
          statusesData[video.id] = 'no';
        }
      }

      setRatings(ratingsData);
      setMemos(memosData);
      setStatuses(statusesData);
      console.log('[PLAYER] Loaded ratings/memos:', { ratingsData, statusesData });
    } catch (error) {
      console.error('[PLAYER ERROR] Loading ratings/memos:', error);
    }
  };

  // Récupérer les vidéos depuis le backend
  useEffect(() => {
    // Ne pas charger les vidéos tant qu'on n'a pas le userId
    if (!userId) return;

    const fetchVideos = async () => {
      try {
        console.log('[PLAYER] Fetching videos for user:', userId);
        const response = await fetch(`${API_URL}/api/player/videos?userId=${userId}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('[PLAYER ERROR] HTTP:', response.status, errorText);
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const result = await response.json();
        const videos = result.data || result;

        console.log('[PLAYER] Videos loaded:', videos.length);

        // Construire l'URL complete pour chaque video
        const videosWithFullUrl = Array.isArray(videos) ? videos.map(video => ({
          ...video,
          video_url: video.video_url
            ? `${API_URL}${video.video_url}`
            : video.video_file_name
              ? `${API_URL}/upload/${video.video_file_name}`
              : null,
          author: video.author || [video.realisator_name, video.realisator_lastname].filter(Boolean).join(' '),
          description: video.description || video.synopsis || '',
        })) : [];

        setVideos(videosWithFullUrl);

        // Charger les ratings et memos pour chaque vidéo (si userId disponible)
        if (videosWithFullUrl.length > 0 && userId) {
          await loadRatingsAndMemos(videosWithFullUrl, userId);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('[PLAYER ERROR] Loading videos:', error);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showRatingModal, showNotePanel, showEmailPanel, videos, currentIndex]);

  // Reset tab count quand on change de vidéo
  useEffect(() => {
    tabCountRef.current = 0;
    if (videos[currentIndex]) {
      console.log('[PLAYER] CurrentIndex changed to:', currentIndex, 'Video ID:', videos[currentIndex].id);
    }
  }, [currentIndex, videos]);

  // Intersection Observer pour détecter quelle vidéo est visible
  useEffect(() => {
    if (videos.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoElement = entry.target.querySelector('video');
          if (!videoElement) return;

          const index = parseInt(entry.target.dataset.index);
          const videoId = videos[index]?.id;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
            console.log('[PLAYER] Video visible - Index:', index, 'ID:', videoId);
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

  // Verifie si la video courante a un statut avant de permettre la navigation
  const canNavigate = () => {
    const currentVideoId = videos[currentIndex]?.id;
    if (!currentVideoId) return true;
    const status = statuses[currentVideoId];
    return status && status !== undefined;
  };

  // Etat pour l'indicateur "choisissez un statut"
  const [showStatusWarning, setShowStatusWarning] = useState(false);

  const showStatusRequired = () => {
    setShowStatusWarning(true);
    setTimeout(() => setShowStatusWarning(false), 2000);
  };

  // Gestion du swipe tactile
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    if (Math.abs(diff) > 50) {
      // Bloquer le swipe vers la video suivante si pas de statut
      if (diff > 0 && currentIndex < videos.length - 1) {
        if (!canNavigate()) {
          showStatusRequired();
          return;
        }
        goToVideo(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        goToVideo(currentIndex - 1);
      }
    }
  };

  const goToVideo = (index) => {
    // Bloquer la navigation vers l'avant si pas de statut sur la video courante
    if (index > currentIndex && !canNavigate()) {
      showStatusRequired();
      return;
    }
    const container = containerRef.current;
    container.scrollTo({
      top: index * window.innerHeight,
      behavior: 'smooth',
    });
  };

  // Afficher une notification avec feedback visuel
  const showNotification = (message, type = 'success') => {
    console.log('[NOTIFICATION]', message, type);

    // Afficher le feedback visuel immédiat (grande icône au centre)
    setActionFeedback({ show: true, type });

    // Afficher la notification toast
    setNotification({ show: true, message, type });

    // Masquer le feedback visuel après 800ms
    setTimeout(() => {
      setActionFeedback({ show: false, type: '' });
    }, 800);

    // Masquer la notification après 2500ms
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 2500);
  };

  // Passer à la vidéo suivante
  const goToNextVideo = () => {
    if (currentIndex < videos.length - 1) {
      setTimeout(() => {
        goToVideo(currentIndex + 1);
      }, 1000);
    } else {
      showNotification('Derniere video atteinte', 'success');
    }
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
      if (!canNavigate()) {
        showStatusRequired();
        return;
      }
      goToVideo(index + 1);
    }
  };

  const handleVideoError = (e, video) => {
    const videoElement = e.target;
    console.error('Erreur de lecture vidéo:', {
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
    console.log('[PLAYER] handleStatusClick - currentIndex:', currentIndex, 'videoId:', videoId, 'status:', newStatus);

    if (!videoId || !userId) {
      console.error('[PLAYER ERROR] Missing videoId or userId', { videoId, userId, currentIndex });
      showNotification('Erreur: utilisateur non connecte', 'error');
      return;
    }

    // Si "Oui" est cliqué, ouvrir le modal de notation
    if (newStatus === 'yes') {
      setShowRatingModal(true);
      return;
    }

    // Mettre à jour l'état immédiatement pour feedback visuel
    const oldStatus = statuses[videoId];
    setStatuses(prev => ({ ...prev, [videoId]: newStatus }));

    try {
      // Sauvegarder le memo avec playlist si "À discuter"
      await playerService.saveMemo({
        user_id: userId,
        video_id: videoId,
        statut: newStatus,
        playlist: newStatus === 'discuss' ? 1 : 0,
        comment: memos[videoId] || '',
      });

      // Si "Non", supprimer le rating existant
      if (newStatus === 'no' && ratings[videoId]) {
        await playerService.deleteRating(videoId, userId);
        setRatings(prev => {
          const next = { ...prev };
          delete next[videoId];
          return next;
        });
        console.log('[PLAYER] Rating cleared for video:', videoId);
      }

      console.log('[PLAYER] Status saved:', newStatus);

      // Afficher message de succès selon le statut
      if (newStatus === 'no') {
        showNotification('Video rejetee', 'error');
      } else if (newStatus === 'discuss') {
        showNotification('Ajoutee a discuter', 'success');
      }

      // Passer à la vidéo suivante
      goToNextVideo();
    } catch (error) {
      console.error('[PLAYER ERROR] Saving status:', error);
      showNotification('Erreur lors de la sauvegarde', 'error');
      // Remettre l'ancien statut en cas d'erreur
      setStatuses(prev => ({ ...prev, [videoId]: oldStatus || 'no' }));
    }
  };

  // Sauvegarder la notation depuis le modal
  const handleSaveRating = async (rating) => {
    const videoId = videos[currentIndex]?.id;
    if (!videoId || !userId) {
      console.error('[PLAYER ERROR] Missing videoId or userId');
      showNotification('Erreur: utilisateur non connecte', 'error');
      return;
    }

    setSaving(true);

    // Sauvegarder les anciens états
    const oldRating = ratings[videoId];
    const oldStatus = statuses[videoId];

    // Mettre à jour les états immédiatement pour feedback visuel
    setRatings(prev => ({ ...prev, [videoId]: rating }));
    setStatuses(prev => ({ ...prev, [videoId]: 'yes' }));

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
        playlist: 0,
        comment: memos[videoId] || '',
      });

      console.log('[PLAYER] Rating saved:', rating);

      // Afficher message de succès
      showNotification(`Video selectionnee avec note ${rating}/10`, 'success');

      // Passer à la vidéo suivante
      goToNextVideo();
    } catch (error) {
      console.error('[PLAYER ERROR] Saving rating:', error);
      showNotification('Erreur lors de la notation', 'error');
      // Remettre les anciens états en cas d'erreur
      setRatings(prev => ({ ...prev, [videoId]: oldRating || 0 }));
      setStatuses(prev => ({ ...prev, [videoId]: oldStatus || 'no' }));
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
    } catch (error) {
      console.error('Erreur sauvegarde note:', error);
      throw error;
    }
  };

  // Envoyer un email au réalisateur
  const handleSendEmail = async (message) => {
    const videoId = videos[currentIndex]?.id;
    if (!videoId || !userId) {
      console.error('[PLAYER ERROR] Missing videoId or userId');
      showNotification('Erreur: utilisateur non connecte', 'error');
      return;
    }

    try {
      await playerService.sendEmailToCreator({
        video_id: videoId,
        user_id: userId,
        message: message,
      });

      console.log('[PLAYER] Email sent');

      // Afficher message de succès
      showNotification('Email envoye au realisateur', 'success');

      // Passer à la vidéo suivante
      goToNextVideo();
    } catch (error) {
      console.error('[PLAYER ERROR] Sending email:', error);
      showNotification('Erreur lors de l\'envoi de l\'email', 'error');
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
        <p className="text-white text-lg">{t('player.noVideos')}</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 snap-y snap-mandatory bg-black scrollbar-hide ${
        canNavigate() ? 'overflow-y-scroll' : 'overflow-hidden'
      }`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* Bouton retour à la page selector - Desktop: centré en haut, Mobile: en haut à gauche */}
      <button
        onClick={() => navigate('/selector')}
        className="fixed top-6 left-6 md:left-1/2 md:-translate-x-1/2 z-[60] flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/70 transition-all shadow-2xl border border-white/10 hover:scale-105 active:scale-95"
        title="Retour au profil sélecteur"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="hidden md:inline text-white text-sm font-semibold">Mon Profil Selector</span>
      </button>

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
              }
            }}
            className="absolute inset-0 w-full h-full object-cover"
            src={video.video_url || ''}
            playsInline
            loop
            preload={index <= currentIndex + 1 ? 'auto' : 'metadata'}
            crossOrigin="anonymous"
            onEnded={() => handleVideoEnded(index)}
            onError={(e) => handleVideoError(e, video)}
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
                  {statuses[video.id] === 'yes' ? t('player.selected') :
                   statuses[video.id] === 'discuss' ? t('player.toReview') :
                   t('player.notSelected')}
                </span>
                {ratings[video.id] > 0 && statuses[video.id] === 'yes' && (
                  <span className="text-white text-xs font-bold">
                    {ratings[video.id]}/10
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Boutons d'action dans le slide */}
          <ActionButtons
            key={`actions-${video.id}-${index}`}
            currentStatus={statuses[video.id] || 'no'}
            rating={ratings[video.id] || 0}
            onStatusClick={handleStatusClick}
            onNoteClick={() => setShowNotePanel(true)}
            onEmailClick={() => setShowEmailPanel(true)}
          />

          {/* Barre de progression video */}
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

      {/* Aide raccourcis clavier (global) */}
      <KeyboardShortcuts />

      {/* Indicateur "choisissez un statut" */}
      {showStatusWarning && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[70] animate-bounce">
          <div className="px-6 py-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-2xl">
            <span className="text-black text-sm font-bold">Choisissez un statut pour continuer</span>
          </div>
        </div>
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

      {/* Feedback visuel central - Grande icône au centre */}
      {actionFeedback.show && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center pointer-events-none">
          <div className={`transform transition-all duration-500 ease-out ${
            actionFeedback.show ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}>
            <div className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl ${
              actionFeedback.type === 'success'
                ? 'bg-green-500'
                : actionFeedback.type === 'error'
                ? 'bg-red-500'
                : 'bg-amber-500'
            }`}>
              {actionFeedback.type === 'success' ? (
                <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast en haut */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[70] transition-all duration-300 ${
        notification.show ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'
      }`}>
        <div className={`px-6 py-4 rounded-2xl backdrop-blur-md shadow-2xl border-2 ${
          notification.type === 'success'
            ? 'bg-green-500/95 border-green-400 text-white'
            : 'bg-red-500/95 border-red-400 text-white'
        }`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? (
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span className="text-base font-bold">{notification.message}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
