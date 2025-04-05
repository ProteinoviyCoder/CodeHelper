"use client";

import { User } from "@/entities/user/model/types";
import style from "./activePanelUserDelete.module.scss";
import { Dispatch, FC, memo, SetStateAction, useState } from "react";
import { Button } from "@/shared/ui/button/button";
import { Permissions } from "@/shared/model/config/permissions";
import { ModalWindow } from "@/shared/ui/modalWindow/modalWindow";
import { useDeleteUserTeamMutation } from "../../api/teamEndpoints";
import { getErrorMessage } from "@/shared/model/lib/help";
import { Snackbar } from "@/shared/ui/snackbar/snackbar";

type ActivePanelUserDeleteInitialProps = {
  userData?: User;
  userTeamRole: string;
  userTeamId: number;
  parentSnackbar: {
    setIsOpenSneckbar: Dispatch<SetStateAction<boolean>>;
    setTextSneckbar: Dispatch<SetStateAction<string>>;
    setVariantSneckbar: Dispatch<SetStateAction<"error" | "information">>;
  };
};

const ActivePanelUserDeleteInitial: FC<ActivePanelUserDeleteInitialProps> = ({
  userData,
  userTeamRole,
  userTeamId,
  parentSnackbar,
}) => {
  const [deleteUserTeamBD, { isLoading }] = useDeleteUserTeamMutation();

  const [isOpenModalWindow, setIsOpenModalWindow] = useState<boolean>(false);
  const [textError, setTextError] = useState<string>("");
  const [isOpenSneckbar, setIsOpenSneckbar] = useState<boolean>(false);
  const [textSneckbar, setTextSneckbar] = useState<string>("");
  const [variantSneckbar, setVariantSneckbar] = useState<
    "error" | "information"
  >("information");

  const handleOpenModalWindow = () => {
    setIsOpenModalWindow(true);
  };

  const handleCloseModalWindow = () => {
    setIsOpenModalWindow(false);
  };

  const handleDeleteUser = async () => {
    const { error } = await deleteUserTeamBD({ userTeamId });

    if (error) {
      const myError = getErrorMessage(error);

      setVariantSneckbar("error");
      setTextSneckbar(myError);
      setIsOpenSneckbar(true);

      setTextError(myError);

      return;
    }

    parentSnackbar.setVariantSneckbar("information");
    parentSnackbar.setTextSneckbar("Юзер удалён");
    parentSnackbar.setIsOpenSneckbar(true);

    handleCloseModalWindow();
  };

  if (!userData || userTeamRole.trim().toLowerCase() === "owner") {
    return;
  }

  if (
    userData.userRole.trim().toLowerCase() === "admin" &&
    userTeamRole.trim().toLowerCase() === "admin"
  ) {
    return;
  }

  if (!Permissions.teamPageDelete.includes(userData.userRole)) {
    return;
  }

  return (
    <div className={style["container"]}>
      <Button onClick={handleOpenModalWindow} variant="error">
        Удалить юзера
      </Button>

      <ModalWindow
        isOpen={isOpenModalWindow}
        setIsOpen={setIsOpenModalWindow}
        title="Вы точно хотите удалить юзера ?"
        footer={textError && <p className={style["text-error"]}>{textError}</p>}
      >
        <div className={style["modal-buttons"]}>
          <Button
            onClick={handleDeleteUser}
            variant="primary"
            disabled={isLoading}
          >
            Да
          </Button>
          <Button onClick={handleCloseModalWindow} variant="error">
            Нет
          </Button>
        </div>
      </ModalWindow>

      <Snackbar
        open={isOpenSneckbar}
        setOpen={setIsOpenSneckbar}
        message={textSneckbar}
        variant={variantSneckbar}
      ></Snackbar>
    </div>
  );
};

export const ActivePanelUserDelete = memo(ActivePanelUserDeleteInitial);
