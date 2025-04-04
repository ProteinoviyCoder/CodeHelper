"use client";

import { Loader } from "@/shared/ui/loader/loader";
import { useGetTeamQuery } from "../../api/teamEndpoints";
import style from "./teamList.module.scss";
import { FC, memo, useState } from "react";
import { TeamUser } from "../teamUser/teamUser";
import { User } from "@/entities/user/model/types";
import { Snackbar } from "@/shared/ui/snackbar/snackbar";

type TeamListInitialProps = {
  userData?: User;
};

const TeamListInitial: FC<TeamListInitialProps> = ({ userData }) => {
  const { data, isLoading } = useGetTeamQuery(null);

  const [isOpenSneckbar, setIsOpenSneckbar] = useState<boolean>(false);
  const [textSneckbar, setTextSneckbar] = useState<string>("");
  const [variantSneckbar, setVariantSneckbar] = useState<
    "error" | "information"
  >("information");

  if (isLoading) {
    return <Loader></Loader>;
  }

  return (
    <div className={style["list"]}>
      {data?.team.map((user) => {
        return (
          <TeamUser
            key={user.id}
            userData={userData}
            userTeam={user}
            parentSnackbar={{
              setIsOpenSneckbar,
              setTextSneckbar,
              setVariantSneckbar,
            }}
          ></TeamUser>
        );
      })}
      <Snackbar
        open={isOpenSneckbar}
        setOpen={setIsOpenSneckbar}
        message={textSneckbar}
        variant={variantSneckbar}
      ></Snackbar>
    </div>
  );
};

export const TeamList = memo(TeamListInitial);
