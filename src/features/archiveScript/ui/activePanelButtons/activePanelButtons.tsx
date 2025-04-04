"use client";

import style from "./activePanelButtons.module.scss";
import { Dispatch, FC, memo, SetStateAction, useState } from "react";
import { Button } from "@/shared/ui/button/button";
import { CgTrash } from "react-icons/cg";
import { ArchiveScriptButton } from "../../model/types";
import { Snackbar } from "@/shared/ui/snackbar/snackbar";
import { ModalWindow } from "@/shared/ui/modalWindow/modalWindow";
import { useDeleteScriptMutation } from "../../api/activePanelEndpoints";
import { getErrorMessage } from "@/shared/model/lib/help";
import { Permissions } from "@/shared/model/config/permissions";
import { User } from "@/entities/user/model/types";

type ActivePanelButtonsInitialProps = {
  buttons: ArchiveScriptButton[];
  scriptId: number;
  userData?: User;
  setIsOpenPanel: Dispatch<SetStateAction<boolean>>;
};

const ActivePanelButtonsInitial: FC<ActivePanelButtonsInitialProps> = ({
  buttons,
  scriptId,
  userData,
  setIsOpenPanel,
}) => {
  const [isOpenSneckbar, setIsOpenSneckbar] = useState<boolean>(false);
  const [textSneckbar, setTextSneckbar] = useState<string>("");
  const [variantSneckbar, setVariantSneckbar] = useState<
    "error" | "information"
  >("information");
  const [isOpenModalWindow, setIsOpenModalWindow] = useState<boolean>(false);

  const [handleDeleteScriptBD, { isLoading }] = useDeleteScriptMutation();

  const handleDeleteScript = async () => {
    const { error } = await handleDeleteScriptBD({ scriptId });

    if (error) {
      console.error(error);

      const myError = getErrorMessage(error);

      setVariantSneckbar("error");
      setTextSneckbar(myError);
      setIsOpenSneckbar(true);
    }

    if (!error) {
      setVariantSneckbar("information");
      setTextSneckbar("Скрипт удалён");
      setIsOpenSneckbar(true);
      setIsOpenPanel(false);
    }

    setIsOpenModalWindow(false);
  };

  return (
    <div className={style["buttons-container"]}>
      {userData &&
        Permissions.activePanelDelete.includes(userData.userRole) && (
          <div className={style["delete-btn-container"]}>
            <Button
              onClick={() => {
                setIsOpenModalWindow(true);
              }}
              customClass={style["btn-icon"]}
              variant="error"
            >
              <CgTrash /> Удалить
            </Button>
          </div>
        )}
      <div className={style["copy-btn-container"]}>
        <p>Получить:</p>
        <div className={style["copy-btn-container_buttons"]}>
          {buttons.map((button) => {
            return (
              <Button
                key={button.id}
                variant="secondary"
                onClick={() => {
                  setVariantSneckbar("information");
                  setTextSneckbar(`Скопиравано: ${button.buttonText}`);
                  setIsOpenSneckbar(true);
                  navigator.clipboard.writeText(button.script);
                }}
              >
                {button.buttonText}
              </Button>
            );
          })}
        </div>
      </div>
      <Snackbar
        open={isOpenSneckbar}
        setOpen={setIsOpenSneckbar}
        message={textSneckbar}
        variant={variantSneckbar}
      ></Snackbar>
      {userData &&
        Permissions.activePanelDelete.includes(userData.userRole) && (
          <ModalWindow
            isOpen={isOpenModalWindow}
            setIsOpen={setIsOpenModalWindow}
            title="Вы точно хотите удалить скрипт ?"
          >
            <div className={style["modal-buttons"]}>
              <Button
                variant="primary"
                onClick={handleDeleteScript}
                disabled={isLoading}
              >
                Да
              </Button>
              <Button
                onClick={() => setIsOpenModalWindow(false)}
                variant="error"
              >
                Нет
              </Button>
            </div>
          </ModalWindow>
        )}
    </div>
  );
};

export const ActivePanelButtons = memo(ActivePanelButtonsInitial);
