export type Groups = {
  id: number;
  group: string;
}[];

export type GetModulesGroupsResponseDTO = {
  message: string;
  groups: {
    id: number;
    group: string;
  }[];
};

export type ModulesGroupsResponseDTO = {
  message: string;
};

export type AddNewGroupDTO = {
  newGroup: string;
};

export type DeleteGroupDTO = {
  group: string;
};

export type ModuleCardType = {
  id: number;
  img: string | null;
  name: string;
  groups: string[];
  code: string;
};

export type GetModulesResponseDTO = {
  message: string;
  modules: ModuleCardType[];
};

export type ModulesResponseDTO = {
  message: string;
};

export type AddNewModuleDTO = { newModule: Omit<ModuleCardType, "id"> };

export type UpdateTitleModuleDTO = {
  moduleId: number;
  newTitle: string;
};

export type UpdateImgModuleDTO = {
  moduleId: number;
  newImg: string;
};

export type UpdateCodeModuleDTO = {
  moduleId: number;
  newCode: string;
};

export type UpdateGroupsModuleDTO = {
  moduleId: number;
  newGroups: string[];
};

export type DeleteModuleDTO = {
  moduleId: number;
};
