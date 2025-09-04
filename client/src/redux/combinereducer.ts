import { combineReducers } from '@reduxjs/toolkit'
import  adminReducers  from './slices/adminSlice'
import  productReducer  from './slices/productSlice';

const rootReducer = combineReducers({
    product : productReducer,
    // category : categoryReducer,
    // cart : cartReducer,
    admin: adminReducers
});

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;