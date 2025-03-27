import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { baseUrl, geoUserName } from '@/helpers/constants'
import { City, CityState, DbCity } from '@/helpers/types'
import axios from 'axios'
import { RootState } from "../store";

const initialState: CityState = {
    cities: [],
    selectedCity: null,
    dbCities: [],
    dbCity: null,
    pays: '',
    loading: false,
    error: null,
};


export const fetchCities = createAsyncThunk<City[], string>(
    'cities/fetchCities',
    async (inputValue: string) => {
        const response = await axios.get(`http://api.geonames.org/searchJSON`, {
            params: {
                q: inputValue,
                maxRows: 10,
                username: geoUserName,
            },
        });
        return response.data.geonames.map((city: any) => ({
            value: city.geonameId,
            label: `${city.name}, ${city.countryName}`,
            ville: city.name,
            pays: city.countryName,
            lat_lon: `${city.lat},${city.lng}`,
            flag: `https://flagcdn.com/${city.countryCode.toLowerCase()}.png`,
            countryCode: city.countryCode
        }));
    }
);

export const fetchDbCities = createAsyncThunk("cities/fetchDbCities", async (inputValue: string) => {
    try {
        const response = await axios.get(`${baseUrl}/loation?q=${inputValue}`)
        return response.data
    } catch (error: any) {
        throw new Error("Error: ", error)
    }
})

export const addLocation = createAsyncThunk("cities/addLocation", async (locationData: DbCity) => {
    try {
        const response = await axios.post(`${baseUrl}/loation`, locationData)
        return response.data
    } catch (error: any) {
        throw new Error("Error: ", error)
    }
})

export const deleteLocation = createAsyncThunk("cities/deleteLocation", async (id: string) => {
    try {
        const response = await axios.delete(`${baseUrl}/loation/${id}`)
        return response.data
    } catch (error: any) {
        throw new Error("Error: ", error) 
    }
})


const citySlice = createSlice({
    name: 'cities',
    initialState,
    reducers: {
        setSelectedCity(state, action: PayloadAction<any>) {
            state.selectedCity = action.payload;
            state.pays = action.payload.country;
        },
        setDbCity(state, action: PayloadAction<any>) {
            state.dbCity = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCities.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCities.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.cities = action.payload;
            })
            .addCase(fetchCities.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload || null;
            })

            .addCase(fetchDbCities.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDbCities.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.dbCities = action.payload;
            })
            .addCase(fetchDbCities.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload || null;
            });
    },
});

export const selectSelectedCity = (state: RootState) => state.city.selectedCity
export const selectDbCity = (state: RootState) => state.city.dbCity

export const { setSelectedCity, setDbCity } = citySlice.actions;
export default citySlice.reducer;
