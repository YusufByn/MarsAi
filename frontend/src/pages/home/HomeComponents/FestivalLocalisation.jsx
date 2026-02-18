import React from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Train, Bus, Info } from "lucide-react";

export default function FestivalLocalisation() {
    const { t } = useTranslation();

    // URL d'intégration Google Maps centrée sur Marseille (à ajuster selon la localisation exacte du festival)
    const MAP_EMBED_URL = "https://www.google.com/maps?q=Marseille&output=embed";

    // Données de localisation et transport (à personnaliser selon les informations réelles du festival)
    const venue = {
        name: t("home.location.venueName", { defaultValue: "Festival Venue" }),
        addressLine1: t("home.location.address1", { defaultValue: "Marseille, France" }),
        addressLine2: t("home.location.address2", { defaultValue: "Adresse complète à préciser" }),

        // Liste des options de transport pour se rendre au festival
        transport: [
            {
            icon: <Train size={18} />,
            title: t("home.location.transport.train", { defaultValue: "Metro / Train" }),
            desc: t("home.location.transport.trainDesc", {
                defaultValue: "Arrêt le plus proche : à définir (ex: Métro M1).",
            }),
            },
            {
            icon: <Bus size={18} />,
            title: t("home.location.transport.bus", { defaultValue: "Bus" }),
            desc: t("home.location.transport.busDesc", {
                defaultValue: "Lignes : à définir (ex: 49, 52).",
            }),
            },
            {
            icon: <Info size={18} />,
            title: t("home.location.transport.info", { defaultValue: "Tips" }),
            desc: t("home.location.transport.infoDesc", {
                defaultValue: "Prévoir 10 min à pied depuis l’arrêt.",
            }),
            },
        ],
    };

    return (
        <section className="relative px-6 py-16 md:py-24 overflow-hidden">
            {/* Glow léger */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[500px] bg-mars-primary/5 blur-[140px] rounded-full pointer-events-none" />

            {/* Card moins large*/}
            <div className="relative max-w-5xl mx-auto">
                {/* Header section */}
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/40">
                        {t("home.location.kicker", { defaultValue: "Location" })}
                    </p>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mt-3">
                        {t("home.location.title", { defaultValue: "Festival localisation" })}
                    </h2>
                </div>

                {/* Card principale*/}
                <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-3">
                        {/* Grid 2/3 à gauche (map) + info à droite (1/3) */}
                        <div className="lg:col-span-2">
                            <div className="relative w-full aspect-[16/10] lg:aspect-auto lg:h-full bg-black/40">
                                <iframe
                                    title="Festival Location"
                                    src={MAP_EMBED_URL}
                                    className="absolute inset-0 w-full h-full"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    allowFullScreen
                                />
                            </div>
                        </div>

                        {/* Infos = 1/3 */}
                        <aside className="lg:col-span-1 p-6 md:p-8 border-t lg:border-t-0 lg:border-l border-white/10">
                            {/* Nom + adresse */}
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                                    <MapPin size={18} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-lg font-black tracking-tight">{venue.name}</h3>
                                    <p className="text-sm text-white/60 mt-2">
                                        {venue.addressLine1}
                                    <br />
                                        {venue.addressLine2}
                                    </p>
                                </div>
                            </div>

                            {/* Accès / Transports */}
                            <div className="mt-8 space-y-4">
                                <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/40">
                                    {t("home.location.accessTitle", { defaultValue: "How to get there" })}
                                </p>

                                {/* On génère les transports depuis le tableau */}
                                {venue.transport.map((item) => (
                                    <div
                                        key={item.title}
                                        className="rounded-2xl border border-white/10 bg-black/30 p-4 hover:border-white/20 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">{item.title}</p>
                                                <p className="text-xs text-white/50 mt-1">{item.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Lien pour ouvrir la carte dans un nouvel onglet */}
                            <div className="mt-8">
                                <a
                                    href={MAP_EMBED_URL.replace("&output=embed", "")}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-bold text-white/70 hover:text-white transition-colors"
                                >
                                    {t("home.location.openMap", { defaultValue: "Open in Google Maps" })}
                                    <span className="text-white/30">↗</span>
                                </a>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </section>
    );
}
