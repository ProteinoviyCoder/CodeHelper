"use client";

import style from "./activePanelDelete.module.scss";
import { Button } from "@/shared/ui/button/button";
import { ModalWindow } from "@/shared/ui/modalWindow/modalWindow";
import { Dispatch, FC, memo, SetStateAction, useState } from "react";
import { CgTrash } from "react-icons/cg";
import { useDeleteModuleMutation } from "../../api/modulesEndpoints";
import { User } from "@/entities/user/model/types";
import { Permissions } from "@/shared/model/config/permissions";
import { getErrorMessage } from "@/shared/model/lib/help";
import { Snackbar } from "@/shared/ui/snackbar/snackbar";

type ActivePanelDeleteInitialProps = {
  id: number;
  userData: User;
  parentSneckaber: {
    setTextSneckbar: Dispatch<SetStateAction<string>>;
    setVariantSneckbar: Dispatch<SetStateAction<"error" | "information">>;
    setIsOpenSneckbar: Dispatch<SetStateAction<boolean>>;
  };
};

const ActivePanelDeleteInitial: FC<ActivePanelDeleteInitialProps> = ({
  id,
  userData,
  parentSneckaber,
}) => {
  const [deleteModuleBD, { isLoading }] = useDeleteModuleMutation();

  const [isOpenModalWindow, setIsOpenModalWindow] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
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

  const handleDeleteModule = async () => {
    const { error } = await deleteModuleBD({ moduleId: id });

    if (error) {
      const myError = getErrorMessage(error);
      setErrorText(myError);

      setVariantSneckbar("error");
      setTextSneckbar(myError);
      setIsOpenSneckbar(true);

      return;
    }

    parentSneckaber.setTextSneckbar("Модуль удалён");
    parentSneckaber.setVariantSneckbar("information");
    parentSneckaber.setIsOpenSneckbar(true);

    setIsOpenModalWindow(false);
  };

  if (!userData || !Permissions.modulesPageDelete.includes(userData.userRole)) {
    return;
  }

  return (
    <div className={style["container"]}>
      <Button onClick={handleOpenModalWindow} variant="error">
        Удалить <CgTrash />
      </Button>

      <ModalWindow
        isOpen={isOpenModalWindow}
        setIsOpen={setIsOpenModalWindow}
        title="Вы точно хотите удалить этот модуль ?"
        footer={errorText && <p className={style["text-error"]}>{errorText}</p>}
      >
        <div className={style["modal-container"]}>
          <Button
            onClick={handleDeleteModule}
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

export const ActivePanelDelete = memo(ActivePanelDeleteInitial);
