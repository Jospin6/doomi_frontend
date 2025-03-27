import { User } from "@/helpers/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { baseUrl } from "@/helpers/constants";

interface initialStateProps {
    acoountType: "PERSONAL" | "BUSINESS" | null
    isAuthenticated: boolean;
    token: string | null;
    user: User | null;
}

const initialState: initialStateProps = {
    acoountType: null,
    isAuthenticated: !!getCookie("access_token"),
    token: typeof getCookie("access_token") === "string" ? (getCookie("access_token") as string) : null,
    user: null,
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
        const response = await axios.post(`${baseUrl}/auth/signup`, signupData)
        const { access_token } = response.data;
        setCookie("access_token", access_token, {
            maxAge: 7 * 24 * 60 * 60, // 7 jours
            path: "/",
            secure: process.env.NODE_ENV === "production",
            httpOnly: false, // True si géré par le backend (httpOnly ne peut pas être lu par JS)
        });
        return response.data
    } catch (error: any) {
        throw new Error("Error: ", error)
    }
})

export const signin = createAsyncThunk("auth/signin", async (signinData: signinDataProps) => {
    try {
        const response = await axios.post(`${baseUrl}/auth/signin`, signinData)
        const { access_token } = response.data;
        setCookie("access_token", access_token, {
            maxAge: 7 * 24 * 60 * 60, // 7 jours
            path: "/",
            secure: process.env.NODE_ENV === "production",
            httpOnly: false, // True si géré par le backend (httpOnly ne peut pas être lu par JS)
        });
        return response.data
    } catch (error: any) {
        throw new Error("Error: ", error)
    }
})

export const fetchCurrentUser = createAsyncThunk(
    "auth/fetchCurrentUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get<User>(`${baseUrl}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${getCookie("access_token")}`,
                },
            });

            return response.data;
        } catch (error: any) {
            return rejectWithValue("Failed to fetch user");
        }
    }
);

export const signout = createAsyncThunk("", () => { })

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAcoountType: (state, action: PayloadAction<any>) => {
            state.acoountType = action.payload
        },
        logout: (state) => {
            deleteCookie("access_token");
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(signup.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.user = action.payload.user;
        });
        builder.addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        });
    },
})

export const selectAcoountType = (state: RootState) => state.auth.acoountType

export const { setAcoountType, logout } = authSlice.actions
export default authSlice.reducer