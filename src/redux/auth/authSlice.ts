import { City } from "@/helpers/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

interface initialStateProps {
    acoountType: "PERSONAL" | "BUSINESS" | null
}

const initialState: initialStateProps = {
    acoountType: null,
}

export interface signupDataProps {
    name: string,
    password: string,
    email: string,
    profileType: "PERSONAL" | "BUSINESS",
    locationId: string
}

interface signinDataProps {
    password: string,
    email: string,
}

export const signup = createAsyncThunk("auth/signup", async (signupData: signupDataProps) => {
    try {
        const response = await axios.post("http://localhost:4000/auth/signup", signupData)
        return response.data
    } catch (error: any) {
        throw new Error("Error: ", error)
    }
})

export const signin = createAsyncThunk("auth/signin", async (signinData: signinDataProps) => {
    try {
        const response = await axios.post("http://localhost:4000/auth/signin", signinData)
        return response.data
    } catch (error: any) {
        throw new Error("Error: ", error)
    }
})

export const signout = createAsyncThunk("", () => { })

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAcoountType: (state, action: PayloadAction<any>) => {
            state.acoountType = action.payload
        }
    }
})

export const selectAcoountType = (state: RootState) => state.auth.acoountType

export const { setAcoountType } = authSlice.actions
export default authSlice.reducer