import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { favoriteService } from "./favoriteService";

interface Favorite {
    id: string;
    userId: string;
    listingId: string;
    createdAt: string;
}

interface FavoriteState {
    favorites: Favorite[];
    loading: boolean;
    error: string | null;
}

const initialState: FavoriteState = {
    favorites: [],
    loading: false,
    error: null,
};

// Thunks
export const fetchFavorites = createAsyncThunk(
    "favorites/fetchAll",
    async (userId: string, thunkAPI) => {
        try {
            return await favoriteService.fetchFavorites(userId);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch favorites");
        }
    }
);

export const addFavorite = createAsyncThunk(
    "favorites/add",
    async ({ userId, listingId }: { userId: string; listingId: string }, thunkAPI) => {
        try {
            return await favoriteService.addFavorite(userId, listingId);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to add favorite");
        }
    }
);

export const removeFavorite = createAsyncThunk(
    "favorites/remove",
    async (id: string, thunkAPI) => {
        try {
            return await favoriteService.removeFavorite(id);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to remove favorite");
        }
    }
);

const favoriteSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavorites.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFavorites.fulfilled, (state, action: PayloadAction<Favorite[]>) => {
                state.loading = false;
                state.favorites = action.payload;
            })
            .addCase(fetchFavorites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addFavorite.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addFavorite.fulfilled, (state, action: PayloadAction<Favorite>) => {
                state.loading = false;
                state.favorites.push(action.payload);
            })
            .addCase(addFavorite.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(removeFavorite.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFavorite.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.favorites = state.favorites.filter((fav) => fav.id !== action.payload);
            })
            .addCase(removeFavorite.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default favoriteSlice.reducer;
