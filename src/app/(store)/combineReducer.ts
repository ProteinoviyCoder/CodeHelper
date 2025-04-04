import { combineReducers } from "redux";
import userSlice from "@/entities/user/model/userSlice";
import SidebarSlice from "@/widgets/model/sidebar/sidebarSlice";
import ModulesGroupsSlice from "@/features/modulesPageComponents/model/moduleGroupsSlice";
import { api } from "@/shared/api/apiSlice";

export const rootReducer = combineReducers({
  user: userSlice,
  sidebar: SidebarSlice,
  modulesGroups: ModulesGroupsSlice,
  [api.reducerPath]: api.reducer,
});
