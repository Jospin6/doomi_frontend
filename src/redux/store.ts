import { configureStore } from '@reduxjs/toolkit'
import cityReducer from './cities/citySlice'
import authReducer from './auth/authSlice'
import categoryReducer from "./category/categorySlice"
import subCategoryReducer from "./subCategory/subCategorySlice"
import listingReducer from './listing/listingSlice'
import businessProfileReducer from './businessProfile/businessProfileSlice'
import favoriteReducer from './favorite/favoriteSlice'
import subscriptionReducer from './subscription/subscriptionSlice'
import boostReducer from './boost/boostSlice'
import messagingReducer from './message/messagingSlice'
import userReducer from './user/userSlice'

export const store = configureStore({
    reducer: {
        city: cityReducer,
        auth: authReducer,
        category: categoryReducer,
        subCategory: subCategoryReducer,
        listing: listingReducer,
        favorite: favoriteReducer,
        businessProfile: businessProfileReducer,
        subscription: subscriptionReducer,
        boosts: boostReducer,
        messaging: messagingReducer,
        user: userReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch