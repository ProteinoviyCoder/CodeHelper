"use client";

import { Dispatch, FC, memo, SetStateAction, useEffect, useState } from "react";
import style from "./script.module.scss";
import { Button } from "@/shared/ui/button/button";
import { ArchiveScriptType } from "../../model/types";
import { Snackbar } from "@/shared/ui/snackbar/snackbar";
import { AiFillEdit } from "react-icons/ai";

type ArchiveScriptInitialProps = {
  script: ArchiveScriptType;
  setIsOpenPanel?: Dispatch<SetStateAction<boolean>>;
  setActiveScript?: Dispatch<SetStateAction<ArchiveScriptType | null>>;
  setNumberActiveScript?: Dispatch<SetStateAction<number>>;
  isOpenPanel: boolean;
};

const ArchiveScriptInitial: FC<ArchiveScriptInitialProps> = ({
  script,
  setIsOpenPanel,
  setActiveScript,
  setNumberActiveScript,
  isOpenPanel,
}) => {
  const [currentVersion, setCurrentVersion] = useState<number>(1);

  const [isOpenSneckbar, setIsOpenSneckbar] = useState<boolean>(false);
  const [textSneckbar, setTextSneckbar] = useState<string>("");

  useEffect(() => {
    if (isOpenPanel) {
      if (setActiveScript !== undefined) {
        setActiveScript(script);
      }
    }
  }, [script]);

  return (
    <div className={style["script-container"]}>
      <div className={style["script-versions"]}>
        <div className={style["versions-container"]}>
          {script.versions.map((version) => {
            return (
              <div
                key={version.v}
                onClick={() => {
                  if (version.v === currentVersion) return;
                  setCurrentVersion(version.v);
                }}
                className={`${style["version"]} ${
                  version.v === currentVersion ? style["version-active"] : ""
                }`}
              >
                v{version.v}
              </div>
            );
          })}
        </div>
        <div className={style["btn-detail-container"]}>
          <Button
            styleButton={{
              borderBottomRightRadius: "0px",
              borderTopRightRadius: "15px",
              borderTopLeftRadius: "0px",
              borderBottomLeftRadius: "0px",
            }}
            variant="primary"
            onClick={() => {
              if (setNumberActiveScript !== undefined)
                setNumberActiveScript(currentVersion);
              if (setIsOpenPanel !== undefined) setIsOpenPanel(true);
              if (setActiveScript !== undefined) setActiveScript(script);
            }}
          >
            <p className={style["text-btn-detail"]}>Подробнее</p>
            <p className={style["text-btn-detail-mobile"]}>
              <AiFillEdit />
            </p>
          </Button>
        </div>
      </div>
      <div className={style["script-name"]}>
        {script.versions.map((versionScript) => {
          if (versionScript.v === currentVersion) {
            return <p key={versionScript.v}>{versionScript.name}</p>;
          }
        })}
      </div>
      <div className={style["script-buttons"]}>
        {script.versions.map((version) => {
          if (version.v === currentVersion) {
            return version.buttons.map((buttonScript, index) => {
              return (
                <Button
                  key={index}
                  styleButton={{ width: "fit-content" }}
                  variant="secondary"
                  onClick={() => {
                    setTextSneckbar(`Скопиравано: ${buttonScript.buttonText}`);
                    setIsOpenSneckbar(true);
                    navigator.clipboard.writeText(buttonScript.script);
                  }}
                >
                  {buttonScript.buttonText}
                </Button>
              );
            });
          }
        })}
      </div>
      <Snackbar
        open={isOpenSneckbar}
        setOpen={setIsOpenSneckbar}
        message={textSneckbar}
        variant="information"
      ></Snackbar>
    </div>
  );
};

export const ArchiveScript = memo(ArchiveScriptInitial);
