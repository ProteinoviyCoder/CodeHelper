import { api } from "@/shared/api/apiSlice";
import { SecureDataUser } from "../model/types";
import { User } from "@/entities/user/model/types";

const signinEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    userSignin: build.mutation<User, SecureDataUser>({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useUserSigninMutation } = signinEndpoints;
