import { create } from 'zustand';
import axios from 'axios';
import { Category } from './useCategoryStore'; // Assuming this export exists

// Define related types for a Product
export interface ProductImage {
  id: string;
  url: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stockQuantity: number;
  sku: string;
  weight?: number | null;
  height?: number | null;
  width?: number | null;
  depth?: number | null;
  images: ProductImage[];
  category: Category;
  categoryId: string;
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the type for the data used to create a product
// This matches the Zod schema in ProductForm
export type ProductCreationData = {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  sku: string;
  stockQuantity: number;
  weight?: number;
  images: string[];
};

type ProductState = {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (productData: ProductCreationData) => Promise<Product | undefined>;
  // Future actions can be added here, e.g.:
  // updateProduct: (productId: string, productData: Partial<ProductCreationData>) => Promise<void>;
  // deleteProduct: (productId: string) => Promise<void>;
};

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get<Product[]>('/api/products');
      set({ products: response.data, isLoading: false });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to fetch products';
      set({ error, isLoading: false });
      console.error(error);
    }
  },

  addProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post<Product>('/api/products', productData);
      const newProduct = response.data;
      set((state) => ({
        products: [...state.products, newProduct],
        isLoading: false,
      }));
      return newProduct;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to add product';
      set({ error, isLoading: false });
      console.error(error);
      throw new Error(error); // Re-throw to be caught in the component
    }
  },
}));
