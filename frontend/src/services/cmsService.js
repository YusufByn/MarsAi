const API_URL = import.meta.env.VITE_API_URL;


export async function getAllCmsElements() {

    try {
        const response = await fetch(`${API_URL}/cms`);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return data;

    } catch (error) {

        console.error('CMS Service Error:', error);

        throw error;
    }
}

export async function updateCmsElement(sectionType, data) {

    try {
        const response = await fetch(`${API_URL}/cms/${sectionType}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('CMS Service Error:', error);
    }
}
