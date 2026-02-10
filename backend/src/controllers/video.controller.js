import { normalizeTags, upsertTags } from "../models/tag.model.js";
import { addTagsToVideo } from "../models/video.model.js";
import { createStills } from "../models/image.model.js";
import { createVideo } from "../models/video.model.js";
import pool from "../config/db.js";

export const uploadVideo = async (req, res) => {

  // tags = tableau de tags, le reste c'est body dla request
  const { tags = [], title} = req.body;
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
    // creation de la video
    const video = await createVideo(
      title, 
      video_file_name,
      srt_file_name,
      cover
    );

    // on recup l'id de la vidéo crée, on va la renvoyer dans la response
    const videoId = video.insertId;

    // les stills sont un tableau avec les noms des fichiers stills et leur ordre
    const stills = [
      // si l'index 0, 1 2 existe, on les ajoute au tableau 
      { file_name: stillsFiles[0]?.filename, sort_order: 1 },
      { file_name: stillsFiles[1]?.filename, sort_order: 2 },
      { file_name: stillsFiles[2]?.filename, sort_order: 3 },
      // on filtre les stills qui ont un nom de fichier
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
        tags: newTags,
        srt_file_name
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