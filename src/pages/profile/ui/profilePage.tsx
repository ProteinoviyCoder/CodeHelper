"use client";

import { FC, memo, useEffect } from "react";
import style from "./profilePage.module.scss";
import { ProfileUserInfoText } from "@/features/profile/ui/profileUserInfoText/profileUserInfoText";
import { UserInfoImg } from "@/features/profile/ui/userInfoImg/userInfoImg";
import { UserInfoTheme } from "@/features/profile/ui/userInfoTheme/userInfoTheme";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/shared/model/hooks";
import { Loader } from "@/shared/ui/loader/loader";

const ProfilePageInitial: FC = () => {
  const { userData } = useAppSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!userData) {
      router.replace("/signin");
    }
  }, []);

  if (!userData) {
    return <Loader></Loader>;
  }

  return (
    <section className={style["section-profile"]}>
      <div className={style["user-info"]}>
        <UserInfoImg></UserInfoImg>
        <div className={style["user-info_content"]}>
          <ProfileUserInfoText></ProfileUserInfoText>
        </div>
        <div className={style["user-info_content"]}>
          <UserInfoTheme></UserInfoTheme>
        </div>
      </div>
    </section>
  );
};

export const ProfilePage = memo(ProfilePageInitial);
