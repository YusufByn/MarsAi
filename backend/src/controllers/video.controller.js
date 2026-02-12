import { normalizeTags, upsertTags } from "../models/tag.model.js";
import { addSocialMediaToVideo, addTagsToVideo } from "../models/video.model.js";
import { createStills } from "../models/image.model.js";
import { createVideo } from "../models/video.model.js";
import { uploadVideoToYoutube } from "../services/youtube.service.js";
import pool from "../config/db.js";
import { youtube } from "googleapis/build/src/apis/youtube/index.js";

const ALLOWED_SOCIAL_PLATFORMS = new Set([
  "facebook",
  "instagram",
  "x",
  "linkedin",
  "youtube",
  "tiktok",
  "website",
]);

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

  if (!Array.isArray(parsedValue)) return [];

  return parsedValue
    .map((entry) => ({
      platform: String(entry?.platform || "").trim().toLowerCase(),
      url: String(entry?.url || "").trim(),
    }))
    .filter((entry) => entry.url && ALLOWED_SOCIAL_PLATFORMS.has(entry.platform));
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

    // upload de la video sur youtube
    // on passe le chemin du fichier video, et les metadata
    // const youtubeUpload = await uploadVideoToYoutube(videoFiles.path, {
    //   title,
    //   description: description || "",
    //   tags: cleanTags,
    //   thumbnailPath: coverFile?.path,
    //   srt_file_name: srtFile?.filename,
    //   srtLanguage: req.body.srtLanguage || 'fr',
    //   srtPath: srtFile?.path,
    //   categoryId: categoryId || "22",
    //   privacyStatus: privacyStatus || "unlisted"
    // });

    // const youtube_url = youtubeUpload.youtubeUrl;


    const video = await createVideo({
      youtube_url: null,
      video_file_name,
      srt_file_name,
      cover,
    
      // champs texte déjà existants dans ton req.body
      title: req.body.title ?? null,
      title_en: req.body.title_en ?? null,
      synopsis: req.body.synopsis ?? null,
      synopsis_en: req.body.synopsis_en ?? null,
      language: req.body.language ?? null,
      country: req.body.country ?? null,
      duration: req.body.duration ?? null,
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

    // les stills sont un tableau avec les noms des fichiers stills et leur ordre
    const stills = [
      { file_name: stillsFiles?.[0]?.filename, sort_order: 1 },
      { file_name: stillsFiles?.[1]?.filename, sort_order: 2 },
      { file_name: stillsFiles?.[2]?.filename, sort_order: 3 },
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

    return res.status(201).json({
      success:true,
      message: "video uploaded successfully",
      data: {
        video: videoId,
        youtube_url: null,
        stills,
        tags: newTags,
        social_networks: insertedSocialNetworks,
        srt_file_name,
        title: req.body.title ?? null,
        title_en: req.body.title_en ?? null,
        synopsis: req.body.synopsis ?? null,
        synopsis_en: req.body.synopsis_en ?? null,
        language: req.body.language ?? null,
        country: req.body.country ?? null,
        duration: req.body.duration ?? null,
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
        acquisition_source: req.body.acquisition_source ?? null
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