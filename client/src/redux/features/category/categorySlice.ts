// src/features/category/categorySlice.ts
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./categoryThunks";

interface CategoryState {
  items: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  items: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // CREATE
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // UPDATE
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (cat) => cat._id === action.payload._id
        );
        if (index !== -1) state.items[index] = action.payload;
      })

      // DELETE
      .addCase(deleteCategory.fulfilled, (state, action) => {
        const removeId = action.payload;
        const removeRecursively = (arr: Category[]): Category[] =>
          arr
            .filter((cat) => cat._id !== removeId)
            .map((cat) => ({
              ...cat,
              subcategories: removeRecursively(cat.subcategories || []),
            }));

        state.items = removeRecursively(state.items);
      });
  },
});

export default categorySlice.reducer;
