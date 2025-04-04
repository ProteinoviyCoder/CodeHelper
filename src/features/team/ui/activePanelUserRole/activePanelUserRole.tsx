"use client";

import style from "./activePanelUserRole.module.scss";
import { User } from "@/entities/user/model/types";
import { Permissions } from "@/shared/model/config/permissions";
import { Roles } from "@/shared/model/config/roles";
import { Button } from "@/shared/ui/button/button";
import { Dropdown } from "@/shared/ui/dropdown/dropdown";
import { Title } from "@/shared/ui/title/title";
import { FC, memo, MouseEvent, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { useChangeRoleUserTeamMutation } from "../../api/teamEndpoints";
import { getErrorMessage } from "@/shared/model/lib/help";
import { Snackbar } from "@/shared/ui/snackbar/snackbar";

type ActivePanelUserRoleInitialProps = {
  userTeamRole: string;
  userData?: User;
  userTeamId: number;
};

const ActivePanelUserRoleInitial: FC<ActivePanelUserRoleInitialProps> = ({
  userTeamRole,
  userData,
  userTeamId,
}) => {
  const roles =
    userData?.userRole.trim().toLowerCase() === "owner"
      ? [Roles.ADMIN, Roles.CREATOR, Roles.USER]
      : [Roles.CREATOR, Roles.USER];

  const [changeRoleUserTeamBD, { isLoading }] = useChangeRoleUserTeamMutation();

  const [isVisibleDropdown, setIsVisibleDropdown] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<string>(userTeamRole);
  const [isOpenSneckbar, setIsOpenSneckbar] = useState<boolean>(false);
  const [textSneckbar, setTextSneckbar] = useState<string>("");
  const [variantSneckbar, setVariantSneckbar] = useState<
    "error" | "information"
  >("information");

  const handleShowDropdown = () => {
    setIsVisibleDropdown(true);
  };

  const handleChangeCurrentRole = (e: MouseEvent<HTMLLIElement>) => {
    const newCurrentRole = e.currentTarget.textContent;
    if (typeof newCurrentRole !== "string") return;

    setCurrentRole(newCurrentRole);
  };

  const handleCancelChanges = () => {
    setCurrentRole(userTeamRole);
    setIsVisibleDropdown(false);
  };

  const handleChangeRole = async () => {
    const { error } = await changeRoleUserTeamBD({
      userTeamId,
      newRole: currentRole,
    });

    if (error) {
      const myError = getErrorMessage(error);

      setVariantSneckbar("error");
      setTextSneckbar(myError);
      setIsOpenSneckbar(true);

      setCurrentRole(userTeamRole);

      return;
    }

    setVariantSneckbar("information");
    setTextSneckbar("Роль обновлена");
    setIsOpenSneckbar(true);

    setIsVisibleDropdown(false);
  };

  if (!userData) {
    return;
  }

  if (
    userTeamRole.trim().toLowerCase() === "owner" ||
    !Permissions.teamPage.includes(userData.userRole) ||
    (userData.userRole.trim().toLowerCase() === "admin" &&
      userTeamRole.trim().toLowerCase() === "admin")
  ) {
    return (
      <div>
        <p>Роль: </p> <Title size="s1">{currentRole}</Title>
      </div>
    );
  }

  return (
    <div>
      <p>Роль: </p>
      {isVisibleDropdown ? (
        <Dropdown
          onChange={handleChangeCurrentRole}
          variants={roles}
          buttonText={currentRole}
        ></Dropdown>
      ) : (
        <Title size="s1">{currentRole}</Title>
      )}
      {!isVisibleDropdown && (
        <Button
          onClick={handleShowDropdown}
          customClass={style["btn-change"]}
          variant="secondary"
        >
          <AiFillEdit />
        </Button>
      )}
      {isVisibleDropdown && (
        <>
          <Button
            onClick={handleChangeRole}
            variant="secondary"
            disabled={isLoading}
          >
            Сохранить
          </Button>
          <Button onClick={handleCancelChanges} variant="error">
            Отменить
          </Button>
        </>
      )}
      <Snackbar
        open={isOpenSneckbar}
        setOpen={setIsOpenSneckbar}
        message={textSneckbar}
        variant={variantSneckbar}
      ></Snackbar>
    </div>
  );
};

export const ActivePanelUserRole = memo(ActivePanelUserRoleInitial);
