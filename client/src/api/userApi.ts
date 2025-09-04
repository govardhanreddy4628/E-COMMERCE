const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";
import {GET, POST, PUT, DELETE} from "./api_utility";


export const userRegistrationApi = async(payload) => {
    try {
        const response = await POST(BASE_URL, payload);
        return response;
    } catch (error) {
        return error;
    }
}
export const userVerifyEmailApi = async(payload) => {
    try {
        const response = await POST(BASE_URL, payload);
        return response;
    } catch (error) {
        return error;
    }
}
export const userLoginApi = async(payload) => {
    try {
        const response = await POST(BASE_URL, payload);
        return response;
    } catch (error) {
        return error;
    }
}

export const userForgotPasswordApi = async (payload) => {
    try {
        const response = await GET(BASE_URL, payload);
        return response;
    } catch (error) {
        console.error("Failed to fetch user details:", error);
        return null; // or throw error if you want upstream handling
    }
};

export const userResetPasswordApi = async (payload) => {
    try {
        const response = await GET(BASE_URL, payload);
        return response;
    } catch (error) {
        console.error("Failed to fetch user details:", error);
        return null; // or throw error if you want upstream handling
    }
};

export const getUserDetailsApi = async (payload) => {
    try {
        const response = await GET(BASE_URL, payload);
        return response;
    } catch (error) {
        console.error("Failed to fetch user details:", error);
        return null; // or throw error if you want upstream handling
    }
};
























//data calling: component-----> thunk(actions) ----> api ---->api utility ----> slice