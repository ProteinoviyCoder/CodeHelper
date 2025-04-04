import { api } from "@/shared/api/apiSlice";

const userInfoEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    changeUsername: build.mutation<
      { message: string },
      { userId: number; newName: string }
    >({
      query: ({ newName, userId }) => ({
        url: "/userSetting/username",
        method: "POST",
        body: { newName, userId },
      }),
      invalidatesTags: ["User"],
    }),
    changeUserImg: build.mutation<
      { message: string },
      { userId: number; userImg: string }
    >({
      query: ({ userId, userImg }) => ({
        url: "/userSetting/userImg",
        method: "POST",
        body: {
          userId,
          userImg,
        },
      }),
      invalidatesTags: ["User"],
    }),
    changeUserTheme: build.mutation<
      { message: string },
      { userId: number; themeMode: string; themeVariant: string }
    >({
      query: ({ userId, themeMode, themeVariant }) => ({
        url: "/userSetting/userTheme",
        method: "POST",
        body: {
          userId,
          themeMode,
          themeVariant,
        },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useChangeUsernameMutation,
  useChangeUserImgMutation,
  useChangeUserThemeMutation,
} = userInfoEndpoints;
