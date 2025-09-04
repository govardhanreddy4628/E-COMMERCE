// features/categories/categorySlice.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCategories } from "../../api/categoryAPI"; // custom API call

export const getAllCategories = createAsyncThunk("categories/getAll", async () => {
  const response = await fetchCategories();
  return response;
});
