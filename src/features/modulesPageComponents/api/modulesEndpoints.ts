import { api } from "@/shared/api/apiSlice";
import {
  AddNewGroupDTO,
  AddNewModuleDTO,
  DeleteGroupDTO,
  DeleteModuleDTO,
  GetModulesGroupsResponseDTO,
  GetModulesResponseDTO,
  ModulesGroupsResponseDTO,
  ModulesResponseDTO,
  UpdateCodeModuleDTO,
  UpdateGroupsModuleDTO,
  UpdateImgModuleDTO,
  UpdateTitleModuleDTO,
} from "../model/types";

const modulesEndpoints = api
  .enhanceEndpoints({ addTagTypes: ["ModulesTab", "Module"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getAllGroups: build.query<GetModulesGroupsResponseDTO, null>({
        query: () => ({
          url: "/modules/getModulesGroups",
          method: "GET",
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.groups.map(({ id }) => ({
                  type: "ModulesTab" as const,
                  id,
                })),
                { type: "ModulesTab", id: "LIST" },
              ]
            : [{ type: "ModulesTab", id: "LIST" }],
      }),
      addNewGroup: build.mutation<ModulesGroupsResponseDTO, AddNewGroupDTO>({
        query: ({ newGroup }) => ({
          url: "/modules/addNewGroup",
          method: "POST",
          body: { newGroup },
        }),
        invalidatesTags: [{ type: "ModulesTab", id: "LIST" }],
      }),
      deleteGroup: build.mutation<ModulesGroupsResponseDTO, DeleteGroupDTO>({
        query: ({ group }) => ({
          url: "/modules/deleteGroup",
          method: "POST",
          body: { group },
        }),
        invalidatesTags: [{ type: "ModulesTab", id: "LIST" }],
      }),
      getAllModules: build.query<GetModulesResponseDTO, null>({
        query: () => ({
          url: "/modules/getModules",
          method: "GET",
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.modules.map(({ id }) => ({
                  id,
                  type: "Module" as const,
                })),
                { id: "LIST", type: "Module" },
              ]
            : [{ id: "LIST", type: "Module" }],
      }),
      addNewModule: build.mutation<ModulesResponseDTO, AddNewModuleDTO>({
        query: ({ newModule }) => ({
          url: "/modules/addNewModule",
          method: "POST",
          body: {
            newModule,
          },
        }),
        invalidatesTags: [{ id: "LIST", type: "Module" }],
      }),
      updateTileModule: build.mutation<
        ModulesResponseDTO,
        UpdateTitleModuleDTO
      >({
        query: ({ moduleId, newTitle }) => ({
          url: "/modules/changeTitleModule",
          method: "POST",
          body: {
            moduleId,
            newTitle,
          },
        }),
        invalidatesTags: (_, __, arg) => [{ id: arg.moduleId, type: "Module" }],
      }),
      updateImgModule: build.mutation<ModulesResponseDTO, UpdateImgModuleDTO>({
        query: ({ moduleId, newImg }) => ({
          url: "/modules/changeImgModule",
          method: "POST",
          body: {
            moduleId,
            newImg,
          },
        }),
        invalidatesTags: (_, __, arg) => [{ id: arg.moduleId, type: "Module" }],
      }),
      updateCodeModule: build.mutation<ModulesResponseDTO, UpdateCodeModuleDTO>(
        {
          query: ({ moduleId, newCode }) => ({
            url: "/modules/changeCodeModule",
            method: "POST",
            body: {
              moduleId,
              newCode,
            },
          }),
          invalidatesTags: (_, __, arg) => [
            { id: arg.moduleId, type: "Module" },
          ],
        }
      ),
      updateGroupsModule: build.mutation<
        ModulesResponseDTO,
        UpdateGroupsModuleDTO
      >({
        query: ({ moduleId, newGroups }) => ({
          url: "/modules/changeGroupsModule",
          method: "POST",
          body: {
            moduleId,
            newGroups,
          },
        }),
        invalidatesTags: (_, __, arg) => [{ id: arg.moduleId, type: "Module" }],
      }),
      DeleteModule: build.mutation<ModulesResponseDTO, DeleteModuleDTO>({
        query: ({ moduleId }) => ({
          url: "/modules/deleteModule",
          method: "POST",
          body: {
            moduleId,
          },
        }),
        invalidatesTags: [{ id: "LIST", type: "Module" }],
      }),
    }),
  });

export const {
  useGetAllGroupsQuery,
  useAddNewGroupMutation,
  useDeleteGroupMutation,
  useGetAllModulesQuery,
  useAddNewModuleMutation,
  useUpdateTileModuleMutation,
  useUpdateImgModuleMutation,
  useUpdateCodeModuleMutation,
  useUpdateGroupsModuleMutation,
  useDeleteModuleMutation,
} = modulesEndpoints;
