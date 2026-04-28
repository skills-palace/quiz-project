import { createSlice } from "@reduxjs/toolkit";

const initAuth = { status: "idle", user: {} };
const initialState = {
  auth: initAuth,
};

export const appSlice = createSlice({
  name: "optionSlice",
  initialState,
  reducers: {
    setAuth(state, { payload }) {
      state.auth = payload;
    },
    clearAuth(state) {
      localStorage.clear("auth");
      state.auth = initAuth;
    },
  },
});

export const { setAuth, clearAuth } = appSlice.actions;

export default appSlice.reducer;
