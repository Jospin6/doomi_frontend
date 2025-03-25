import axios from "axios";

const API_URL = "/api/categories"; // Assurez-vous que l'URL est correcte

export const categoryService = {
    async fetchCategories() {
        const response = await axios.get(API_URL);
        return response.data;
    },

    async fetchCategoryById(id: string) {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    async createCategory(data: { name: string; image: string; description?: string }) {
        const response = await axios.post(API_URL, data);
        return response.data;
    },

    async updateCategory(id: string, data: { name?: string; image?: string; description?: string }) {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    },

    async deleteCategory(id: string) {
        await axios.delete(`${API_URL}/${id}`);
        return id;
    },
};
