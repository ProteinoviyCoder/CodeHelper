import { actionLogoutUser } from "@/entities/user/model/userSlice";
import { actionClearGroupsState } from "@/features/modulesPageComponents/model/moduleGroupsSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchBaseQueryWithMiddlware = async (
  args: any,
  api: any,
  extraOptions: any
) => {
  let result = await fetchBaseQuery({ baseUrl: "/api" })(
    args,
    api,
    extraOptions
  );

  if (result.error && result.error.status === 401) {
    const err = result.error.data as { message: string } | undefined;

    if (err && err.message === "Невалидный токен") {
      const responseRefresh = await fetchBaseQuery({
        baseUrl: "/api",
      })({ url: "/auth/refresh", method: "POST" }, api, extraOptions);

      if (responseRefresh.data) {
        result = await fetchBaseQuery({ baseUrl: "/api" })(
          args,
          api,
          extraOptions
        );
      } else {
        api.util.resetApiState();
        api.dispatch(actionLogoutUser());
        api.dispatch(actionClearGroupsState());
      }
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  tagTypes: ["User"],
  baseQuery: fetchBaseQueryWithMiddlware,
  endpoints: (build) => ({
    userLogout: build.mutation<void, void>({
      query: () => ({
        url: "/auth/exit",
        method: "POST",
      }),
    }),
  }),
});

export const { useUserLogoutMutation } = api;
