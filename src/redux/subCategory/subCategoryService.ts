import axios from "axios";

const API_URL = "/api/subcategories"; // Assurez-vous que l'URL est correcte

export const subCategoryService = {
    async fetchSubCategories() {
        const response = await axios.get(API_URL);
        return response.data;
    },

    async fetchSubCategoryById(id: string) {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    async createSubCategory(data: { name: string; images: string[]; description?: string; categoryId: string }) {
        const response = await axios.post(API_URL, data);
        return response.data;
    },

    async updateSubCategory(id: string, data: { name?: string; images?: string[]; description?: string }) {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    },

    async deleteSubCategory(id: string) {
        await axios.delete(`${API_URL}/${id}`);
        return id;
    },
};
