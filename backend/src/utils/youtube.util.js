// fonction pour extraire l'id d'une vidéo youtube je mets un param url
function extractVideoId(url) {
    // je verifie si l'url est valide et si c'est une string
    if (!url || typeof url !== 'string'){
        return null;
    }

    // je verifie si l'url est une url courte
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch?.[1]){
        return shortMatch[1];
    }

    // je verifie si l'url est une url de watch
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch?.[1]){
        return watchMatch[1];
    }

    // je verifie si l'url est une url de embed
    const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch?.[1]){
        return embedMatch[1];
    }

    // je verifie si l'url est une url de shorts
    const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch?.[1]){
        return shortsMatch[1];
    }

    // je verifie si l'url est une url de v
    const vMatch = url.match(/youtube\.com\/v\/([a-zA-Z0-9_-]{11})/);
    if (vMatch?.[1]){
        return vMatch[1];
    }

    // si aucune id trouvé, je renvoie null
    return null;
}

// fonction pour verifier qu'une url est valide
function validateYoutubeVideo(url) {
    // j'appelle la fonction extractVideoId pour extraire l'id de la vidéo
    const videoId = extractVideoId(url);
    // je verifie si l'id est valide; s'il respect le format 11 carac
    return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
}

// j'exporte les fonctions
export default { extractVideoId, validateYoutubeVideo };