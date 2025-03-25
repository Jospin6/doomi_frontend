import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialStateProps {
    loading: boolean
    user: any
    users: any
    error: string
}


const initialState = {

}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {}
})

export default userSlice.reducer