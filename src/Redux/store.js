import { configureStore, createSlice } from "@reduxjs/toolkit";

// Create a slice for authentication
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, // this will store user information when logged in
    isAdmin: false, // to store whether the user has admin privileges
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isAdmin = action.payload?.user_metadata?.role === "admin";
    },
    clearUser(state) {
      state.user = null;
      state.isAdmin = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export default store;
