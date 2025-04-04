export type ArchiveScriptButton = {
  id: number;
  buttonText: string;
  script: string;
  versionId: number;
};

export type ArchiveScriptVersion = {
  id: number;
  v: number;
  description: string;
  buttons: ArchiveScriptButton[];
  name: string;
  scriptId: number;
};

export type ArchiveScriptType = {
  id: number;
  versions: ArchiveScriptVersion[];
};

export type SkeletVersion = {
  v: number;
  name: string;
  description: string;
  buttons: {
    buttonText: string;
    script: string;
  }[];
};

export type ChangeScriptTitleDTO = {
  scriptId: number;
  versionId: number;
  newTitle: string;
};

export type ChangeScriptDescriptionDTO = {
  scriptId: number;
  versionId: number;
  newDescription: string;
};

export type ChangeScriptCodeDTO = {
  scriptId: number;
  versionId: number;
  buttonId: number;
  newScript: string;
};

export type DeleteScriptDTO = {
  scriptId: number;
};

export type CreateNewScriptDTO = {
  versions: SkeletVersion[];
};

export type ScriptResponseDTO = {
  data: {
    message: string;
  };
};
