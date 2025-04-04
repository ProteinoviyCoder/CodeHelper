"use client";

import { useAppSelector } from "@/shared/model/hooks";
import { Loader } from "@/shared/ui/loader/loader";
import { FC, memo, ReactNode, useEffect, useState } from "react";

type ThemeProviderInitialProps = {
  children: ReactNode;
};

const ThemeProviderInitial: FC<ThemeProviderInitialProps> = ({ children }) => {
  const { userData } = useAppSelector((state) => state.user);
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    const html = document.querySelector("html");
    if (!html) return;

    let themeMode = "light";
    let themeVariant = "theme-standart";
    const themeModeLocalStorage = localStorage.getItem("theme-mode");
    const themeVariantLocalStorage = localStorage.getItem("theme-variant");

    if (userData) {
      themeMode = userData.userTheme.themeMode;
      themeVariant = userData.userTheme.themeVariant;
    }

    if (!userData && themeModeLocalStorage !== null) {
      themeMode = JSON.parse(themeModeLocalStorage);
    }

    if (!userData && themeVariantLocalStorage !== null) {
      themeVariant = `${JSON.parse(themeVariantLocalStorage)}`;
    }

    const totalThemeMode =
      themeMode === "dark" ? "theme-dark-mode" : "theme-light-mode";

    html.className = `theme-${themeVariant} ${totalThemeMode} `;

    setThemeLoaded(true);
  }, [userData?.userTheme]);

  if (!themeLoaded) return <Loader></Loader>; // Фикс для мигалки темы
  return <>{children}</>;
};

export const ThemeProvider = memo(ThemeProviderInitial);
