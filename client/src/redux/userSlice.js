import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: null,
    isAuthenticated: false,
  },
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
      state.isAuthenticated = true;
    },
    logoutUser: (state) => {
      state.userId = null;
      state.isAuthenticated = false;
    },
  },
});

export const selectUserId = (state) => state.user.userId;
export const { setUserId, logoutUser } = userSlice.actions;
export default userSlice.reducer;
