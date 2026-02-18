import { API_URL, authHeaders } from '../config';

const authTokenHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const toSponsorFormData = (sponsorData = {}) => {
    const formData = new FormData();

    formData.append('name', sponsorData.name ?? '');
    formData.append('url', sponsorData.url ?? '');
    formData.append('section', sponsorData.section ?? 'general');
    formData.append('sort_order', sponsorData.sort_order ?? 0);
    formData.append('is_active', sponsorData.is_active ?? 1);

    if (typeof sponsorData.img === 'string') {
        formData.append('img', sponsorData.img);
    }

    if (sponsorData.cover instanceof File) {
        formData.append('cover', sponsorData.cover);
    }

    return formData;
};

export const sponsorsService = {
    async getAll() {
        const response = await fetch(`${API_URL}/api/sponsors`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des sponsors');
        }
        return response.json();
    },

    async getById(id) {
        const response = await fetch(`${API_URL}/api/sponsors/${id}`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération du sponsor');
        }
        return response.json();
    },

    async getAllAdmin() {
        const response = await fetch(`${API_URL}/api/sponsors/admin/all`, {
            method: 'POST',
            headers: authTokenHeaders(),
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des sponsors (admin)');
        }
        return response.json();
    },

    async create(sponsorData) {
        const response = await fetch(`${API_URL}/api/sponsors`, {
            method: 'POST',
            headers: authTokenHeaders(),
            body: toSponsorFormData(sponsorData),
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la création du sponsor');
        }
        return response.json();
    },
    
    async update(id, sponsorData) {
        const response = await fetch(`${API_URL}/api/sponsors/${id}`, {
            method: 'PUT',
            headers: authTokenHeaders(),
            body: toSponsorFormData(sponsorData),
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour du sponsor');
        }
        return response.json();
    },
    
    async delete(id) {
        const response = await fetch(`${API_URL}/api/sponsors/${id}`, {
            method: 'DELETE',
            headers: authHeaders(),
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du sponsor');
        }
        return response.json();
    },

    async setVisibility(id, isActive) {
        const response = await fetch(`${API_URL}/api/sponsors/${id}/visibility`, {
            method: 'POST',
            headers: {
                ...authTokenHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ is_active: isActive }),
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour de la visibilité');
        }
        return response.json();
    },

    async moveOrder(id, direction) {
        const response = await fetch(`${API_URL}/api/sponsors/${id}/order`, {
            method: 'POST',
            headers: {
                ...authTokenHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ direction }),
        });
        if (!response.ok) {
            throw new Error("Erreur lors du deplacement de l'ordre");
        }
        return response.json();
    },

    async getSections() {
        const response = await fetch(`${API_URL}/api/sponsors/admin/sections`, {
            method: 'POST',
            headers: authTokenHeaders(),
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des sections');
        }
        return response.json();
    },

    async moveSection(section, direction) {
        const response = await fetch(`${API_URL}/api/sponsors/admin/sections/order`, {
            method: 'POST',
            headers: {
                ...authTokenHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ section, direction }),
        });
        if (!response.ok) {
            throw new Error('Erreur lors du deplacement de la section');
        }
        return response.json();
    },

    async renameSection(oldSection, newSection) {
        const response = await fetch(`${API_URL}/api/sponsors/admin/sections/rename`, {
            method: 'POST',
            headers: {
                ...authTokenHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ old_section: oldSection, new_section: newSection }),
        });
        if (!response.ok) {
            throw new Error('Erreur lors du renommage de la section');
        }
        return response.json();
    },

    async deleteSection(section, targetSection = 'general') {
        const response = await fetch(`${API_URL}/api/sponsors/admin/sections/delete`, {
            method: 'POST',
            headers: {
                ...authTokenHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ section, target_section: targetSection }),
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression de la section');
        }
        return response.json();
    },
};