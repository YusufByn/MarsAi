import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { API_URL } from "../../../config";

/* Formate une date au format jj/mm/aaaa*/
const formatDDMMYYYY = (date) =>
  new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);

const Countdown = () => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phaseDate, setPhaseDate] = useState(null);
  const hasFetched = useRef(false);

  /* Fetch uniquement au chargement, récupère la date de phase une seule fois*/
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchHomepage = async () => {
      try {
        const response = await fetch(`${API_URL}/api/cms/homepage`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log("[COUNTDOWN] homepage data:", data);

        if (data.success && data.countdown?.phaseDate) {
          setPhaseDate(new Date(data.countdown.phaseDate));
        } else {
          setPhaseDate(null);
        }
      } catch (error) {
        console.error("[COUNTDOWN] Error fetching homepage:", error);
        setPhaseDate(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepage();
  }, []);

  /* Calcul automatique coté client, Mise à jour toutes les secondes sans refaire d'appel API */
  useEffect(() => {
    if (!phaseDate) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = phaseDate - now;

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        expired: false,
      };
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [phaseDate]);

  /* Si le fetch n'est pas terminé ou si aucune date n'est disponible, on n'affiche rien */
  if (loading || !timeLeft) {
    return null;
  }

  /* Données du countdown regroupées dans un tableau pour simplifier l'affichage responsive*/
  const items = [
    {
      key: "days",
      value: String(timeLeft.days || 0).padStart(2, "0"),
      label: t("countdown.days"),
      gradient: false,
    },
    {
      key: "hours",
      value: String(timeLeft.hours || 0).padStart(2, "0"),
      label: t("countdown.hours"),
      gradient: false,
    },
    {
      key: "minutes",
      value: String(timeLeft.minutes || 0).padStart(2, "0"),
      label: t("countdown.minutes"),
      gradient: false,
    },
    {
      key: "seconds",
      value: String(timeLeft.seconds || 0).padStart(2, "0"),
      label: t("countdown.seconds"),
      gradient: true,
    },
  ];

  /* Séparation des blocs =>
    - days seul
    - hours / minutes / seconds ensemble
    our le layout mobile */
  const daysItem = items.find((item) => item.key === "days");
  const timeItems = items.filter((item) => item.key !== "days");

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 mb-10 md:mb-16 w-full px-4">
      {/* Ligne texte au-dessus du countdown*/}
      <div className="text-center max-w-[320px] sm:max-w-full">
        <span className="text-[11px] sm:text-xs md:text-sm font-black tracking-[0.08em] sm:tracking-[0.25em] text-mars-primary uppercase leading-snug">
          {t("countdown.expectedImpact")}
        </span>
      </div>

      {/* Mobile =>
          - heures / minutes / secondes sur une ligne
          - jours en dessous */}
      <div className="sm:hidden flex flex-col items-center gap-4 w-full">
        <div className="grid grid-cols-3 gap-3 w-full max-w-[320px]">
          {timeItems.map((item) => (
            <div
              key={item.key}
              className="flex flex-col items-center text-center"
            >
              <span
                className={`text-4xl font-black tracking-tight leading-none ${
                  item.gradient ? "mars-text-gradient" : "text-white"
                }`}
              >
                {item.value}
              </span>

              <span className="text-[10px] font-bold tracking-[0.12em] text-white/30 uppercase mt-2">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {daysItem && (
          <div className="flex flex-col items-center text-center">
            <span className="text-5xl font-black tracking-tight leading-none text-white">
              {daysItem.value}
            </span>

            <span className="text-[10px] font-bold tracking-[0.12em] text-white/30 uppercase mt-2">
              {daysItem.label}
            </span>
          </div>
        )}
      </div>

      {/*Tablette / desktop => les 4 blocs sur une seule ligne */}
      <div className="hidden sm:grid grid-cols-4 gap-x-6 md:gap-x-8 w-full max-w-3xl">
        {items.map((item) => (
          <div key={item.key} className="flex flex-col items-center text-center">
            <span
              className={`text-6xl md:text-8xl font-black tracking-tight leading-none ${
                item.gradient ? "mars-text-gradient" : "text-white"
              }`}
            >
              {item.value}
            </span>

            <span className="text-xs font-bold tracking-[0.2em] text-white/20 uppercase mt-2">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Date affiché pour le countdown */}
      {phaseDate && (
        <div className="mt-1 text-center text-white/60 text-sm md:text-base px-2">
          <span className="font-semibold text-white/70">
            {t("countdown.deadlineLabel", {
              defaultValue: "Fin des soumissions :",
            })}
          </span>{" "}
          {formatDDMMYYYY(phaseDate)}
        </div>
      )}
    </div>
  );
};

export default Countdown;