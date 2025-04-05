import { User } from "@/entities/user/model/types";
import { SettingPanelAddNewUser } from "../settingPanelAddNewUser/settingPanelAddNewUser";
import style from "./settingPanel.module.scss";
import { FC, memo } from "react";
import { Permissions } from "@/shared/model/config/permissions";

type SettingPanelInitialProps = {
  userData?: User;
};

const SettingPanelInitial: FC<SettingPanelInitialProps> = ({ userData }) => {
  return (
    <div className={style["container-setting"]}>
      {userData && Permissions.teamPageCreate.includes(userData.userRole) && (
        <SettingPanelAddNewUser></SettingPanelAddNewUser>
      )}
    </div>
  );
};

export const SettingPanel = memo(SettingPanelInitial);
