"use client";

import style from "./moduleCard.module.scss";
import { Dispatch, FC, memo, SetStateAction, useState } from "react";
import { ModuleCardType } from "../../model/types";
import { Title } from "@/shared/ui/title/title";
import { Button } from "@/shared/ui/button/button";
import { ModalImg } from "@/shared/ui/modalImg/modalImg";
import { Snackbar } from "@/shared/ui/snackbar/snackbar";
import { getErrorMessage } from "@/shared/model/lib/help";
import { ActivePanel } from "@/shared/ui/activePanel/activePanel";
import { Permissions } from "@/shared/model/config/permissions";
import { User } from "@/entities/user/model/types";
import { AiFillEdit } from "react-icons/ai";
import { ActivePanelTitle } from "../activePanelTitle/activePanelTitle";
import { ActivePanelImg } from "../activePanelImg/activePanelImg";
import { ActivePanelCode } from "../activePanelCode/activePanelCode";
import { ActivePanelGroups } from "../activePanelGroups/activePanelGroups";
import { ActivePanelDelete } from "../activePanelDelete/activePanelDelete";

type ModuleCardInitialProps = {
  card: ModuleCardType;
  onClick?: () => void;
  userData?: User;
  parentSneckaber: {
    setTextSneckbar: Dispatch<SetStateAction<string>>;
    setVariantSneckbar: Dispatch<SetStateAction<"error" | "information">>;
    setIsOpenSneckbar: Dispatch<SetStateAction<boolean>>;
  };
};

const ModuleCardInitial: FC<ModuleCardInitialProps> = ({
  card,
  onClick: onClickCard,
  userData,
  parentSneckaber,
}) => {
  const [isOpenModalImg, setIsOpenModalImg] = useState<boolean>(false);
  const [isOpenSneckbar, setIsOpenSneckbar] = useState<boolean>(false);
  const [textSneckbar, setTextSneckbar] = useState<string>("");
  const [variantSneckbar, setVariantSneckbar] = useState<
    "error" | "information"
  >("information");
  const [isOpenPanel, setIsOpenPanel] = useState<boolean>(false);

  const handleOpenImg = () => {
    setIsOpenModalImg(true);
  };

  const handleOpenActivePanel = () => {
    setIsOpenPanel(true);
  };

  const handleCopyModeuleCode = async (code: string) => {
    setTextSneckbar(`Модуль скопирован`);
    setVariantSneckbar("information");
    setIsOpenSneckbar(true);
    if (onClickCard !== undefined) {
      onClickCard();
    }
    try {
      await navigator.clipboard.writeText(code);
    } catch (error) {
      const myError = getErrorMessage(error);
      setTextSneckbar(myError);
      setVariantSneckbar("error");
      setIsOpenSneckbar(true);
    }
  };
  return (
    <div className={style["card"]}>
      {userData && Permissions.modulesPage.includes(userData.userRole) && (
        <div className={style["container-change"]}>
          <Button onClick={handleOpenActivePanel} variant="primary">
            <AiFillEdit />
          </Button>
        </div>
      )}
      {/* <Image onClick={handleOpenImg} className={style["card-img"]} width={120} height={100} src={card.img} title="Увеличить" alt="#"></Image>
       */}
      <img
        onClick={handleOpenImg}
        className={style["card-img"]}
        src={card.img ? card.img : "./default-module.png"}
        title="Увеличить"
        alt="#"
      />
      <Title size="s1">{card.name}</Title>
      <Button
        onClick={() => handleCopyModeuleCode(card.code)}
        variant="secondary"
      >
        Получить модуль
      </Button>

      <ModalImg
        src={card.img ? card.img : "./default-module.png"}
        isOpen={isOpenModalImg}
        setIsOpen={setIsOpenModalImg}
      ></ModalImg>

      <Snackbar
        open={isOpenSneckbar}
        setOpen={setIsOpenSneckbar}
        message={textSneckbar}
        variant={variantSneckbar}
      ></Snackbar>

      {userData && Permissions.modulesPage.includes(userData.userRole) && (
        <ActivePanel isOpen={isOpenPanel} setIsOpen={setIsOpenPanel}>
          <div className={style["active-panel-container"]}>
            <ActivePanelTitle id={card.id} title={card.name}></ActivePanelTitle>
            <ActivePanelImg id={card.id} img={card.img}></ActivePanelImg>
            <ActivePanelCode id={card.id} code={card.code}></ActivePanelCode>
            <ActivePanelGroups
              id={card.id}
              groups={card.groups}
            ></ActivePanelGroups>
            <ActivePanelDelete
              id={card.id}
              userData={userData}
              parentSneckaber={parentSneckaber}
            ></ActivePanelDelete>
          </div>
        </ActivePanel>
      )}
    </div>
  );
};

export const ModuleCard = memo(ModuleCardInitial);
