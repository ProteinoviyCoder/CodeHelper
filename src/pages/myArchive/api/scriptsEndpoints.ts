import { api } from "@/shared/api/apiSlice";
import { ResponseGetScriptsDTO } from "../model/types";

export const scriptEndpoints = api
  .enhanceEndpoints({ addTagTypes: ["Script"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getAllScripts: build.query<ResponseGetScriptsDTO, null>({
        query: () => ({
          url: "/scripts/getScripts",
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.allScripts.map(({ id }) => ({
                  id,
                  type: "Script" as const,
                })),
                { type: "Script", id: "LIST" },
              ]
            : [{ type: "Script", id: "LIST" }],
      }),
    }),
  });

export const { useGetAllScriptsQuery } = scriptEndpoints;
