"use client";

import { ArchiveScriptType } from "@/features/archiveScript/model/types";
import style from "./myScripts.module.scss";
import { FC, memo, useEffect, useState } from "react";
import { ArchiveScript } from "@/features/archiveScript/ui/script/script";
import { ActiveScriptPanel } from "@/features/archiveScript/ui/activeScriptPanel/activeScriptPanel";
import { useGetAllScriptsQuery } from "../api/scriptsEndpoints";
import { Loader } from "@/shared/ui/loader/loader";
import { useAppSelector } from "@/shared/model/hooks";
import { Title } from "@/shared/ui/title/title";
import { Snackbar } from "@/shared/ui/snackbar/snackbar";
import { GiExitDoor } from "react-icons/gi";
import { AddNewTeamScript } from "@/features/archiveScript/ui/addNewTeamScript/addNewTeamScript";
import { ActivePanel } from "@/shared/ui/activePanel/activePanel";

const MyScriptsPageInitial: FC = () => {
  const [isOpenPanel, setIsOpenPanel] = useState<boolean>(false);
  const [activeScript, setActiveScript] = useState<ArchiveScriptType | null>(
    null
  );
  const [numberActiveScript, setNumberActiveScript] = useState<number>(1);
  const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false);

  const { userData } = useAppSelector((state) => state.user);

  const {
    data: scripts,
    error,
    isLoading,
  } = useGetAllScriptsQuery(null, {
    skip: !userData,
  });

  const myError =
    error && typeof error === "object" && "data" in error
      ? (error as unknown as { data: { message: string } }).data.message
      : null;

  const TeamScriptsHTML = (
    <>
      {!userData ? (
        <div className={style["error-container"]}>
          <Title size="s2">
            Для просмотра командных скриптов необходимо аутентифицироваться
          </Title>
          <GiExitDoor />
        </div>
      ) : error ? (
        <>
          <div className={style["error-container"]}>
            <Title size="s2">{myError ? myError : "Ошибка сервера"}</Title>
          </div>
          {myError && (
            <Snackbar
              message={myError}
              open={isOpenSnackbar}
              setOpen={setIsOpenSnackbar}
              variant="error"
            ></Snackbar>
          )}
        </>
      ) : (
        <>
          <AddNewTeamScript
            userData={userData ? userData : undefined}
          ></AddNewTeamScript>
          {scripts ? (
            <div className={style["scripts-container"]}>
              {scripts.allScripts.map((script) => {
                return (
                  <ArchiveScript
                    key={script.id}
                    setIsOpenPanel={setIsOpenPanel}
                    script={script}
                    setActiveScript={setActiveScript}
                    setNumberActiveScript={setNumberActiveScript}
                    isOpenPanel={isOpenPanel}
                  ></ArchiveScript>
                );
              })}
            </div>
          ) : (
            <div className={style["error-container"]}>
              <Title size="s2">Скриптов нет</Title>
            </div>
          )}
        </>
      )}
    </>
  );

  useEffect(() => {
    if (error !== undefined) {
      console.error(error);
    }

    const myError =
      error && typeof error === "object" && "data" in error
        ? (error as { status: number; data: { message: string } })
        : null;

    if (myError && myError.data.message) {
      setIsOpenSnackbar(true);
    }
  }, [error]);

  if (isLoading) {
    return <Loader></Loader>;
  }

  return (
    <div className={style["archive-container"]}>
      {TeamScriptsHTML}
      <ActivePanel
        isOpen={isOpenPanel}
        setIsOpen={setIsOpenPanel}
        onClick={() => setActiveScript(null)}
      >
        {activeScript && (
          <ActiveScriptPanel
            setIsOpenPanel={setIsOpenPanel}
            userData={userData ? userData : undefined}
            script={activeScript}
            numberActiveScript={numberActiveScript}
          ></ActiveScriptPanel>
        )}
      </ActivePanel>
    </div>
  );
};

export const MyScriptsPage = memo(MyScriptsPageInitial);
