import { createSlice } from "@reduxjs/toolkit";
import { fetchUserDetails } from "../actions/userAction";

// Define a proper initial state
const initialState = {
  loading: false,
  error: null as string | null,
  user: null as any // ideally replace `any` with a proper User interface
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Add synchronous reducers here if needed
    clearUserState: (state) => {
      state.loading = false;
      state.error = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;
