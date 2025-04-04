import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type initialStateProps = {
  isOpenSidebar: boolean;
};

const initialState: initialStateProps = {
  isOpenSidebar: true,
};

const sidebarSlice = createSlice({
  name: "sidebarSlice",
  initialState,
  reducers: {
    toggleSidebar(state, action: PayloadAction<boolean>) {
      state.isOpenSidebar = action.payload;
    },
  },
});

export const { toggleSidebar: actionToggleSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;
