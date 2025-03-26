import { configureStore } from '@reduxjs/toolkit'
import cityReducer from './cities/citySlice'
import authReducer from './auth/authSlice'
import categoryReducer from "./category/categorySlice"
import subCategoryReducer from "./subCategory/subCategorySlice"
import listingReducer from './listing/listingSlice'
import favoriteReducer from './favorite/favoriteSlice'

export const store = configureStore({
    reducer: {
        city: cityReducer,
        auth: authReducer,
        category: categoryReducer,
        subCategory: subCategoryReducer,
        listing: listingReducer,
        favorite: favoriteReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch