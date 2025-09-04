import { createAsyncThunk } from "@reduxjs/toolkit";    
import { createProductApi, deleteProductApi, getAllProductsApi, getSingleProductApi, updateProductApi } from "../../api/fakeStoreproducts";
import { Product } from "../../types/types";


export const getAllProducts = createAsyncThunk<Product[], void>("productData/fetch", async()=>{
    try {
        const response = await getAllProductsApi() as Response;
        const data: Product[] = await response.json();
        return data
    } catch (error) {
        return error;
    }
})

export const createProduct = createAsyncThunk<Product[], void>("productData", async()=>{
    try {
        const response = await createProductApi() as Response;
        const data: Product[] = await response.json();
        return data
    } catch (error) {
        return error;
    }
})

export const getSingleProduct = createAsyncThunk<Product[], void>("productData", async()=>{
    try {
        const response = await getSingleProductApi() as Response;
        const data: Product[] = await response.json();
        return data
    } catch (error) {
        return error;
    }
})

export const updateProduct = createAsyncThunk<Product[], void>("productData", async()=>{
    try {
        const response = await updateProductApi() as Response;
        const data: Product[] = await response.json();
        return data
    } catch (error) {
        return error;
    }
})

export const deleteProduct = createAsyncThunk<Product[], void>("productData", async()=>{
    try {
        const response = await deleteProductApi() as Response;
        const data: Product[] = await response.json();
        return data
    } catch (error) {
        return error;
    }
})