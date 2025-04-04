import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Groups } from "./types";

type InitialState = {
  groups?: Groups;
  activeGroup: string;
};

const initialState: InitialState = {
  activeGroup: "Все",
};

const moduleGroupsSlice = createSlice({
  name: "moduleGroupsSlice",
  initialState,
  reducers: {
    setGroups(state, action: PayloadAction<Groups>) {
      state.groups = action.payload;
    },
    clearGroupsState(state) {
      state = { activeGroup: "Все" };
    },
    setCurrentGroup(state, action: PayloadAction<string>) {
      state.activeGroup = action.payload;
    },
  },
});

export const {
  setGroups: actionSetGroups,
  clearGroupsState: actionClearGroupsState,
  setCurrentGroup: actionSetCurrentGroup,
} = moduleGroupsSlice.actions;
export default moduleGroupsSlice.reducer;
