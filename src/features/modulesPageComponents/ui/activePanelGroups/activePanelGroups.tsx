"use client";

import { Dropdown } from "@/shared/ui/dropdown/dropdown";
import style from "./activePanelGroups.module.scss";
import { FC, memo, MouseEvent, useState } from "react";
import { useAppSelector } from "@/shared/model/hooks";
import { AiOutlineClose, AiFillEdit } from "react-icons/ai";
import { Button } from "@/shared/ui/button/button";
import { Title } from "@/shared/ui/title/title";
import { useUpdateGroupsModuleMutation } from "../../api/modulesEndpoints";
import { getErrorMessage } from "@/shared/model/lib/help";
import { Snackbar } from "@/shared/ui/snackbar/snackbar";

type ActivePanelGroupsInitialProps = {
  id: number;
  groups: string[];
};

const ActivePanelGroupsInitial: FC<ActivePanelGroupsInitialProps> = ({
  id,
  groups,
}) => {
  const moduleGroups = useAppSelector((state) => state.modulesGroups.groups);
  const [updateGroupsModule, { isLoading }] = useUpdateGroupsModuleMutation();

  const [cuurentGroups, setCurrentGroups] = useState<string[]>(groups);
  const [isChangeMode, setIsChangeMode] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const [isOpenSneckbar, setIsOpenSneckbar] = useState<boolean>(false);
  const [textSneckbar, setTextSneckbar] = useState<string>("");
  const [variantSneckbar, setVariantSneckbar] = useState<
    "error" | "information"
  >("information");

  const handleChangeModeOn = () => {
    setIsChangeMode(true);
  };

  const handleDeelteGroup = (word: string) => {
    if (cuurentGroups === null) return;
    setCurrentGroups((prev) =>
      prev!.filter(
        (group) => group.trim().toLowerCase() !== word.trim().toLowerCase()
      )
    );
  };

  const handleAddGroup = (e: MouseEvent<HTMLLIElement>) => {
    const addedGroup = e.currentTarget.textContent;
    if (typeof addedGroup !== "string") return;

    if (errorText) {
      setErrorText("");
    }

    if (addedGroup.trim().length < 1) {
      setErrorText("Группа не может быть пустой");
      return;
    }

    if (addedGroup.length > 20) {
      setErrorText("Максимальное кол-во символов для название группы 20");
      return;
    }

    const isUniqueGroup = cuurentGroups?.find(
      (group) => group.trim().toLowerCase() === addedGroup?.trim().toLowerCase()
    );

    if (isUniqueGroup) {
      setErrorText("Такая группа уже есть");
      return;
    }

    setCurrentGroups((prev) => (prev ? [...prev, addedGroup] : [addedGroup]));
  };

  const handleCancelChanges = () => {
    moduleGroups ? moduleGroups.map((group) => group.group) : null;
    setErrorText("");
    setIsChangeMode(false);
  };

  const handleChangeGroupsModule = async () => {
    const { error } = await updateGroupsModule({
      moduleId: id,
      newGroups: cuurentGroups,
    });

    if (error) {
      const myError = getErrorMessage(error);
      setErrorText(myError);

      setVariantSneckbar("error");
      setTextSneckbar(myError);
      setIsOpenSneckbar(true);

      return;
    }

    setVariantSneckbar("information");
    setTextSneckbar("Группы модуля изменены");
    setIsOpenSneckbar(true);

    if (errorText) setErrorText("");

    setIsChangeMode(false);
  };
  return (
    <div className={style["container"]}>
      <Title size="s2" style={{ marginBottom: "7px" }}>
        Группы:
      </Title>
      <div className={style["groups-container"]}>
        {!isChangeMode && (
          <Button onClick={handleChangeModeOn} variant="secondary">
            <AiFillEdit />
          </Button>
        )}
        <ul className={style["group-list"]}>
          {cuurentGroups.map((group) => {
            return (
              <li key={group} className={style["group-item"]}>
                {group}{" "}
                {isChangeMode && group !== "Все" && (
                  <AiOutlineClose onClick={() => handleDeelteGroup(group)} />
                )}
              </li>
            );
          })}
        </ul>
      </div>
      {isChangeMode && (
        <div className={style["change-mode-buttons"]}>
          <Dropdown
            buttonText="Добавить группу"
            variants={
              moduleGroups ? moduleGroups.map((group) => group.group) : null
            }
            dontChangeBtnText={true}
            onChange={handleAddGroup}
          ></Dropdown>
          <Button
            onClick={handleChangeGroupsModule}
            variant="secondary"
            disabled={isLoading}
          >
            Сохранить
          </Button>
          <Button onClick={handleCancelChanges} variant="error">
            Отменить
          </Button>
        </div>
      )}
      {errorText && <p className={style["error-text"]}>{errorText}</p>}
      <Snackbar
        open={isOpenSneckbar}
        setOpen={setIsOpenSneckbar}
        message={textSneckbar}
        variant={variantSneckbar}
      ></Snackbar>
    </div>
  );
};

export const ActivePanelGroups = memo(ActivePanelGroupsInitial);
