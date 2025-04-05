import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./combineReducer";
import { api } from "@/shared/api/apiSlice";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(api.middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
