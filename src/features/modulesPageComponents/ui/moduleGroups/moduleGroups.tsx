"use client";

import { useGetAllGroupsQuery } from "../../api/modulesEndpoints";
import style from "./moduleGroups.module.scss";
import { FC, memo, useEffect, useState } from "react";
import { User } from "@/entities/user/model/types";
import { ModuleGroupTab } from "../moduleGroupsTab/moduleGroupTab";
import { AddNewGroup } from "../addNewGroup/addNewGroup";
import { useAppDispatch, useAppSelector } from "@/shared/model/hooks";
import {
  actionSetCurrentGroup,
  actionSetGroups,
} from "../../model/moduleGroupsSlice";
import { Snackbar } from "@/shared/ui/snackbar/snackbar";

type ModuleGroupsInitialProps = {
  userData?: User;
};

const ModuleGroupsInitial: FC<ModuleGroupsInitialProps> = ({ userData }) => {
  const dispatch = useAppDispatch();
  const activeGroup = useAppSelector(
    (state) => state.modulesGroups.activeGroup
  );
  const { data } = useGetAllGroupsQuery(null, { skip: !userData });

  const [currentGroup, setCuurentGroup] = useState<string>(activeGroup);
  const [isOpenSneckbar, setIsOpenSneckbar] = useState<boolean>(false);
  const [textSneckbar, setTextSneckbar] = useState<string>("");
  const [variantSneckbar, setVariantSneckbar] = useState<
    "error" | "information"
  >("information");

  const handleChangeCuurentGroup = (text: string) => {
    setCuurentGroup(text);
    dispatch(actionSetCurrentGroup(text));
  };

  useEffect(() => {
    if (data) {
      dispatch(actionSetGroups(data.groups));
    }
  }, [data]);

  return (
    <div className={style["groups-container"]}>
      <ModuleGroupTab
        group="Все"
        onClick={() => handleChangeCuurentGroup("Все")}
        className={currentGroup === "Все" ? style["group-active"] : ""}
      ></ModuleGroupTab>
      {data &&
        data.groups.map((group) => {
          return (
            <ModuleGroupTab
              key={group.id}
              className={
                currentGroup === group.group ? style["group-active"] : ""
              }
              userData={userData}
              group={group.group}
              onClick={() => handleChangeCuurentGroup(group.group)}
              setCurrentGroup={handleChangeCuurentGroup}
              parentSneckaber={{
                setIsOpenSneckbar,
                setTextSneckbar,
                setVariantSneckbar,
              }}
            ></ModuleGroupTab>
          );
        })}
      <AddNewGroup userData={userData}></AddNewGroup>

      <Snackbar
        open={isOpenSneckbar}
        setOpen={setIsOpenSneckbar}
        message={textSneckbar}
        variant={variantSneckbar}
      ></Snackbar>
    </div>
  );
};

export const ModuleGroups = memo(ModuleGroupsInitial);
