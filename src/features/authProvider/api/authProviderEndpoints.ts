import { User } from "@/entities/user/model/types";
import { api } from "@/shared/api/apiSlice";

export const authProviderEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    userLoginByToken: build.query<User, void>({
      query: () => ({
        url: "/auth/loginToken",
      }),
      providesTags: (result) =>
        result
          ? [{ id: result.id, type: "User" as const }]
          : [{ type: "User", id: "LIST" }],
    }),
  }),
});

export const { useLazyUserLoginByTokenQuery } = authProviderEndpoints;
