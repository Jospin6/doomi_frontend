import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { categoryService } from "./categoryService";

interface Category {
    id: string;
    name: string;
    image: string;
    description?: string;
    createdAt: string;
}

interface CategoryState {
    categories: Category[];
    selectedCategory?: Category | null;
    loading: boolean;
    error: string | null;
}

const initialState: CategoryState = {
    categories: [],
    selectedCategory: null,
    loading: false,
    error: null,
};

// Thunks
export const fetchCategories = createAsyncThunk("categories/fetchAll", async (_, thunkAPI) => {
    try {
        return await categoryService.fetchCategories();
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch categories");
    }
});

export const fetchCategoryById = createAsyncThunk("categories/fetchById", async (id: string, thunkAPI) => {
    try {
        return await categoryService.fetchCategoryById(id);
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch category");
    }
});

export const createCategory = createAsyncThunk(
    "categories/create",
    async (data: { name: string; image: string; description?: string }, thunkAPI) => {
        try {
            return await categoryService.createCategory(data);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to create category");
        }
    }
);

export const updateCategory = createAsyncThunk(
    "categories/update",
    async ({ id, data }: { id: string; data: Partial<Category> }, thunkAPI) => {
        try {
            return await categoryService.updateCategory(id, data);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update category");
        }
    }
);

export const deleteCategory = createAsyncThunk("categories/delete", async (id: string, thunkAPI) => {
    try {
        return await categoryService.deleteCategory(id);
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete category");
    }
});

const categorySlice = createSlice({
    name: "categories",
    initialState,
    reducers: {
        clearSelectedCategory: (state) => {
            state.selectedCategory = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchCategoryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategoryById.fulfilled, (state, action: PayloadAction<Category>) => {
                state.loading = false;
                state.selectedCategory = action.payload;
            })
            .addCase(fetchCategoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCategory.fulfilled, (state, action: PayloadAction<Category>) => {
                state.loading = false;
                state.categories.push(action.payload);
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
                state.loading = false;
                state.categories = state.categories.map((cat) =>
                    cat.id === action.payload.id ? action.payload : cat
                );
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.categories = state.categories.filter((cat) => cat.id !== action.payload);
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;
