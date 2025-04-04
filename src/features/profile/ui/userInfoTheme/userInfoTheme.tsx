"use client";

import React, { FC, memo, useEffect, useState } from "react";
import style from "./userInfoTheme.module.scss";
import { Switch } from "@/shared/ui/switch/switch";
import { Title } from "@/shared/ui/title/title";
import { HiSun, HiMoon } from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "@/shared/model/hooks";
import {
  actionChangeUserThemeMode,
  actionChangeUserThemeVariant,
} from "@/entities/user/model/userSlice";
import { Dropdown } from "@/shared/ui/dropdown/dropdown";
import { useChangeUserThemeMutation } from "../../api/userInfoEndpoints";

const UserInfoThemeInitial: FC = () => {
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector((state) => state.user);

  const [changeThemeBD] = useChangeUserThemeMutation();

  const [isSwitch, setIsSwitch] = useState<boolean>(false);
  const [nameThemeVariant, setNameThemeVariant] = useState<string>("standart");

  const handleChangeThemeMode = async () => {
    const html = document.querySelector("html");
    if (!html) return;

    let themeVariant = "theme-standart";
    let themeMode = !isSwitch ? "dark" : "light";
    const themeVariantLocalStorage = localStorage.getItem("theme-variant");

    if (userData) {
      themeVariant = userData.userTheme.themeVariant;
    } else if (themeVariantLocalStorage !== null) {
      themeVariant = JSON.parse(themeVariantLocalStorage);
    }

    localStorage.setItem("theme-mode", JSON.stringify(themeMode));
    dispatch(actionChangeUserThemeMode(themeMode));

    setIsSwitch(!isSwitch);

    html.className = `theme-${themeVariant} theme-${themeMode}-mode`;

    changeThemeBD({
      userId: userData!.id,
      themeMode,
      themeVariant,
    });
  };

  const handleChangeThemeVariant = async (
    e: React.MouseEvent<HTMLLIElement>
  ) => {
    const html = document.querySelector("html");
    if (!html) return;

    let themeMode = "light";
    const themeVariant = e.currentTarget.textContent;
    const modeLocalStorage = localStorage.getItem("theme-mode");

    if (userData) {
      themeMode = userData.userTheme.themeMode;
    } else if (modeLocalStorage !== null) {
      themeMode = JSON.parse(modeLocalStorage);
    }

    if (themeVariant === null) {
      return;
    }

    dispatch(actionChangeUserThemeVariant(`${themeVariant}`));
    localStorage.setItem("theme-variant", JSON.stringify(`${themeVariant}`));

    html.className = `theme-${themeVariant} theme-${themeMode}-mode`;

    changeThemeBD({
      userId: userData!.id,
      themeMode,
      themeVariant,
    });
  };

  useEffect(() => {
    let themeMode;
    let themeVariant;
    if (!userData) {
      const themeModeJSON = localStorage.getItem("theme-mode");
      const themeVariantJSON = localStorage.getItem("theme-variant");

      themeMode =
        themeModeJSON !== null && JSON.parse(themeModeJSON) === "dark"
          ? true
          : false;

      themeVariant =
        themeVariantJSON !== null ? JSON.parse(themeVariantJSON) : "standart";
    } else {
      localStorage.setItem(
        "theme-mode",
        JSON.stringify(userData.userTheme.themeMode)
      );
      localStorage.setItem(
        "theme-variant",
        JSON.stringify(userData.userTheme.themeVariant)
      );
      themeMode = userData.userTheme.themeMode === "dark" ? true : false;
      themeVariant = userData.userTheme.themeVariant;
    }

    setNameThemeVariant(themeVariant);
    setIsSwitch(themeMode);
  }, []);
  return (
    <div className={style["theme-container"]}>
      <Title size="s2">Настройки темы:</Title>
      <div className={style["setting-container"]}>
        <div className={style["dropdown-container"]}>
          <Dropdown
            buttonText={nameThemeVariant}
            variants={["standart", "orange", "space", "wine", "brown"]}
            nameDropdown="Тема"
            onChange={handleChangeThemeVariant}
          ></Dropdown>
        </div>
        <div className={style["swither-container"]}>
          <HiSun />
          <Switch
            isSwitch={isSwitch}
            onClick={() => handleChangeThemeMode()}
          ></Switch>
          <HiMoon />
        </div>
      </div>
    </div>
  );
};

export const UserInfoTheme = memo(UserInfoThemeInitial);
