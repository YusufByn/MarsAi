import { API_URL, authHeaders } from '../config';

const authTokenHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const parseApiError = async (response, fallbackMessage) => {
    try {
        const data = await response.json();
        if (data?.message) return data.message;
    } catch (_) {
        // no-op: fallback below
    }
    return fallbackMessage;
};

const toSponsorFormData = (sponsorData = {}) => {
    const formData = new FormData();

    if (Object.prototype.hasOwnProperty.call(sponsorData, 'name')) {
        formData.append('name', sponsorData.name ?? '');
    }
    formData.append('url', sponsorData.url ?? '');
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

    async moveTypeOrder(type, direction) {
        const response = await fetch(`${API_URL}/api/sponsors/admin/types/order`, {
            method: 'POST',
            headers: {
                ...authTokenHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type, direction }),
        });
        if (!response.ok) {
            throw new Error(await parseApiError(response, 'Erreur lors du deplacement du type'));
        }
        return response.json();
    },

};