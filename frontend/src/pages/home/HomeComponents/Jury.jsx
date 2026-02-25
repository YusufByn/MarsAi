import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AvatarGroup,
  AvatarGroupTooltip,
} from '@/components/animate-ui/components/animate/avatar-group';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { juryService } from '../../../services/juryService';

export default function Jury() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [jurors, setJurors] = useState([]);

  useEffect(() => {
    juryService.getAll()
      .then((response) => setJurors(response.data ?? []))
      .catch((err) => console.error('[JURY] Erreur lors du chargement du jury:', err));
  }, []);

  return (
    <section className="relative px-6 py-10 md:py-16 overflow-hidden">
      {/* Glow léger */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[500px] bg-mars-primary/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header section */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            {t('home.jury.title', { defaultValue: 'The international jury' })}
          </h2>
        </div>

        {jurors.length > 0 && (
          <div className="flex justify-center mb-10">
            <AvatarGroup>
              {jurors.map((jury) => (
                <Avatar
                  key={jury.id}
                  className="size-16 border-2 border-black cursor-pointer"
                  onClick={() => navigate(`/jury/profil/${jury.id}`)}
                >
                  <AvatarImage src={jury.illustration} alt={`${jury.name} ${jury.lastname}`} />
                  <AvatarFallback className="bg-mars-primary/20 text-white text-sm font-black">
                    {jury.name?.[0]}{jury.lastname?.[0]}
                  </AvatarFallback>
                  <AvatarGroupTooltip>
                    {jury.name} {jury.lastname}
                  </AvatarGroupTooltip>
                </Avatar>
              ))}
            </AvatarGroup>
          </div>
        )}

        {/* CTA */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/jury')}
            className="mars-button-outline"
          >
            {t('home.jury.viewAll', { defaultValue: 'Voir le jury complet' })}
          </button>
        </div>
      </div>
    </section>
  );
}
