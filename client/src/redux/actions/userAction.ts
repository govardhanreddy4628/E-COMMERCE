import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUserDetailsApi,
  userForgotPasswordApi,
  userLoginApi,
  userRegistrationApi,
  userResetPasswordApi,
  userVerifyEmailApi,
} from "../../api/userApi";
import { AxiosError } from "axios";

// Helper to extract error message
const handleAxiosError = (error: unknown, thunkAPI: any) => {
  const axiosError = error as AxiosError;
  return thunkAPI.rejectWithValue(
    axiosError.response?.data || axiosError.message
  );
};

export const userRegistration = createAsyncThunk(
  "user/registration",
  async (payload: any, thunkAPI) => {
    try {
      const response = await userRegistrationApi(payload);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const userVerifyEmail = createAsyncThunk(
  "user/verify-email",
  async (payload: any, thunkAPI) => {
    try {
      const response = await userVerifyEmailApi(payload);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const userLogin = createAsyncThunk(
  "user/login",
  async (payload: any, thunkAPI) => {
    try {
      const response = await userLoginApi(payload);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const userForgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (payload: any, thunkAPI) => {
    try {
      const response = await userForgotPasswordApi(payload);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const userResetPassword = createAsyncThunk(
  "user/resetPassword",
  async (payload: any, thunkAPI) => {
    try {
      const response = await userResetPasswordApi(payload);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  "user/fetchUserDetails",
  async (payload: any, thunkAPI) => {
    try {
      const response = await getUserDetailsApi(payload);
      return response.data;
    } catch (error) {
      return handleAxiosError(error, thunkAPI);
    }
  }
);
