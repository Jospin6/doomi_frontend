import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { baseUrl } from "@/helpers/constants";

// Types
interface Boost {
  id: string;
  listingId: string;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "INACTIVE"; // Assuming BoostStatus enum values
  amountPaid: number;
  boostType: "STANDARD" | "PREMIUM"; // Assuming BoostType enum values
}

interface BoostState {
  boosts: Boost[];
  loading: boolean;
  error: string | null;
}

// **Initial State**
const initialState: BoostState = {
  boosts: [],
  loading: false,
  error: null,
};

// **Create Async Thunks**

export const fetchBoosts = createAsyncThunk<Boost[], string>(
  "boosts/fetch",
  async (listingId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}/boost/${listingId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch boosts");
    }
  }
);

export const createBoost = createAsyncThunk<Boost, Partial<Boost>>(
  "boosts/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}/boost`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create boost");
    }
  }
);

export const updateBoost = createAsyncThunk<Boost, { id: string; data: Partial<Boost> }>(
  "boosts/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${baseUrl}/boost/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update boost");
    }
  }
);

export const deleteBoost = createAsyncThunk<string, string>(
  "boosts/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${baseUrl}/boost/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete boost");
    }
  }
);

// **Slice Definition**
const boostSlice = createSlice({
  name: "boosts",
  initialState,
  reducers: {
    clearBoosts: (state) => {
      state.boosts = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoosts.fulfilled, (state, action: PayloadAction<Boost[]>) => {
        state.loading = false;
        state.boosts = action.payload;
      })
      .addCase(fetchBoosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createBoost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBoost.fulfilled, (state, action: PayloadAction<Boost>) => {
        state.loading = false;
        state.boosts.push(action.payload);
      })
      .addCase(createBoost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBoost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBoost.fulfilled, (state, action: PayloadAction<Boost>) => {
        state.loading = false;
        const index = state.boosts.findIndex((boost) => boost.id === action.payload.id);
        if (index !== -1) {
          state.boosts[index] = action.payload;
        }
      })
      .addCase(updateBoost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteBoost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBoost.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.boosts = state.boosts.filter((boost) => boost.id !== action.payload);
      })
      .addCase(deleteBoost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBoosts } = boostSlice.actions;

// **Selectors**
export const selectBoosts = (state: RootState) => state.boosts.boosts;
export const selectBoostsLoading = (state: RootState) => state.boosts.loading;
export const selectBoostsError = (state: RootState) => state.boosts.error;

export default boostSlice.reducer;
