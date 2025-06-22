import { create } from 'zustand';
import axios from 'axios';

// Re-defining the Category type for the store
// In a larger app, this might live in a central types file (e.g., src/types/index.ts)
export interface Category {
  id: string;
  name: string;
  description?: string | null;
  parentId?: string | null;
  children?: Category[];
  parent?: Category | null;
}

type CategoryState = {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (categoryData: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (categoryId: string, categoryData: Partial<Omit<Category, 'id'>>) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
};

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get<Category[]>('/api/categories');
      set({ categories: response.data, isLoading: false });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to fetch categories';
      set({ error, isLoading: false });
      console.error(error);
    }
  },

  addCategory: async (categoryData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post<Category>('/api/categories', categoryData);
      set((state) => ({ 
        categories: [...state.categories, response.data], 
        isLoading: false 
      }));
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to add category';
      set({ error, isLoading: false });
      console.error(error);
      throw new Error(error); // Re-throw to be caught in the component
    }
  },

  updateCategory: async (categoryId, categoryData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put<Category>(`/api/categories/${categoryId}`, categoryData);
      set((state) => ({
        categories: state.categories.map((c) => 
          c.id === categoryId ? response.data : c
        ),
        isLoading: false,
      }));
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to update category';
      set({ error, isLoading: false });
      console.error(error);
      throw new Error(error); // Re-throw
    }
  },

  deleteCategory: async (categoryId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`/api/categories/${categoryId}`);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== categoryId),
        isLoading: false,
      }));
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to delete category';
      set({ error, isLoading: false });
      console.error(error);
      throw new Error(error); // Re-throw
    }
  },
}));
