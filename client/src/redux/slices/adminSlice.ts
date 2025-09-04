import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  twoFAEnabled: boolean;
}

interface ActivityLog {
  timestamp: string;
  action: string;
}

interface AdminState {
  admin?: Admin;
  activityLog: ActivityLog[];
  loading: boolean;
  error?: string;
}

const initialState: AdminState = { loading: false, activityLog: [] };

export const fetchAdmin = createAsyncThunk("admin/fetch", async () => {
  const res = await axios.get<Admin>("/api/admin/profile");
  return res.data;
});

export const updateProfile = createAsyncThunk("admin/update", async (payload: Partial<Admin>) => {
  const res = await axios.put<Admin>("/api/admin/profile", payload);
  return res.data;
});

export const uploadAvatar = createAsyncThunk("admin/avatar", async (file: File) => {
  const form = new FormData();
  form.append("avatar", file);
  const res = await axios.post<{ avatarUrl: string }>("/api/admin/avatar", form);
  return res.data.avatarUrl;
});

// Similarly actions for password change, 2FA toggle, activity fetch

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmin.pending, (s) => { s.loading = true; })
      .addCase(fetchAdmin.fulfilled, (s, a) => { s.admin = a.payload; s.loading = false; })
      .addCase(fetchAdmin.rejected, (s, a) => { s.error = a.error.message; s.loading = false; })
      // handle updateProfile, uploadAvatar similar...
  },
});

export default adminSlice.reducer;
