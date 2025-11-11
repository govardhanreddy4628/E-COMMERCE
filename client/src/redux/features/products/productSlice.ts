// src/features/product/productSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { Product } from "./types";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./productThunks";

interface ProductState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 FETCH
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔹 CREATE
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // 🔹 UPDATE
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.items[index] = action.payload;
      })

      // 🔹 DELETE
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (p) => p._id !== action.payload && p.id !== action.payload
        );
      });
  },
});

export default productSlice.reducer;
