import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { subCategoryService } from "./subCategoryService";
import { RootState } from "../store";

interface SubCategory {
    id?: string;
    name: string;
    images?: string;
    description?: string;
    categoryId?: string;
    createdAt?: string;
}

interface SubCategoryState {
    subCategories: SubCategory[];
    selectedSubCategory?: SubCategory | null;
    loading: boolean;
    error: string | null;
}

const initialState: SubCategoryState = {
    subCategories: [],
    selectedSubCategory: null,
    loading: false,
    error: null,
};

// Thunks
export const fetchSubCategories = createAsyncThunk("subCategories/fetchAll", async (_, thunkAPI) => {
    try {
        return await subCategoryService.fetchSubCategories();
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch subcategories");
    }
});

export const fetchSubCategoryById = createAsyncThunk("subCategories/fetchById", async (id: string, thunkAPI) => {
    try {
        return await subCategoryService.fetchSubCategoryById(id);
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch subcategory");
    }
});

export const createSubCategory = createAsyncThunk(
    "subCategories/create",
    async (data: { name: string; images?: string; description?: string; categoryId: string }, thunkAPI) => {
        try {
            return await subCategoryService.createSubCategory(data);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to create subcategory");
        }
    }
);

export const updateSubCategory = createAsyncThunk(
    "subCategories/update",
    async ({ id, data }: { id: string; data: Partial<SubCategory> }, thunkAPI) => {
        try {
            return await subCategoryService.updateSubCategory(id, data);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update subcategory");
        }
    }
);

export const deleteSubCategory = createAsyncThunk("subCategories/delete", async (id: string, thunkAPI) => {
    try {
        return await subCategoryService.deleteSubCategory(id);
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete subcategory");
    }
});

const subCategorySlice = createSlice({
    name: "subCategories",
    initialState,
    reducers: {
        clearSelectedSubCategory: (state) => {
            state.selectedSubCategory = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubCategories.fulfilled, (state, action: PayloadAction<SubCategory[]>) => {
                state.loading = false;
                state.subCategories = action.payload;
            })
            .addCase(fetchSubCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchSubCategoryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubCategoryById.fulfilled, (state, action: PayloadAction<SubCategory>) => {
                state.loading = false;
                state.selectedSubCategory = action.payload;
            })
            .addCase(fetchSubCategoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createSubCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSubCategory.fulfilled, (state, action: PayloadAction<SubCategory>) => {
                state.loading = false;
                state.subCategories.push(action.payload);
            })
            .addCase(createSubCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateSubCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSubCategory.fulfilled, (state, action: PayloadAction<SubCategory>) => {
                state.loading = false;
                state.subCategories = state.subCategories.map((subCat) =>
                    subCat.id === action.payload.id ? action.payload : subCat
                );
            })
            .addCase(updateSubCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteSubCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSubCategory.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.subCategories = state.subCategories.filter((subCat) => subCat.id !== action.payload);
            })
            .addCase(deleteSubCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const selectSubCategories = (state: RootState) => state.subCategory.subCategories

export const { clearSelectedSubCategory } = subCategorySlice.actions;
export default subCategorySlice.reducer;
