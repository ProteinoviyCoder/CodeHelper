import { SettingPanelAddNewUser } from "../settingPanelAddNewUser/settingPanelAddNewUser";
import style from "./settingPanel.module.scss";
import { FC, memo } from "react";

const SettingPanelInitial: FC = () => {
  return (
    <div className={style["container-setting"]}>
      <SettingPanelAddNewUser></SettingPanelAddNewUser>
    </div>
  );
};

export const SettingPanel = memo(SettingPanelInitial);
