import axios from "axios";

const API_URL = "/api/favorites"; // Assurez-vous que l'URL est correcte

export const favoriteService = {
  async fetchFavorites(userId: string) {
    const response = await axios.get(`${API_URL}?userId=${userId}`);
    return response.data;
  },

  async addFavorite(userId: string, listingId: string) {
    const response = await axios.post(API_URL, { userId, listingId });
    return response.data;
  },

  async removeFavorite(id: string) {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  },
};
