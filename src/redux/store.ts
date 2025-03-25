import { configureStore } from '@reduxjs/toolkit'
import cityReducer from './cities/citySlice'

export const store = configureStore({
    reducer: {
        city: cityReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch