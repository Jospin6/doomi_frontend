import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { baseUrl } from "@/helpers/constants";

interface Subscription {
  id: string;
  userId: string;
  plan: string; // or the actual type of the SubscriptionPlan enum
  status: "ACTIVE" | "INACTIVE"; // Assuming enum values
  expiresAt: string;
  createdAt: string;
}

interface SubscriptionState {
  subscription: Subscription | null;
  loading: boolean;
  error: string | null;
}

// **Initial State**
const initialState: SubscriptionState = {
  subscription: null,
  loading: false,
  error: null,
};

// **Create Async Thunks**

export const fetchSubscription = createAsyncThunk<Subscription, string>(
  "subscription/fetch",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}/subscription/${userId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch subscription");
    }
  }
);

export const createSubscription = createAsyncThunk<Subscription, Partial<Subscription>>(
  "subscription/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}/subscription`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create subscription");
    }
  }
);

export const updateSubscription = createAsyncThunk<Subscription, { id: string; data: Partial<Subscription> }>(
  "subscription/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${baseUrl}/subscription/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update subscription");
    }
  }
);

export const deleteSubscription = createAsyncThunk<string, string>(
  "subscription/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${baseUrl}/subscription/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete subscription");
    }
  }
);

// **Slice Definition**
const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    clearSubscription: (state) => {
      state.subscription = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscription.fulfilled, (state, action: PayloadAction<Subscription>) => {
        state.loading = false;
        state.subscription = action.payload;
      })
      .addCase(fetchSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubscription.fulfilled, (state, action: PayloadAction<Subscription>) => {
        state.loading = false;
        state.subscription = action.payload;
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubscription.fulfilled, (state, action: PayloadAction<Subscription>) => {
        state.loading = false;
        state.subscription = action.payload;
      })
      .addCase(updateSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubscription.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.subscription = null;
      })
      .addCase(deleteSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSubscription } = subscriptionSlice.actions;

// **Selectors**
export const selectSubscription = (state: RootState) => state.subscription.subscription;
export const selectSubscriptionLoading = (state: RootState) => state.subscription.loading;
export const selectSubscriptionError = (state: RootState) => state.subscription.error;

export default subscriptionSlice.reducer;
