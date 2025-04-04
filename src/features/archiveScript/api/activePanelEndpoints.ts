import { api } from "@/shared/api/apiSlice";
import {
  ChangeScriptTitleDTO,
  ScriptResponseDTO,
  ChangeScriptDescriptionDTO,
  ChangeScriptCodeDTO,
  DeleteScriptDTO,
  CreateNewScriptDTO,
} from "../model/types";

export const activePanelEndpoints = api
  .enhanceEndpoints({ addTagTypes: ["Script"] })
  .injectEndpoints({
    endpoints: (build) => ({
      changeScriptTitle: build.mutation<
        ScriptResponseDTO,
        ChangeScriptTitleDTO
      >({
        query: ({ scriptId, versionId, newTitle }) => ({
          url: "/scripts/changeTitle",
          method: "POST",
          body: {
            scriptId,
            versionId,
            newTitle,
          },
        }),
        invalidatesTags: (result, _, { scriptId }) =>
          result ? [{ type: "Script" as const, id: scriptId }] : [],
      }),
      changeScriptDescription: build.mutation<
        ScriptResponseDTO,
        ChangeScriptDescriptionDTO
      >({
        query: ({ scriptId, versionId, newDescription }) => ({
          url: "/scripts/changeDescription",
          method: "POST",
          body: {
            scriptId,
            versionId,
            newDescription,
          },
        }),
        invalidatesTags: (result, _, { scriptId }) =>
          result ? [{ type: "Script" as const, id: scriptId }] : [],
      }),
      changeScriptCode: build.mutation<ScriptResponseDTO, ChangeScriptCodeDTO>({
        query: ({ scriptId, versionId, buttonId, newScript }) => ({
          url: "/scripts/changeScript",
          method: "POST",
          body: { scriptId, versionId, buttonId, newScript },
        }),
        invalidatesTags: (result, _, { scriptId }) =>
          result ? [{ type: "Script" as const, id: scriptId }] : [],
      }),
      deleteScript: build.mutation<ScriptResponseDTO, DeleteScriptDTO>({
        query: ({ scriptId }) => ({
          url: "/scripts/deleteScript",
          method: "POST",
          body: {
            scriptId,
          },
        }),
        invalidatesTags: (result, _, { scriptId }) =>
          result ? [{ type: "Script" as const, id: scriptId }] : [],
      }),
      createNewScript: build.mutation<ScriptResponseDTO, CreateNewScriptDTO>({
        query: ({ versions }) => ({
          url: "/scripts/addNewScript",
          method: "POST",
          body: {
            versions,
          },
        }),
        invalidatesTags: () => [{ type: "Script" as const, id: "LIST" }],
      }),
    }),
  });

export const {
  useChangeScriptTitleMutation,
  useChangeScriptDescriptionMutation,
  useChangeScriptCodeMutation,
  useDeleteScriptMutation,
  useCreateNewScriptMutation,
} = activePanelEndpoints;
