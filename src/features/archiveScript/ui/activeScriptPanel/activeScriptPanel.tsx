"use client";

import { Dispatch, FC, memo, SetStateAction, useEffect, useState } from "react";
import style from "./activeScriptPanel.module.scss";
import { ArchiveScriptType } from "../../model/types";
import { ActivePanelTitle } from "../activePanelTitle/activePanelTitle";
import { User } from "@/entities/user/model/types";
import { ActivePanelDescription } from "../activePanelDescription/activePanelDescription";
import { ActivePanelCode } from "../activePanelCode/activePanelCode";
import { ActivePanelButtons } from "../activePanelButtons/activePanelButtons";

type ActiveScriptPanelInitialProps = {
  script: ArchiveScriptType;
  numberActiveScript: number;
  userData?: User;
  setIsOpenPanel: Dispatch<SetStateAction<boolean>>;
};

const ActiveScriptPanelInitial: FC<ActiveScriptPanelInitialProps> = ({
  script,
  numberActiveScript,
  userData,
  setIsOpenPanel,
}) => {
  const [currentVersion, setCurrentVersion] =
    useState<number>(numberActiveScript);
  const [currentTab, setCurrentTab] = useState<string>("Описание");
  const [currentIndexBtn, setCurrentIndexBtn] = useState<number>(0);

  const tabs = [
    {
      nameTab: "Описание",
    },
    {
      nameTab: "Код",
    },
  ];

  useEffect(() => {
    setCurrentVersion(numberActiveScript);
  }, [numberActiveScript]);

  return (
    <div className={style["active-panel"]}>
      <div className={style["active-panel__main"]}>
        <ActivePanelTitle
          title={script.versions[currentVersion - 1].name}
          userData={userData}
          scriptId={script.id}
          versionId={script.versions[currentVersion - 1].id}
        ></ActivePanelTitle>

        <div className={style["info-tabs"]}>
          {tabs.map((tab) => {
            return (
              <div
                key={tab.nameTab}
                onClick={() => setCurrentTab(tab.nameTab)}
                className={`${style["info-tab"]} ${
                  currentTab === tab.nameTab ? style["info-tab-active"] : ""
                }`}
              >
                {tab.nameTab}
              </div>
            );
          })}
        </div>
        <div className={style["info-container"]}>
          {currentTab === "Описание" ? (
            <ActivePanelDescription
              description={script.versions[currentVersion - 1].description}
              scriptId={script.id}
              versionId={script.versions[currentVersion - 1].id}
              userData={userData}
            ></ActivePanelDescription>
          ) : (
            <ActivePanelCode
              buttons={script.versions[currentVersion - 1].buttons}
              currentIndexBtn={currentIndexBtn}
              setCurrentIndexBtn={setCurrentIndexBtn}
              currentTab={currentTab}
              currentVersion={currentVersion}
              userData={userData}
              scriptId={script.id}
              versionId={script.versions[currentVersion - 1].id}
            ></ActivePanelCode>
          )}
        </div>
        <ActivePanelButtons
          buttons={script.versions[currentVersion - 1].buttons}
          scriptId={script.id}
          userData={userData}
          setIsOpenPanel={setIsOpenPanel}
        ></ActivePanelButtons>
      </div>
      <div className={style["active-panel__sidebar"]}>
        {script.versions.map((versionScript) => {
          return (
            <div
              onClick={() => {
                setCurrentIndexBtn(0);
                setCurrentVersion(versionScript.v);
              }}
              key={versionScript.v}
              className={`${style["version-tab"]} ${
                versionScript.v === currentVersion
                  ? style["version-tab_active"]
                  : ""
              }`}
            >
              v{versionScript.v}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ActiveScriptPanel = memo(ActiveScriptPanelInitial);
