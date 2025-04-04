import { Roles } from "@/shared/model/config/roles";

export type User = {
  id: number;
  userEmail: string;
  userImg?: string;
  username?: string;
  themeId?: number;
  userRole: Roles.ADMIN | Roles.CREATOR | Roles.USER | Roles.OWNER;
  userTheme: {
    id?: number;
    themeMode: string;
    themeVariant: string;
  };
};
