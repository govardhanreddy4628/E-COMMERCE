import { createSlice } from "@reduxjs/toolkit";
import { Category } from "../../types/types";

interface category {
  loading: boolean;
  categories: category[];
  error: string | null;
}

const initialState: category = {
  loading: false,
  categories: [],
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.error = null;
    })
    .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
    })
  },
});

export default categorySlice.reducer;
