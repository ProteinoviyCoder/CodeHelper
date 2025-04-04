import { api } from "@/shared/api/apiSlice";
import {
  AddNewUserTeamDTO,
  ChangeRoleUserTeamDTO,
  DeleteUserTeamDTO,
  GetTeamResponseDTO,
  TeamResponseDTO,
} from "../model/types";

const teamEndpoints = api
  .enhanceEndpoints({ addTagTypes: ["Team"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getTeam: build.query<GetTeamResponseDTO, null>({
        query: () => ({
          url: "/team/getTeam",
          method: "GET",
        }),
        providesTags: (result) =>
          result && result.team
            ? [
                ...result.team.map((user) => ({
                  type: "Team" as const,
                  id: user.id,
                })),
                { type: "Team", id: "LIST" },
              ]
            : [{ type: "Team", id: "LIST" }],
      }),

      changeRoleUserTeam: build.mutation<
        TeamResponseDTO,
        ChangeRoleUserTeamDTO
      >({
        query: ({ userTeamId, newRole }) => ({
          url: "/team/changeRoleUserTeam",
          method: "POST",
          body: {
            userTeamId,
            newRole,
          },
        }),
        invalidatesTags: (_, __, arg) => [{ id: arg.userTeamId, type: "Team" }],
      }),

      deleteUserTeam: build.mutation<TeamResponseDTO, DeleteUserTeamDTO>({
        query: ({ userTeamId }) => ({
          url: "/team/deleteUserTeam",
          method: "POST",
          body: {
            userTeamId,
          },
        }),
        invalidatesTags: (_, __, arg) => [{ id: "LIST", type: "Team" }],
      }),

      addNewUserTeam: build.mutation<TeamResponseDTO, AddNewUserTeamDTO>({
        query: ({ newUserTeam }) => ({
          url: "/team/addNewUserTeam",
          method: "POST",
          body: {
            newUserTeam,
          },
        }),
        invalidatesTags: (_, __, arg) => [{ id: "LIST", type: "Team" }],
      }),
    }),
  });

export const {
  useGetTeamQuery,
  useChangeRoleUserTeamMutation,
  useDeleteUserTeamMutation,
  useAddNewUserTeamMutation,
} = teamEndpoints;
