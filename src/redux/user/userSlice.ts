import { baseUrl } from "@/helpers/constants";
import { User } from "@/helpers/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface initialStateProps {
    loading: boolean
    user: User | null
    users: User[]
    error: string
}

const initialState: initialStateProps = {
    loading: false,
    user: null,
    users: [],
    error: ""
}

export const fetchUser = createAsyncThunk(
    "user/fetchUser", async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`${baseUrl}/user/${id}`)
            if (!response.ok) {
                throw new Error("Server error")
            }
            const data = await response.json()
            return data
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }) 

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUser.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = false
            state.user = action.payload
        })
        builder.addCase(fetchUser.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })
    }
})

export const selectUser = ((state: RootState) => state.user.user)

export default userSlice.reducer