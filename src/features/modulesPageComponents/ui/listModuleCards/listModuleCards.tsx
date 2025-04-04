"use client";

import style from "./listModuleCards.module.scss";
import { ModuleCardType } from "../../model/types";
import { ModuleCard } from "../moduleCard/moduleCard";
import { FC, memo, useEffect, useState } from "react";
import { useAppSelector } from "@/shared/model/hooks";
import { useGetAllModulesQuery } from "../../api/modulesEndpoints";
import { User } from "@/entities/user/model/types";
import { Snackbar } from "@/shared/ui/snackbar/snackbar";
import { Loader } from "@/shared/ui/loader/loader";

type ListModuleCardsInitialProps = {
  userData?: User;
};

const ListModuleCardsInitial: FC<ListModuleCardsInitialProps> = ({
  userData,
}) => {
  const activeGroup = useAppSelector(
    (state) => state.modulesGroups.activeGroup
  );

  const { data, isLoading } = useGetAllModulesQuery(null);

  const [cuurentModulesCards, setCuurentModulesCards] = useState<
    ModuleCardType[] | undefined
  >(data?.modules);
  const [isOpenSneckbar, setIsOpenSneckbar] = useState<boolean>(false);
  const [textSneckbar, setTextSneckbar] = useState<string>("");
  const [variantSneckbar, setVariantSneckbar] = useState<
    "error" | "information"
  >("information");

  const filterModuleCardsByGroup = (
    moduleCards: ModuleCardType[]
  ): ModuleCardType[] => {
    return moduleCards.filter((card) => card.groups.includes(activeGroup));
  };

  useEffect(() => {
    if (!data) return;

    const filterCards = filterModuleCardsByGroup(data.modules);
    setCuurentModulesCards(filterCards);
  }, [activeGroup, data]);

  if (isLoading) {
    return <Loader></Loader>;
  }

  return (
    <div className={style["list-card"]}>
      {cuurentModulesCards &&
        cuurentModulesCards.map((card) => {
          return (
            <ModuleCard
              key={card.id}
              userData={userData}
              card={card}
              parentSneckaber={{
                setIsOpenSneckbar,
                setVariantSneckbar,
                setTextSneckbar,
              }}
            ></ModuleCard>
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

export const ListModuleCards = memo(ListModuleCardsInitial);
