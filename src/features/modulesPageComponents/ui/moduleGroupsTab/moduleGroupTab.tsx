"use client";

import { Button } from "@/shared/ui/button/button";
import style from "./moduleGroupsTab.module.scss";
import { Dispatch, FC, memo, SetStateAction, useState } from "react";
import { User } from "@/entities/user/model/types";
import { Permissions } from "@/shared/model/config/permissions";
import { ModalWindow } from "@/shared/ui/modalWindow/modalWindow";
import { useDeleteGroupMutation } from "../../api/modulesEndpoints";
import { getErrorMessage } from "@/shared/model/lib/help";
import { Snackbar } from "@/shared/ui/snackbar/snackbar";
import { CgTrash } from "react-icons/cg";

type ModuleGroupTabInitialProps = {
  userData?: User;
  onClick: () => void;
  group: string;
  className?: string;
  setCurrentGroup?: (string: string) => void;
  parentSneckaber?: {
    setIsOpenSneckbar: Dispatch<SetStateAction<boolean>>;
    setTextSneckbar: Dispatch<SetStateAction<string>>;
    setVariantSneckbar: Dispatch<SetStateAction<"error" | "information">>;
  };
};

const ModuleGroupTabInitial: FC<ModuleGroupTabInitialProps> = ({
  userData,
  onClick,
  group,
  className: customClass,
  setCurrentGroup,
  parentSneckaber,
}) => {
  const [deleteGroupBD, { isLoading }] = useDeleteGroupMutation();

  const [isOpenModalWindow, setIsOpenModalWindow] = useState<boolean>(false);
  const [isOpenSneckbar, setIsOpenSneckbar] = useState<boolean>(false);
  const [textSneckbar, setTextSneckbar] = useState<string>("");

  const handleDeleteGroup = async () => {
    const { error } = await deleteGroupBD({ group });

    if (error) {
      const myError = getErrorMessage(error);

      setTextSneckbar(myError);
      setIsOpenSneckbar(true);
      return;
    }

    if (setCurrentGroup !== undefined) {
      setCurrentGroup("Все");
    }
    if (parentSneckaber) {
      parentSneckaber.setIsOpenSneckbar(true);
      parentSneckaber.setTextSneckbar("Группа удалена");
      parentSneckaber.setVariantSneckbar("information");
    }
  };

  return (
    <div
      onClick={onClick}
      className={`${style["group"]} ${customClass ? customClass : ""}`}
    >
      <p>{group}</p>
      {userData &&
        Permissions.modulesPageDelete.includes(userData.userRole) && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpenModalWindow(true);
            }}
            variant="error"
            title="Удалить"
          >
            <CgTrash />
          </Button>
        )}

      {userData &&
        Permissions.modulesPageDelete.includes(userData.userRole) && (
          <ModalWindow
            isOpen={isOpenModalWindow}
            setIsOpen={setIsOpenModalWindow}
            title={`Вы хотите удалить группу "${group}"`}
          >
            <div className={style["modal-buttons"]}>
              <Button
                onClick={handleDeleteGroup}
                variant="primary"
                disabled={isLoading}
              >
                Удалить
              </Button>
              <Button
                onClick={() => setIsOpenModalWindow(false)}
                variant="error"
              >
                Отменить
              </Button>
            </div>
          </ModalWindow>
        )}
      <Snackbar
        open={isOpenSneckbar}
        setOpen={setIsOpenSneckbar}
        message={textSneckbar}
        variant="error"
      ></Snackbar>
    </div>
  );
};

export const ModuleGroupTab = memo(ModuleGroupTabInitial);
