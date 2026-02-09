import React, { useState } from 'react';

const ParticipationContributorsData = ({ contributorsData, setContributorsData, onSave }) => {
  // contributorsData devrait être un tableau
  const contributors = Array.isArray(contributorsData) ? contributorsData : [];
  
  const [showForm, setShowForm] = useState(false);
  const [currentContributor, setCurrentContributor] = useState({
    gender: '',
    firstName: '',
    lastName: '',
    email: '',
    productionRole: ''
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentContributor({
      ...currentContributor,
      [name]: value
    });
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateContributor = () => {
    const newErrors = {};
    
    if (!currentContributor.gender) newErrors.gender = 'Le genre est requis';
    if (!currentContributor.firstName?.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!currentContributor.lastName?.trim()) newErrors.lastName = 'Le nom est requis';
    if (!currentContributor.email?.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentContributor.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!currentContributor.productionRole?.trim()) newErrors.productionRole = 'Le rôle est requis';

    return newErrors;
  };

  const addContributor = () => {
    const newErrors = validateContributor();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Ajouter le contributeur à la liste
    const updatedContributors = [...contributors, { 
      ...currentContributor, 
      id: Date.now() // ID temporaire
    }];
    setContributorsData(updatedContributors);
    
    // Réinitialiser le formulaire
    setCurrentContributor({
      gender: '',
      firstName: '',
      lastName: '',
      email: '',
      productionRole: ''
    });
    setErrors({});
    setShowForm(false);
    setGlobalError('');
  };

  const removeContributor = (id) => {
    const updatedContributors = contributors.filter(c => c.id !== id);
    setContributorsData(updatedContributors);
  };

  const cancelAdd = () => {
    setCurrentContributor({
      gender: '',
      firstName: '',
      lastName: '',
      email: '',
      productionRole: ''
    });
    setErrors({});
    setShowForm(false);
  };

  const handleSave = () => {
    if (contributors.length === 0) {
      setGlobalError('Vous devez ajouter au moins un contributeur');
      return;
    }
    setGlobalError('');
    onSave();
  };

  const getGenderIcon = (gender) => {
    switch(gender) {
      case 'women': return '👩';
      case 'man': return '👨';
      case 'other': return '🧑';
      default: return '👤';
    }
  };

  const getGenderLabel = (gender) => {
    switch(gender) {
      case 'women': return 'Femme';
      case 'man': return 'Homme';
      case 'other': return 'Autre';
      default: return '';
    }
  };

  return (
    <div className="text-center">
      <div className="mb-4">
        <h2 className="p-2 text-xl font-bold text-white">Contributeurs</h2>
        <p className="text-gray-400 text-xs">Ajoutez tous les contributeurs du projet</p>
      </div>

      {globalError && (
        <div className="mb-3 p-2 bg-red-500/20 border border-red-500 rounded-xl text-red-500 text-xs w-60 mx-auto">
          {globalError}
        </div>
      )}

      <section className="FormContributors">
        {/* Liste des contributeurs ajoutés */}
        {contributors.length > 0 && (
          <div className="mb-4">
            <h3 className="text-md font-semibold text-white mb-2">
              Contributeurs ajoutés ({contributors.length})
            </h3>
            <div className="grid grid-cols-1 gap-2 justify-items-center">
              {contributors.map((contributor, index) => (
                <div 
                  key={contributor.id} 
                  className="w-full max-w-xs bg-linear-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-3 relative hover:border-purple-500/50 transition-all text-left"
                >
                  {/* Bouton supprimer */}
                  <button
                    type="button"
                    onClick={() => removeContributor(contributor.id)}
                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-red-500/20 hover:bg-red-500/40 rounded-lg transition-colors text-red-400 hover:text-red-300"
                    title="Supprimer"
                  >
                    ✕
                  </button>

                  <div className="flex items-start gap-3">
                    <div className="text-2xl">
                      {getGenderIcon(contributor.gender)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-sm">
                        {contributor.firstName} {contributor.lastName}
                      </h4>
                      <p className="text-purple-300 text-xs font-medium mb-1">
                        {contributor.productionRole}
                      </p>
                      <div className="space-y-0.5">
                        <p className="text-gray-400 text-[10px]">
                          📧 {contributor.email}
                        </p>
                        <p className="text-gray-400 text-[10px]">
                          {getGenderLabel(contributor.gender)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bouton pour afficher le formulaire */}
        {!showForm && (
          <div className="flex justify-center my-2">
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="w-60 bg-purple-600/20 hover:bg-purple-600/30 border-2 border-dashed border-purple-500/50 hover:border-purple-500 rounded-xl p-3 text-purple-300 hover:text-purple-200 transition-all flex items-center justify-center gap-2 font-medium text-sm"
            >
              <span className="text-xl">+</span>
              Ajouter
            </button>
          </div>
        )}

        {/* Formulaire d'ajout */}
        {showForm && (
          <div className="grid grid-cols-1 justify-items-center m-2 gap-3">
            <h3 className="text-md font-semibold text-white">Nouveau contributeur</h3>
            
              {/* Gender */}
              <div className="w-60">
                <select 
                  name="gender"
                  value={currentContributor.gender}
                  onChange={handleChange}
                  className={`bg-black/50 border rounded-xl p-2 w-60 text-white text-sm ${errors.gender ? 'border-red-500' : 'border-white/10'}`}
                >
                  <option value="">Sélectionnez le genre</option>
                  <option value="women">Femme</option>
                  <option value="man">Homme</option>
                  <option value="other">Autre</option>
                </select>
                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
              </div>

              {/* First Name */}
              <div className="w-60">
                <input 
                  className={`bg-black/50 border rounded-xl p-2 w-60 text-white text-sm ${errors.firstName ? 'border-red-500' : 'border-white/10'}`}
                  type="text"
                  name="firstName"
                  value={currentContributor.firstName}
                  onChange={handleChange}
                  placeholder="Prénom"
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div className="w-60">
                <input 
                  className={`bg-black/50 border rounded-xl p-2 w-60 text-white text-sm ${errors.lastName ? 'border-red-500' : 'border-white/10'}`}
                  type="text"
                  name="lastName"
                  value={currentContributor.lastName}
                  onChange={handleChange}
                  placeholder="Nom"
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>

              {/* Email */}
              <div className="w-60">
                <input 
                  className={`bg-black/50 border rounded-xl p-2 w-60 text-white text-sm ${errors.email ? 'border-red-500' : 'border-white/10'}`}
                  type="email"
                  name="email"
                  value={currentContributor.email}
                  onChange={handleChange}
                  placeholder="email@exemple.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Production Role */}
              <div className="w-60">
                <input
                  className={`bg-black/50 border rounded-xl p-2 w-60 text-white text-sm ${errors.productionRole ? 'border-red-500' : 'border-white/10'}`}
                  type="text"
                  name="productionRole"
                  value={currentContributor.productionRole}
                  onChange={handleChange}
                  placeholder="Rôle (ex: Réalisateur)"
                />
                {errors.productionRole && <p className="text-red-500 text-xs mt-1">{errors.productionRole}</p>}
              </div>

              {/* Boutons Actions Formulaire */}
              <div className="flex gap-2 mt-1 w-60">
                <button
                  type="button"
                  onClick={cancelAdd}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 rounded-xl p-1.5 text-sm transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={addContributor}
                  className="flex-1 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 rounded-xl p-1.5 text-sm transition-all font-medium"
                >
                  Ajouter
                </button>
              </div>
          </div>
        )}

        {/* Bouton de sauvegarde final */}
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={handleSave}
            className="bg-linear-to-r from-purple-500 to-pink-500 text-white border rounded-xl p-2 px-6 hover:from-purple-600 hover:to-pink-400 transition-all font-semibold text-sm"
          >
            Enregistrer et continuer
          </button>
        </div>
      </section>
    </div>
  );
};

export default ParticipationContributorsData;
