import axios from "axios";
import {Listing} from "./listingSlice"

const API_URL = "/api/listings"; // Assurez-vous que l'URL est correcte

interface ListingService {
    fetchListings(): Promise<any>;
    fetchListingById(id: string): Promise<any>;
    createListing(data: {
        title: string;
        description: string;
        price: number;
        currency: string;
        userId: string;
        subCategoryId: string;
        locationId?: string;
        extraFields?: any;
        images: string[];
        status?: string;
    }): Promise<any>;
    updateListing(id: string, data:Partial<Listing>): Promise<any>;
    deleteListing(id: string): Promise<string>;
}

export const listingService: ListingService = {
    async fetchListings() {
        const response = await axios.get(API_URL);
        return response.data;
    },

    async fetchListingById(id: string) {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    async createListing(data: {
        title: string;
        description: string;
        price: number;
        currency: string;
        userId: string;
        subCategoryId: string;
        locationId?: string;
        extraFields?: any;
        images: string[];
        status?: string;
    }) {
        const response = await axios.post(API_URL, data);
        return response.data;
    },

    async updateListing(id: string, data: Partial<Listing>): Promise<Listing> {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    },

    async deleteListing(id: string) {
        await axios.delete(`${API_URL}/${id}`);
        return id;
    },
};
