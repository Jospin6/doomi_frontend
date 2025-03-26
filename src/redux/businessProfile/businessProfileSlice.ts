import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

interface BusinessProfile {
  id: string;
  userId: string;
  vatNumber?: string;
  website?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BusinessProfileState {
  profile: BusinessProfile | null;
  loading: boolean;
  error: string | null;
}

// **Initial State**
const initialState: BusinessProfileState = {
  profile: null,
  loading: false,
  error: null,
};

// **Create Async Thunks**

export const fetchBusinessProfile = createAsyncThunk<BusinessProfile, string>(
  "businessProfile/fetch",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/business-profile/${userId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch business profile");
    }
  }
);

export const createBusinessProfile = createAsyncThunk<BusinessProfile, Partial<BusinessProfile>>(
  "businessProfile/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/business-profile`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create business profile");
    }
  }
);

export const updateBusinessProfile = createAsyncThunk<BusinessProfile, { id: string; data: Partial<BusinessProfile> }>(
  "businessProfile/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/business-profile/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update business profile");
    }
  }
);

export const deleteBusinessProfile = createAsyncThunk<string, string>(
  "businessProfile/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/business-profile/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete business profile");
    }
  }
);

// **Slice Definition**
const businessProfileSlice = createSlice({
  name: "businessProfile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinessProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessProfile.fulfilled, (state, action: PayloadAction<BusinessProfile>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchBusinessProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createBusinessProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBusinessProfile.fulfilled, (state, action: PayloadAction<BusinessProfile>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(createBusinessProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBusinessProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBusinessProfile.fulfilled, (state, action: PayloadAction<BusinessProfile>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateBusinessProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteBusinessProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBusinessProfile.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.profile = null;
      })
      .addCase(deleteBusinessProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProfile } = businessProfileSlice.actions;

// **Selectors**
export const selectBusinessProfile = (state: RootState) => state.businessProfile.profile;
export const selectBusinessProfileLoading = (state: RootState) => state.businessProfile.loading;
export const selectBusinessProfileError = (state: RootState) => state.businessProfile.error;

export default businessProfileSlice.reducer;
