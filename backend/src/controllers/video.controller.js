import { validateYoutubeVideo } from "../utils/youtube.util.js";
import { normalizeTags, upsertTags } from "../models/tag.model.js";
import { addTagsToVideo } from "../models/video.model.js";
import { createStills } from "../models/image.model.js";
import { createVideo } from "../models/video.model.js";
import pool from "../config/db.js";

export const uploadVideo = async (req, res) => {

  // tags = tableau de tags, le reste c'est body dla request
  const { tags = [], title, youtube_url } = req.body;

  const videoFiles = req.files?.video?.[0];
  const coverFile = req.files?.cover?.[0];
  const stillsFiles = req.files?.stills;

  try {

    // normalisation des tags(trim, lowercase)
    const cleanTags = normalizeTags(tags);

    // ionsersation des tags qui n'existent pas en bdd
    const newTags = await upsertTags(cleanTags, pool)
    // validation de l'url youtube
    if (!validateYoutubeVideo(youtube_url)) {
      return res.status(400).json({
        success: false,
        message: "Youtube url not valid",
        error: "Youtube url not valid"
      });
    }

    const video_file_name = videoFiles.filename;
    const cover = coverFile?.filename;

    // creation de la video
    const video = await createVideo(
      title, 
      youtube_url,
      video_file_name,
      cover
    );

    // on recup l'id de la vidéo crée, on va la renvoyer dans la response
    const videoId = video.insertId;

    // les stills sont un tableau avec 
    const stills = [
      { file_name: stillsFiles[0]?.filename, sort_order: 1 },
      { file_name: stillsFiles[1]?.filename, sort_order: 2 },
      { file_name: stillsFiles[2]?.filename, sort_order: 3 },
    ].filter(still => still.file_name);

    // creation des stills, on passe l'id de la video et les stills qui sont dans un tableau et groupé dans l'ordre
    await createStills(videoId, stills);

    // on recup les ids des tags qui ont été crées
    const tagIds = newTags.map(t => t.id);

    // ajout les tags a la vidéo
    await addTagsToVideo(videoId, tagIds);
    
    return res.status(201).json({
      success:true,
      message: "video uploaded successfully",
      data: {
        video: videoId,
        stills,
        tags: newTags
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