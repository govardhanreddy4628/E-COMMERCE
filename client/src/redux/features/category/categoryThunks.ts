// src/features/category/categoryThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Category } from "../../../types/types";


const API_URL = "http://localhost:8080/api/categories"; // adjust backend URL

export const fetchCategories = createAsyncThunk<Category[]>(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createCategory = createAsyncThunk<Category, Partial<Category>>(
  "categories/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, data);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateCategory = createAsyncThunk<Category, Category>(
  "categories/update",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/${data._id || data.id}`, data);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteCategory = createAsyncThunk<string, string>(
  "categories/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
