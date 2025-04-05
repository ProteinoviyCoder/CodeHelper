"use client";

import style from "./teamPage.module.scss";
import { Title } from "@/shared/ui/title/title";
import { GiExitDoor } from "react-icons/gi";
import { FC, memo } from "react";
import { useAppSelector } from "@/shared/model/hooks";
import { TeamList } from "@/features/team/ui/teamList/teamList";
import { SettingPanel } from "@/features/team/ui/settingPanel/settingPanel";

const TeamPageInitial: FC = () => {
  const { userData } = useAppSelector((state) => state.user);

  if (!userData) {
    return (
      <div className={style["error-container"]}>
        <Title size="s2">
          Для просмотра команды необходимо аутентифицироваться
        </Title>
        <GiExitDoor />
      </div>
    );
  }
  return (
    <div className={style["page-container"]}>
      <SettingPanel
        userData={userData === null ? undefined : userData}
      ></SettingPanel>
      <TeamList userData={userData ? userData : undefined}></TeamList>
    </div>
  );
};

export const TeamPage = memo(TeamPageInitial);
