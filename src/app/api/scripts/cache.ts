import prisma from "../../../../prisma/prisma";

declare global {
  // eslint-disable-next-line no-var
  var allScripts:
    | ({
        versions: ({
          buttons: {
            script: string;
            id: number;
            buttonText: string;
            versionId: number;
          }[];
        } & {
          name: string;
          id: number;
          v: number;
          description: string;
          scriptId: number;
        })[];
      } & { id: number })[]
    | null;
}

if (!globalThis.allScripts) {
  globalThis.allScripts = null;
}

export const getAllScripts = async () => {
  if (!globalThis.allScripts) {
    console.log("Загружаем скрипты в кеш");
    globalThis.allScripts = await prisma.script.findMany({
      include: {
        versions: { include: { buttons: true }, orderBy: { v: "asc" } },
      },
    });
  } else {
    console.log("Скрипты уже есть");
  }
  return globalThis.allScripts;
};

export const resetCache = () => {
  globalThis.allScripts = null;
};
