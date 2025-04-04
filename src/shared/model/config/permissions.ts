import { Roles } from "./roles";

export const Permissions = {
  activePanel: [Roles.OWNER, Roles.ADMIN, Roles.CREATOR],
  activePanelDelete: [Roles.OWNER, Roles.ADMIN],
  modulesPage: [Roles.OWNER, Roles.ADMIN, Roles.CREATOR],
  modulesPageDelete: [Roles.OWNER, Roles.ADMIN],
  teamPage: [Roles.OWNER, Roles.ADMIN],
  teamPageDelete: [Roles.OWNER, Roles.ADMIN],
  teamPageCreate: [Roles.OWNER, Roles.ADMIN],
};
