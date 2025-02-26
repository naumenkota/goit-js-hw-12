import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const params = {
    key: '48985421-1c318736e0b6dddab9dd61498',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
};
export async function fetchImages(query, page, limit) {
    try {
        const response = await axios.get(BASE_URL, {
            params: { ...params, q: query, page, per_page: limit, },
        });
            return {
            hits: response.data.hits,
            totalHits: response.data.totalHits,
        };      
    }
        catch (error) {
            console.error('Error fetching images:', error);
            return { hits: [], totalHits: 0 };
        }
    };