import { configureStore } from '@reduxjs/toolkit'
import cityReducer from './cities/citySlice'
import authReducer from './auth/authSlice'
import categoryReducer from "./category/categorySlice"
import subCategoryReducer from "./subCategory/subCategorySlice"

export const store = configureStore({
    reducer: {
        city: cityReducer,
        auth: authReducer,
        category: categoryReducer,
        subCategory: subCategoryReducer,
        
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch