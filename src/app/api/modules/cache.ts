import prisma from "../../../../prisma/prisma";

declare global {
  var modules:
    | {
        id: number;
        img: string | null;
        name: string;
        groups: string[];
        code: string;
      }[]
    | null;
  var modulesGroups:
    | {
        id: number;
        group: string;
      }[]
    | null;
}

if (!globalThis.modulesGroups) {
  globalThis.modulesGroups = null;
}

if (!globalThis.modules) {
  globalThis.modules = null;
}

export const getAllModulesGroups = async () => {
  if (!globalThis.modulesGroups) {
    console.log("Загружаем группы модулей");
    globalThis.modulesGroups = await prisma.modulesGroup.findMany();
  } else {
    console.log("Группы модулей уже загружены");
  }
  return globalThis.modulesGroups;
};

export const resetCacheModulesGroups = () => {
  globalThis.modulesGroups = null;
};

export const getAllModules = async () => {
  if (!globalThis.modules) {
    console.log("Загружаем модули");
    globalThis.modules = await prisma.module.findMany();
  } else {
    console.log("Модули уже загружены");
  }
  return globalThis.modules;
};

export const resetCacheModules = () => {
  globalThis.modules = null;
};
