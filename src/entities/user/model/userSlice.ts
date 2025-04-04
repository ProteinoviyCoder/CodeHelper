import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "./types";

type InitialState = {
  userData: User | null;
  isAuth: boolean;
};

const initialState: InitialState = {
  userData: null,
  isAuth: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<User>) {
      state.userData = action.payload;
      state.isAuth = true;
    },
    logoutUser(state) {
      state.userData = null;
      state.isAuth = false;
    },
    changeUsername(state, action: PayloadAction<string>) {
      if (state.userData) state.userData.username = action.payload;
    },
    changeUserImg(state, action: PayloadAction<string>) {
      if (state.userData) state.userData.userImg = action.payload;
    },
    changeUserThemeMode(state, action: PayloadAction<string>) {
      if (state.userData) state.userData.userTheme.themeMode = action.payload;
    },
    changeUserThemeVariant(state, action: PayloadAction<string>) {
      if (state.userData)
        state.userData.userTheme.themeVariant = action.payload;
    },
  },
});

export const {
  setUserData: actionSetUserData,
  changeUsername: actionChangeUsername,
  changeUserImg: actionChangeUserImg,
  changeUserThemeMode: actionChangeUserThemeMode,
  changeUserThemeVariant: actionChangeUserThemeVariant,
  logoutUser: actionLogoutUser,
} = userSlice.actions;
export default userSlice.reducer;
