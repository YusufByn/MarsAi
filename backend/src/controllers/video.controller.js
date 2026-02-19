import { normalizeTags, upsertTags } from "../models/tag.model.js";
import { addContributorsToVideo, addSocialMediaToVideo, addTagsToVideo } from "../models/video.model.js";
import { createStills } from "../models/image.model.js";
import { createVideo } from "../models/video.model.js";
import { uploadVideoToYoutube } from "../services/youtube.service.js";
import { getVideoDuration } from "../utils/video.util.js";
import pool from "../config/db.js";
import { sendVideoSubmissionConfirmationEmail } from "../services/email.service.js";
import { logActivity } from "../utils/activity.util.js";

// liste des plateformes sociales autorisées
const ALLOWED_SOCIAL_PLATFORMS = new Set([
  "facebook",
  "instagram",
  "x",
  "linkedin",
  "youtube",
  "tiktok",
  "website",
]);

// fonction pour parser les réseaux sociaux
const parseSocialNetworks = (rawSocialNetworks) => {
  if (!rawSocialNetworks) return [];

  let parsedValue = rawSocialNetworks;

  if (typeof parsedValue === "string") {
    try {
      parsedValue = JSON.parse(parsedValue);
    } catch (error) {
      return [];
    }
  }
// si parsedValue n'est pas un tableau, on retourne un tableau vide
  if (!Array.isArray(parsedValue)) return [];

  return parsedValue
    .map((entry) => ({
      platform: String(entry?.platform || "").trim().toLowerCase(),
      url: String(entry?.url || "").trim(),
    }))
    .filter((entry) => entry.url && ALLOWED_SOCIAL_PLATFORMS.has(entry.platform));
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const parseContributors = (rawContributors) => {
  if (!rawContributors) return [];

  let parsedValue = rawContributors;

  if (typeof parsedValue === "string") {
    try {
      parsedValue = JSON.parse(parsedValue);
    } catch (error) {
      return [];
    }
  }

  if (!Array.isArray(parsedValue)) return [];

  const seenEmails = new Set();

  // on map le tableau de contributors pour enlever les contributors qui n'ont pas de firstName, lastName, email, productionRole
  return parsedValue
    .map((entry) => {
      const gender = String(entry?.gender || "").trim().toLowerCase() || null;
      const firstName = String(entry?.firstName || "").trim();
      const lastName = String(entry?.lastName || "").trim();
      const email = String(entry?.email || "").trim().toLowerCase();
      const productionRole = String(entry?.productionRole || "").trim();

      if (!firstName || !lastName || !email || !productionRole) return null;
      if (!EMAIL_PATTERN.test(email)) return null;
      if (seenEmails.has(email)) return null;

      seenEmails.add(email);
      return { gender, firstName, lastName, email, productionRole };
    })
    .filter(Boolean);
};

export const uploadVideo = async (req, res) => {

  // tags = tableau de tags, le reste c'est body dla request
  const { tags = [], title, description, categoryId, privacyStatus} = req.body;
  // video file est egal au premier fichier video de la request s'il existe
  const videoFiles = req.files?.video?.[0];
  // cover file est egal au premier fichier cover de la request s'il existe
  const coverFile = req.files?.cover?.[0];
  // stills files est egal au tableau de fichiers stills de la request s'il existe
  const stillsFiles = req.files?.stills;
  // srt file est egal au premier fichier srt de la request s'il existe
  const srtFile = req.files?.srt?.[0];

  try {

    // normalisation des tags(trim, lowercase)
    const cleanTags = normalizeTags(tags);
    const socialNetworks = parseSocialNetworks(req.body.social_networks);
    const contributors = parseContributors(req.body.contributors);

    // ionsersation des tags qui n'existent pas en bdd
    const newTags = await upsertTags(cleanTags, pool)

    if (!videoFiles) {
      return res.status(400).json({
        success: false,
        message: "Video file is required",
        error: "Video file is required"
      });
    }

    // on recup le nom du fichier video et le nom du fichier s'il existe
    const video_file_name = videoFiles.filename;
    const cover = coverFile?.filename;
    const srt_file_name = srtFile?.filename;
    const duration = await getVideoDuration(videoFiles.path);
    console.log('coverFile', coverFile);

    // upload de la video sur youtube
    // on passe le chemin du fichier video, et les metadata
    const youtubeUpload = await uploadVideoToYoutube(videoFiles.path, {
      title,
      description: description || "",
      tags: cleanTags,
      thumbnailPath: coverFile?.path,
      srt_file_name: srtFile?.filename,
      srtLanguage: req.body.srtLanguage || 'fr',
      srtPath: srtFile?.path,
      categoryId: categoryId || "22",
      privacyStatus: privacyStatus || "unlisted"
    });

    // dans youtube upload qui utilise le service youtube, on recup l'url youtube de la video
    const youtube_url = youtubeUpload.youtubeUrl;


    // on crée la video dans la bdd
    const video = await createVideo({
      youtube_url,
      video_file_name,
      srt_file_name,
      cover,
    
      // champs texte déjà existants dans le req.body
      title: req.body.title ?? null,
      title_en: req.body.title_en ?? null,
      synopsis: req.body.synopsis ?? null,
      synopsis_en: req.body.synopsis_en ?? null,
      language: req.body.language ?? null,
      country: req.body.country ?? null,
      duration: duration ?? null,
      classification: req.body.classification ?? "hybrid",
      tech_resume: req.body.tech_resume ?? null,
      creative_resume: req.body.creative_resume ?? null,
      realisator_name: req.body.realisator_name ?? null,
      realisator_lastname: req.body.realisator_lastname ?? null,
      realisator_gender: req.body.realisator_gender ?? null,
      email: req.body.email ?? null,
      birthday: req.body.birthday ?? null,
      mobile_number: req.body.mobile_number ?? null,
      fixe_number: req.body.fixe_number ?? null,
      address: req.body.address ?? null,
      acquisition_source: req.body.acquisition_source ?? null,
      rights_accepted: req.body.rights_accepted
    });
    
    // on recup l'id de la vidéo crée, on va la renvoyer dans la response
    const videoId = video.insertId;
    let insertedContributors = [];
    let contributorsWarning = null;

    // les stills sont un tableau avec les noms des fichiers stills et leur ordre
    const stills = [
      // si stillsFiles existe, on recup l'index 0 s'il existe et le nom du fichier
      { file_name: stillsFiles?.[0]?.filename, sort_order: 1 },
      { file_name: stillsFiles?.[1]?.filename, sort_order: 2 },
      { file_name: stillsFiles?.[2]?.filename, sort_order: 3 },
      // on filtre les stills qui ont un nom de fichier
    ].filter(still => still.file_name);

    if (stills.length > 0) {
      await createStills(videoId, stills);
    }

    // on recup les ids des tags qui ont été crées
    const tagIds = newTags.map(t => t.id);
    if (tagIds.length > 0) {
      await addTagsToVideo(videoId, tagIds);
    }

    const insertedSocialNetworks = await addSocialMediaToVideo(videoId, socialNetworks);

    try {
      insertedContributors = await addContributorsToVideo(videoId, contributors);
    } catch (contributorsError) {
      contributorsWarning = "Contributors could not be saved";
      console.warn("[contributors] non-blocking error:", contributorsError?.message || contributorsError);
    }

    logActivity({ action: 'video_submit', entity: 'video', entityId: videoId, details: req.body.title ?? null, ip: req.ip });

    // Envoi email de confirmation au réalisateur (non-bloquant)
    sendVideoSubmissionConfirmationEmail({
      title: req.body.title ?? null,
      realisator_name: req.body.realisator_name ?? null,
      realisator_lastname: req.body.realisator_lastname ?? null,
      email: req.body.email ?? null
    }).catch(err => console.error('[EMAIL ERROR] Confirmation soumission video:', err.message));

    return res.status(201).json({
      success:true,
      message: "video uploaded successfully",
      data: {
        video: videoId,
        youtube_url,
        stills,
        tags: newTags,
        contributors: insertedContributors,
        warnings: contributorsWarning ? [contributorsWarning] : [],
        social_networks: insertedSocialNetworks,
        srt_file_name,
        title: video.title ?? null,
        title_en: video.title_en ?? null,
        synopsis: video.synopsis ?? null,
        synopsis_en: video.synopsis_en ?? null,
        language: video.language ?? null,
        country: video.country ?? null,
        duration: duration ?? null,
        classification: video.classification ?? "hybrid",
        tech_resume: video.tech_resume ?? null,
        creative_resume: video.creative_resume ?? null,
        realisator_name: video.realisator_name ?? null,
        realisator_lastname: video.realisator_lastname ?? null,
        realisator_gender: video.realisator_gender ?? null,
        email: video.email ?? null,
        birthday: video.birthday ?? null,
        mobile_number: video.mobile_number ?? null,
        fixe_number: video.fixe_number ?? null,
        address: video.address ?? null,
        acquisition_source: video.acquisition_source ?? null
      }
    })
    
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Error uploading video",
      error: error.message
    });
  }
}