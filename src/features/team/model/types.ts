export type TeamuUser = {
  id: number;
  userEmail: string;
  username: string | null;
  userImg: string | null;
  userRole: string;

  createdAt: string;
};

export type GetTeamResponseDTO = {
  message: string;
  team: TeamuUser[];
};

export type TeamResponseDTO = {
  message: string;
};

export type ChangeRoleUserTeamDTO = {
  userTeamId: number;
  newRole: string;
};

export type DeleteUserTeamDTO = {
  userTeamId: number;
};

export type AddNewUserTeamDTO = {
  newUserTeam: {
    userEmail: string;
    userPassword: string;
    userRole: string;
  };
};

export type InputValue = {
  value: string;
  error: string;
};
