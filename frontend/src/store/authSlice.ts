import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../services/api";
import type { User } from "../types";

export const loadUser = createAsyncThunk(
  "auth/load",
  async () => (await api.get<{ user: User }>("/auth/me")).data.user,
);

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null as User | null, ready: false },
  reducers: {
    signedIn(state, action: { payload: User }) {
      state.user = action.payload;
      state.ready = true;
    },
    signedOut(state) {
      state.user = null;
      state.ready = true;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.ready = true;
      })
      .addCase(loadUser.rejected, (state) => {
        state.user = null;
        state.ready = true;
      }),
});

export const { signedIn, signedOut } = authSlice.actions;
export default authSlice.reducer;
