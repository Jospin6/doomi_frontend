import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { listingService } from "./listingService";

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  userId: string;
  subCategoryId: string;
  locationId?: string;
  extraFields?: any;
  images: string[];
  status: string;
  createdAt: string;
}

interface ListingState {
  listings: Listing[];
  selectedListing?: Listing | null;
  loading: boolean;
  error: string | null;
}

const initialState: ListingState = {
  listings: [],
  selectedListing: null,
  loading: false,
  error: null,
};

// Thunks
export const fetchListings = createAsyncThunk("listings/fetchAll", async (_, thunkAPI) => {
  try {
    return await listingService.fetchListings();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch listings");
  }
});

export const fetchListingById = createAsyncThunk("listings/fetchById", async (id: string, thunkAPI) => {
  try {
    return await listingService.fetchListingById(id);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch listing");
  }
});

export const createListing = createAsyncThunk(
  "listings/create",
  async (
    data: {
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
    },
    thunkAPI
  ) => {
    try {
      return await listingService.createListing(data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to create listing");
    }
  }
);

export const updateListing = createAsyncThunk(
  "listings/update",
  async ({ id, data }: { id: string; data: Partial<Listing> }, thunkAPI) => {
    try {
      return await listingService.updateListing(id, data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update listing");
    }
  }
);

export const deleteListing = createAsyncThunk("listings/delete", async (id: string, thunkAPI) => {
  try {
    return await listingService.deleteListing(id);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete listing");
  }
});

const listingSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    clearSelectedListing: (state) => {
      state.selectedListing = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListings.fulfilled, (state, action: PayloadAction<Listing[]>) => {
        state.loading = false;
        state.listings = action.payload;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchListingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListingById.fulfilled, (state, action: PayloadAction<Listing>) => {
        state.loading = false;
        state.selectedListing = action.payload;
      })
      .addCase(fetchListingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createListing.fulfilled, (state, action: PayloadAction<Listing>) => {
        state.loading = false;
        state.listings.push(action.payload);
      })
      .addCase(createListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateListing.fulfilled, (state, action: PayloadAction<Listing>) => {
        state.loading = false;
        state.listings = state.listings.map((listing) =>
          listing.id === action.payload.id ? action.payload : listing
        );
      })
      .addCase(updateListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteListing.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.listings = state.listings.filter((listing) => listing.id !== action.payload);
      })
      .addCase(deleteListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedListing } = listingSlice.actions;
export default listingSlice.reducer;
