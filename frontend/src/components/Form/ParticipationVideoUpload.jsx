import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ParticipationVideoUpload = ({setEtape, formData, setFormData: setFormDataProp}) => {
  const navigate = useNavigate();

  // États locaux pour les previews (URLs temporaires)
  const [previews, setPreviews] = useState({
    coverImage: null,
    still1: null,
    still2: null,
    still3: null,
  });

  // États locaux pour les loaders
  const [loading, setLoading] = useState({
    coverImage: false,
    still1: false,
    still2: false,
    still3: false,
  });

  // États locaux pour les erreurs
  const [errors, setErrors] = useState({
    coverImage: null,
    still1: null,
    still2: null,
    still3: null,
  });

  /**
   * Validation d'un fichier image
   */
  const validateImage = (file, fieldName) => {
    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      return 'Please select a valid image file';
    }

    // Vérifier la taille
    const maxSize = fieldName === 'coverImage' ? 15 * 1024 * 1024 : 5 * 1024 * 1024; // 15MB pour cover, 5MB pour stills
    if (file.size > maxSize) {
      const maxSizeMB = fieldName === 'coverImage' ? 15 : 5;
      return `File too large. Max: ${maxSizeMB}MB`;
    }

    return null; // Valide
  };

  /**
   * Gestion de la sélection de fichier image
   */
  const handleImageChange = (e, fieldName) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Révoquer l'ancienne URL si elle existe
    if (previews[fieldName]) {
      URL.revokeObjectURL(previews[fieldName]);
    }

    // Valider le fichier
    const error = validateImage(file, fieldName);
    
    if (error) {
      // Afficher l'erreur
      setErrors(prev => ({ ...prev, [fieldName]: error }));
      setPreviews(prev => ({ ...prev, [fieldName]: null }));
      setFormDataProp({ ...formData, [fieldName]: null });
      return;
    }

    // Fichier valide
    setErrors(prev => ({ ...prev, [fieldName]: null }));
    setLoading(prev => ({ ...prev, [fieldName]: true }));

    // Créer URL de preview
    const objectUrl = URL.createObjectURL(file);
    
    // Simuler un léger délai pour montrer le loader (optionnel)
    setTimeout(() => {
      setPreviews(prev => ({ ...prev, [fieldName]: objectUrl }));
      setLoading(prev => ({ ...prev, [fieldName]: false }));
    }, 200);

    // Stocker le fichier dans formData
    setFormDataProp({ ...formData, [fieldName]: file });
  };

  /**
   * Gestion des autres champs (non-images)
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setFormDataProp({
      ...formData,
      [name]: fieldValue
    });
  };

  /**
   * Gestion des fichiers non-images (video, subtitle)
   */
  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    
    setFormDataProp({
      ...formData,
      [name]: file || null
    });
  };

  /**
   * Cleanup des URLs au démontage du composant
   */
  useEffect(() => {
    return () => {
      // Révoquer toutes les URLs créées
      Object.values(previews).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, []);

  /**
   * Cleanup d'une URL spécifique quand elle change
   */
  useEffect(() => {
    const currentPreviews = previews;
    return () => {
      Object.entries(currentPreviews).forEach(([key, url]) => {
        if (url && url !== previews[key]) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previews]);

  return (
    <div className="border border-white/10 bg-[#050505] rounded-xl p-2 text-center">
      <h2 className="p-2">Video Upload</h2>
      
      <div className="text-center flex flex-raw space-between justify-center gap-2">
        <div className="border rounded-xl w-5">
          1
        </div>
        <div className="border rounded-xl w-5">
          2
        </div>
        <div className="border rounded-xl w-5 bg-purple-500">
          3
        </div>
      </div>

      <section className="FormContainer">
        <form method="post" className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 justify-items-center m-5 gap-5">

          {/* YouTube URL */}
          <div className="w-60">
            <label className="block text-sm mb-2">YouTube URL</label>
            <input 
              className="bg-black/50 border rounded-xl p-2 w-60"
              type="text"
              name="youtubeUrl"
              id="youtubeUrl"
              value={formData.youtubeUrl}
              onChange={handleChange}
              placeholder="YouTube URL"
            />
          </div>

          {/* Video Upload */}
          <div className="w-60">
            <label className="block text-sm mb-2">Upload Video</label>
            <input 
              className="bg-black/50 border rounded-xl p-2 w-60 text-sm"
              type="file"
              accept=".MOV,.MPEG4,.MP4,.AVI,.WMV,.MPEGPS,.FLV,.3GPP,.WebM"
              name="videoFile"
              id="videoFile"
              onChange={handleFileChange}
            />
            <p className="text-gray-400 text-xs mt-1">Video duration will be displayed here</p>
          </div>

          {/* Cover Image */}
          <div className="w-60">
            <label className="block text-sm mb-2">Cover Image (max 15MB)</label>
            <div className="border border-gray-500 rounded-xl h-48 mb-2 flex items-center justify-center bg-black/30 overflow-hidden">
              {loading.coverImage ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  <span className="text-gray-500 text-xs">Loading...</span>
                </div>
              ) : errors.coverImage ? (
                <div className="flex flex-col items-center gap-2 px-4 text-center">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-red-500 text-xs">{errors.coverImage}</span>
                </div>
              ) : previews.coverImage ? (
                <img 
                  src={previews.coverImage} 
                  alt="Cover preview" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-gray-500 text-xs">Preview</span>
              )}
            </div>
            <input 
              className="bg-black/50 border rounded-xl p-2 w-60 text-sm"
              type="file"
              accept="image/*"
              name="coverImage"
              id="coverImage"
              onChange={(e) => handleImageChange(e, 'coverImage')}
            />
          </div>

          {/* Still 1 */}
          <div className="w-60">
            <label className="block text-sm mb-2">Still 1 (max 5MB)</label>
            <div className="border border-gray-500 rounded-xl h-48 mb-2 flex items-center justify-center bg-black/30 overflow-hidden">
              {loading.still1 ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  <span className="text-gray-500 text-xs">Loading...</span>
                </div>
              ) : errors.still1 ? (
                <div className="flex flex-col items-center gap-2 px-4 text-center">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-red-500 text-xs">{errors.still1}</span>
                </div>
              ) : previews.still1 ? (
                <img 
                  src={previews.still1} 
                  alt="Still 1 preview" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-gray-500 text-xs">Preview</span>
              )}
            </div>
            <input 
              className="bg-black/50 border rounded-xl p-2 w-60 text-sm"
              type="file"
              accept="image/*"
              name="still1"
              id="still1"
              onChange={(e) => handleImageChange(e, 'still1')}
            />
          </div>
          
          {/* Still 2 */}
          <div className="w-60">
            <label className="block text-sm mb-2">Still 2 (max 5MB)</label>
            <div className="border border-gray-500 rounded-xl h-48 mb-2 flex items-center justify-center bg-black/30 overflow-hidden">
              {loading.still2 ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  <span className="text-gray-500 text-xs">Loading...</span>
                </div>
              ) : errors.still2 ? (
                <div className="flex flex-col items-center gap-2 px-4 text-center">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-red-500 text-xs">{errors.still2}</span>
                </div>
              ) : previews.still2 ? (
                <img 
                  src={previews.still2} 
                  alt="Still 2 preview" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-gray-500 text-xs">Preview</span>
              )}
            </div>
            <input 
              className="bg-black/50 border rounded-xl p-2 w-60 text-sm"
              type="file"
              accept="image/*"
              name="still2"
              id="still2"
              onChange={(e) => handleImageChange(e, 'still2')}
            />
          </div>
          
          {/* Still 3 */}
          <div className="w-60">
            <label className="block text-sm mb-2">Still 3 (max 5MB)</label>
            <div className="border border-gray-500 rounded-xl h-48 mb-2 flex items-center justify-center bg-black/30 overflow-hidden">
              {loading.still3 ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  <span className="text-gray-500 text-xs">Loading...</span>
                </div>
              ) : errors.still3 ? (
                <div className="flex flex-col items-center gap-2 px-4 text-center">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-red-500 text-xs">{errors.still3}</span>
                </div>
              ) : previews.still3 ? (
                <img 
                  src={previews.still3} 
                  alt="Still 3 preview" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-gray-500 text-xs">Preview</span>
              )}
            </div>
            <input 
              className="bg-black/50 border rounded-xl p-2 w-60 text-sm"
              type="file"
              accept="image/*"
              name="still3"
              id="still3"
              onChange={(e) => handleImageChange(e, 'still3')}
            />
          </div>

          {/* Subtitle Upload */}
          <div className="w-60">
            <label className="block text-sm mb-2">Subtitle File (.srt)</label>
            <input 
              className="bg-black/50 border rounded-xl p-2 w-60 text-sm"
              type="file"
              accept=".srt"
              name="subtitle"
              id="subtitle"
              onChange={handleFileChange}
            />
          </div>

          {/* Copyright Section */}
          <div className="w-full max-w-2xl mt-4">
            <label className="flex items-center gap-2 mb-3 justify-center">
              <input 
                type="checkbox"
                name="rightsAccepted"
                id="rightsAccepted"
                checked={formData.rightsAccepted}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm">Rights accepted*</span>
            </label>
            <div className="border border-red-500 rounded-xl p-4 text-sm text-gray-300 bg-black/20">
              <p>
                *By submitting this video, you confirm that you hold all necessary rights to the content provided and authorize MarsAI to broadcast,
                reproduce, and use this video, in whole or in part, in its communications media, without limitation in terms of duration or territory.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 m-5 p-1 place-self-center">
            <button
              type="button"
              onClick={() => setEtape(2)}
              className="bg-gray-700 hover:bg-gray-600 border rounded-xl p-2 px-8 transition-colors">
              Back
            </button>
            <button
              type="submit"
              className="bg-linear-to-r from-purple-700 to-pink-500 border rounded-xl p-2 px-8">
              Submit
            </button>
          </div>

        </form>
      </section>

    </div>
  );
};

export default ParticipationVideoUpload;