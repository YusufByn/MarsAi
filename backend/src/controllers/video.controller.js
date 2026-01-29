import { validateYoutubeVideo } from "../utils/youtube.util.js";

export async function validateYoutubeUrl(req, res) {    

    const { youtube_url } = req.body;
    // condition pour verifier qu'une url youtube est valide
    if (!validateYoutubeVideo(youtube_url)) {
      return res.status(400).json({ 
        success: false,
        message: "Youtube url not valid",
        error: "Youtube url not valid"
      });
    }
}