"use client";

import { ModuleGroups } from "@/features/modulesPageComponents/ui/moduleGroups/moduleGroups";
import style from "./modulesPage.module.scss";
import { FC, memo } from "react";
import { useAppSelector } from "@/shared/model/hooks";
import { ListModuleCards } from "@/features/modulesPageComponents/ui/listModuleCards/listModuleCards";
import { Title } from "@/shared/ui/title/title";
import { GiExitDoor } from "react-icons/gi";
import { AddNewModuleCard } from "@/features/modulesPageComponents/ui/addNewModuleCard/addNewModuleCard";

const ModulesPageInitial: FC = () => {
  const { userData } = useAppSelector((state) => state.user);

  if (!userData) {
    return (
      <div className={style["error-container"]}>
        <Title size="s2">
          Для просмотра модулей необходимо аутентифицироваться
        </Title>
        <GiExitDoor />
      </div>
    );
  }

  return (
    <div className={style["page-container"]}>
      <ModuleGroups userData={userData ? userData : undefined}></ModuleGroups>
      <AddNewModuleCard
        userData={userData ? userData : undefined}
      ></AddNewModuleCard>
      <ListModuleCards
        userData={userData ? userData : undefined}
      ></ListModuleCards>
    </div>
  );
};

export const ModulesPage = memo(ModulesPageInitial);
