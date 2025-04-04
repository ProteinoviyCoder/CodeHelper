"use client";

import { User } from "@/entities/user/model/types";
import style from "./addNewGroup.module.scss";
import { ChangeEvent, FC, memo, useState } from "react";
import { Permissions } from "@/shared/model/config/permissions";
import { ModuleGroupTab } from "../moduleGroupsTab/moduleGroupTab";
import { ModalWindow } from "@/shared/ui/modalWindow/modalWindow";
import { Input } from "@/shared/ui/input/input";
import { Button } from "@/shared/ui/button/button";
import { getErrorMessage } from "@/shared/model/lib/help";
import { useAddNewGroupMutation } from "../../api/modulesEndpoints";
import { Snackbar } from "@/shared/ui/snackbar/snackbar";

type AddNewGroupInitialProps = {
  userData?: User;
};

const AddNewGroupInitial: FC<AddNewGroupInitialProps> = ({ userData }) => {
  const [addNewGroupBD, { isLoading }] = useAddNewGroupMutation();

  const [isOpenModalWindow, setIsOpenModalWindow] = useState<boolean>(false);
  const [nameNewGroup, setNameNewGroup] = useState<string>("");
  const [errorNewGroup, setErrorNewGroup] = useState<string>("");
  const [isOpenSneckbar, setIsOpenSneckbar] = useState<boolean>(false);
  const [textSneckbar, setTextSneckbar] = useState<string>("");
  const [variantSneckbar, setVariantSneckbar] = useState<
    "error" | "information"
  >("information");

  const handleInputNewGroup = (e: ChangeEvent<HTMLInputElement>) => {
    if (errorNewGroup) {
      setErrorNewGroup("");
    }

    const text = e.target.value;
    const regex = /^[a-zA-Zа-яА-ЯёЁ0-9 \-]*$/;

    if (!regex.test(text)) {
      setErrorNewGroup("Недопустимый символ");
      return;
    }

    if (text.length > 20) {
      setErrorNewGroup("Максимальное кол-во символов 20");
      return;
    }

    setNameNewGroup(text);
  };

  const handleClearAll = () => {
    setErrorNewGroup("");
    setNameNewGroup("");
    setIsOpenModalWindow(false);
  };

  const handleCreateNewGroup = async () => {
    if (nameNewGroup.trim().length < 1) {
      setErrorNewGroup("Поле не может быть пустым");
    }

    const { error } = await addNewGroupBD({ newGroup: nameNewGroup });

    if (error) {
      const myError = getErrorMessage(error);
      setErrorNewGroup(myError);

      setVariantSneckbar("error");
      setTextSneckbar(myError);
      setIsOpenSneckbar(true);
      return;
    }

    setVariantSneckbar("information");
    setTextSneckbar("Группа создана");
    setIsOpenSneckbar(true);

    handleClearAll();
  };

  if (!userData || !Permissions.modulesPage.includes(userData.userRole)) {
    return;
  }
  return (
    <>
      <ModuleGroupTab
        onClick={() => setIsOpenModalWindow(true)}
        group="+"
      ></ModuleGroupTab>

      <ModalWindow
        isOpen={isOpenModalWindow}
        setIsOpen={setIsOpenModalWindow}
        title="Вы хотите создать новую группу ?"
      >
        <div className={style["modal-container"]}>
          <Input
            inputStyle={{
              backgroundColor: "var(--background-secondary-color)",
            }}
            placeholder="Новая группа"
            onChange={handleInputNewGroup}
            value={nameNewGroup}
            type="text"
            error={errorNewGroup}
          ></Input>

          <div className={style["modal-buttons"]}>
            <Button
              onClick={handleCreateNewGroup}
              variant="primary"
              disabled={isLoading}
            >
              Создать
            </Button>
            <Button onClick={handleClearAll} variant="error">
              Отменить
            </Button>
          </div>
        </div>
      </ModalWindow>
      <Snackbar
        open={isOpenSneckbar}
        setOpen={setIsOpenSneckbar}
        message={textSneckbar}
        variant={variantSneckbar}
      ></Snackbar>
    </>
  );
};

export const AddNewGroup = memo(AddNewGroupInitial);
