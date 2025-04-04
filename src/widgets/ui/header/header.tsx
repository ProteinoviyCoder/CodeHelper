"use client";

import { FC, memo, useState } from "react";
import style from "./header.module.scss";
import { useAppDispatch, useAppSelector } from "@/shared/model/hooks";
import { usePathname, useRouter } from "next/navigation";
import { FiUser } from "react-icons/fi";
import { HiOutlineLogin } from "react-icons/hi";
import { AiOutlineMenuUnfold, AiOutlineMenuFold } from "react-icons/ai";
import Image from "next/image";
import { actionToggleSidebar } from "@/widgets/model/sidebar/sidebarSlice";

const HeaderInitial: FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { userData, isAuth: isAuthUser } = useAppSelector(
    (state) => state.user
  );
  const dispatch = useAppDispatch();

  const { isOpenSidebar } = useAppSelector((state) => state.sidebar);

  const divAuthUser = (
    <div
      onClick={() => router.push("/profile")}
      className={`${style["section-profile"]} ${
        pathname === "/profile" ? style["section-profile-active"] : ""
      }`}
    >
      <p>{userData?.username ? userData.username : userData?.userEmail} </p>
      <span
        className={`${
          userData?.userImg ? style["img-user"] : style["icon-user"]
        }`}
      >
        {userData?.userImg ? (
          <Image src={userData.userImg} alt="#" width={38} height={38}></Image>
        ) : (
          <FiUser />
        )}
      </span>
    </div>
  );

  const divNoAuthUser = (
    <div
      onClick={() => router.push("/signin")}
      className={`${style["section-profile"]} ${
        pathname === "/signin" ? style["section-profile-active"] : ""
      }`}
    >
      <p>Войти</p>{" "}
      <span className={style["icon-login"]}>{<HiOutlineLogin />}</span>
    </div>
  );

  return (
    <header className={style["header"]}>
      <div className={style["header-container"]}>
        <nav className={style["nav"]}>
          <div className={style["header_content"]}>
            <span
              onClick={() => {
                dispatch(actionToggleSidebar(isOpenSidebar ? false : true));
              }}
              className={style["icon-sidebar"]}
            >
              {isOpenSidebar ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
            </span>
          </div>
          <div className={style["header_content"]}>
            {isAuthUser ? divAuthUser : divNoAuthUser}
          </div>
        </nav>
      </div>
    </header>
  );
};

export const Header = memo(HeaderInitial);
