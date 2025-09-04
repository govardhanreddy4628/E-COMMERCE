import { createSlice } from "@reduxjs/toolkit";
import { getAllProducts } from "../actions/fakeStoreproductAction";
import { Product } from "../../types/types";

interface ProductState {
    loading: boolean;
    data: Product[]; // Explicitly type the data as an array of Product
    error: string | null;
}

const initialState : ProductState = {
    loading : false,
    data : [],
    error : null
}

export const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(getAllProducts.pending, (state)=>{
            state.loading = true
        })
        .addCase(getAllProducts.fulfilled, (state, action)=>{
            state.loading = false;
            state.error = null;
            state.data = action.payload
        })
        .addCase(getAllProducts.rejected, (state)=>{
            state.loading = true
        })
    }
})


export default productSlice.reducer;
