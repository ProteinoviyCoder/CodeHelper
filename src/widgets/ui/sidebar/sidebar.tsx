"use client";

import style from "./sidebar.module.scss";
import { FC, memo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { HiFolder } from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "@/shared/model/hooks";
import { actionToggleSidebar } from "@/widgets/model/sidebar/sidebarSlice";
import { useLogout } from "@/shared/model/hooks/useLogout";
import {
  HiOutlineLogin,
  HiOutlineLogout,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { LuBoxes } from "react-icons/lu";

const SidebarInitital: FC = () => {
  const handleLogout = useLogout();
  const currentPathname = usePathname();
  const router = useRouter();
  const { isOpenSidebar } = useAppSelector((state) => state.sidebar);
  const { userData } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  const asideSections = [
    {
      name: "Модули",
      pathname: "/",
      icon: <LuBoxes />,
    },
    {
      name: "Скрипты",
      pathname: "/my-scripts",
      icon: <HiFolder />,
    },
    {
      name: "Команда",
      pathname: "/team",
      icon: <HiOutlineUserGroup />,
    },
    {
      name: userData ? "Выйти" : "Войти",
      pathname: "/signin",
      icon: userData ? (
        <span className={style["icon-logout"]}>
          <HiOutlineLogout />
        </span>
      ) : (
        <span className={style["icon-login"]}>
          <HiOutlineLogin />
        </span>
      ),
    },
  ];

  return (
    <aside
      className={`${style["sidebar"]} ${isOpenSidebar ? style["active"] : ""}`}
      onClick={() => {
        dispatch(actionToggleSidebar(false));
      }}
    >
      <ul className={style["nav-list"]} onClick={(e) => e.stopPropagation()}>
        {asideSections.map((section) => {
          return (
            <li key={section.pathname} className={style["nav-list_item"]}>
              <span
                onClick={async () => {
                  if (isOpenSidebar) {
                    dispatch(actionToggleSidebar(false));
                  }
                  if (section.name === "Выйти") {
                    await handleLogout();
                  } else {
                    router.push(section.pathname);
                  }
                }}
                className={`${style["icon"]}  ${
                  section.pathname === currentPathname
                    ? style["icon-active"]
                    : ""
                }`}
              >
                {section.icon}
              </span>
              <p className={style["text"]}>{section.name}</p>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export const Sidebar = memo(SidebarInitital);
