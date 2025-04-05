"use client";

import { Button } from "@/shared/ui/button/button";
import style from "./addNewTeamScripts.module.scss";
import { ChangeEvent, FC, memo, useState } from "react";
import { ModalWindow } from "@/shared/ui/modalWindow/modalWindow";
import { Input } from "@/shared/ui/input/input";
import { validationInput } from "@/shared/model/lib/validation";
import { AiFillInfoCircle } from "react-icons/ai";
import { SkeletVersion } from "../../model/types";
import { useCreateNewScriptMutation } from "../../api/activePanelEndpoints";
import { getErrorMessage } from "@/shared/model/lib/help";
import { Snackbar } from "@/shared/ui/snackbar/snackbar";
import { User } from "@/entities/user/model/types";
import { Permissions } from "@/shared/model/config/permissions";

const skeletVersion: SkeletVersion = {
  v: 1,
  name: "",
  description: "",
  buttons: [
    {
      buttonText: "",
      script: "",
    },
  ],
};
type AddNewScriptInitialProps = {
  userData?: User;
};

const AddNewTeamScriptInitial: FC<AddNewScriptInitialProps> = ({
  userData,
}) => {
  const [createNewScriptBD, { isLoading }] = useCreateNewScriptMutation();

  const [isOpenModalWindow, setIsOpenModalWindow] = useState<boolean>(false);
  const [currentVersion, setCurrentVersion] = useState<number>(1);
  const [cuurentBtnIndex, setCurrentBtnIndex] = useState<number>(0);
  const [versions, setVersions] = useState<SkeletVersion[]>([skeletVersion]);
  const [error, setError] = useState<string>("");
  const [errorName, setErrorName] = useState<string>("");
  const [errorDescription, setErrorDescription] = useState<string>("");
  const [errorNameBtn, setErrorNameBtn] = useState<string>("");
  const [errorCode, setErrorCode] = useState<string>("");
  const [isOpenSneckbar, setIsOpenSneckbar] = useState<boolean>(false);
  const [textSneckbar, setTextSneckbar] = useState<string>("");
  const [variantSneckbar, setVariantSneckbar] = useState<
    "error" | "information"
  >("information");

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    if (errorName) {
      setErrorName("");
    }
    const text = e.target.value;
    const lastSymbol = text[text.length];

    const report = validationInput(lastSymbol, text);

    if (report.status) {
      setErrorName(report.message);
      return;
    }

    setVersions((prev) =>
      prev.map((version) =>
        version.v === currentVersion
          ? {
              ...version,
              name: text,
              buttons: version.buttons.map((btn) => ({ ...btn })),
            }
          : version
      )
    );
  };

  const handleChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (errorDescription) {
      setErrorDescription("");
    }
    const text = e.target.value;

    if (text.trim().length > 999) {
      setErrorDescription("Максимальное кол-во символов 999");
      return;
    }

    setVersions((prev) =>
      prev.map((version) =>
        version.v === currentVersion
          ? {
              ...version,
              description: text,
              buttons: version.buttons.map((btn) => ({ ...btn })),
            }
          : version
      )
    );
  };

  const handleChangeNameBtn = (e: ChangeEvent<HTMLInputElement>) => {
    if (errorNameBtn) {
      setErrorNameBtn("");
    }
    const text = e.target.value.trim();
    const lastSymbol = text[text.length];

    if (text.length > 20) {
      setErrorNameBtn("Максимальное кол-во символов 20");
      return;
    }

    const report = validationInput(lastSymbol, text);

    if (report.status) {
      setErrorNameBtn(report.message);
      return;
    }

    setVersions((prev) =>
      prev.map((version) =>
        version.v === currentVersion
          ? {
              ...version,
              buttons: version.buttons.map((btn, index) =>
                cuurentBtnIndex === index
                  ? { ...btn, buttonText: text }
                  : { ...btn }
              ),
            }
          : version
      )
    );
  };

  const handleChangeCode = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;

    if (text.trim().length > 2999) {
      setErrorCode("Максимальное кол-во символов 2999");
      return;
    }

    setVersions((prev) =>
      prev.map((version) =>
        version.v === currentVersion
          ? {
              ...version,
              buttons: version.buttons.map((btn, index) =>
                cuurentBtnIndex === index
                  ? { ...btn, script: text }
                  : { ...btn }
              ),
            }
          : version
      )
    );
  };

  const handleClearAll = () => {
    setIsOpenModalWindow(false);
    setErrorCode("");
    setErrorNameBtn("");
    setErrorDescription("");
    setErrorName("");
    setError("");
    setCurrentBtnIndex(0);
    setCurrentVersion(1);
    setVersions([skeletVersion]);
  };

  const handleCreateNewScript = async () => {
    for (const version of versions) {
      if (version.description.length > 999) {
        setErrorDescription("Максимальное кол-во символов 999");
        return;
      }

      if (version.name.length < 1) {
        setErrorName("Название скрипта каждой версии должно быть заполнено");
        return;
      }

      const lastSymbol = version.name[version.name.length];
      const report = validationInput(lastSymbol, version.name);

      if (report.status) {
        setErrorName(report.message);
        return;
      }

      let errorButtons: string | null = null;

      for (const btn of version.buttons) {
        if (btn.buttonText.length > 15) {
          setErrorNameBtn(
            "Максисальное кол-во символов для названия кнопки 15"
          );
          errorButtons = "Максисальное кол-во символов для названия кнопки 15";
          return;
        }
        if (btn.buttonText.length < 1) {
          setErrorNameBtn(
            "Название всех кнопок в каждой версии должны быть заполнены"
          );
          errorButtons =
            "Название всех кнопок в каждой версии должны быть заполнены";
          return;
        }
        if (btn.buttonText.includes("<") || btn.buttonText.includes(">")) {
          setErrorNameBtn(
            "Недопустимые символы для названия кнопки - ',' или '>' "
          );
          errorButtons =
            "Недопустимые символы для названия кнопки - ',' или '>' ";
          return;
        }
        if (btn.script.length > 2999) {
          setErrorCode("Максисальное кол-во символов для скрипта 2999");
          errorButtons = "Максисальное кол-во символов для скрипта 2999";
          return;
        }
        if (btn.script.length < 1) {
          setErrorCode(
            "Скрипт для всех кнопок в каждой версии должен быть заполнен"
          );
          errorButtons =
            "Скрипт для всех кнопок в каждой версии должен быть заполнен";
          return;
        }
      }

      if (errorButtons) {
        return;
      }
    }

    const { error } = await createNewScriptBD({ versions });

    if (error) {
      const myError = getErrorMessage(error);
      setError(myError);

      setVariantSneckbar("error");
      setTextSneckbar(myError);
      setIsOpenSneckbar(true);

      return;
    }

    setVariantSneckbar("information");
    setTextSneckbar("Скрипт добавлен");
    setIsOpenSneckbar(true);

    handleClearAll();
  };

  if (!userData || !Permissions.activePanel.includes(userData.userRole)) {
    return;
  }

  return (
    <div className={style["buttons-container"]}>
      <Button onClick={() => setIsOpenModalWindow(true)} variant="secondary">
        Добавить +
      </Button>

      <ModalWindow
        title="Добавить скрипт"
        isOpen={isOpenModalWindow}
        setIsOpen={setIsOpenModalWindow}
        footer={
          <div className={style["modal-footer-container"]}>
            <Button onClick={handleClearAll} variant="error">
              Отменить
            </Button>
            <Button
              onClick={handleCreateNewScript}
              variant="primary"
              disabled={isLoading}
            >
              Создать
            </Button>
          </div>
        }
      >
        <div className={style["content-container"]}>
          <div className={style["modal-header"]}>
            {versions.map((version) => {
              return (
                <div
                  onClick={() => {
                    setErrorName("");
                    setErrorDescription("");
                    setErrorNameBtn("");
                    setErrorCode("");
                    setCurrentBtnIndex(0);
                    setCurrentVersion(version.v);
                  }}
                  key={version.v}
                  className={`${style["version-tab"]} ${
                    currentVersion === version.v
                      ? style["version-tab-active"]
                      : ""
                  }`}
                >
                  v{version.v}
                </div>
              );
            })}
            <div
              onClick={() => {
                if (versions.length >= 10) {
                  return;
                }
                setCurrentBtnIndex(0);
                setVersions((prev) => {
                  return [...prev, { ...skeletVersion, v: prev.length + 1 }];
                });
                setCurrentVersion(versions.length + 1);
              }}
              className={style["version-tab"]}
            >
              +
            </div>
          </div>
          <div className={style["modal-main"]}>
            <Input
              inputStyle={{
                backgroundColor: "var(--background-secondary-color)",
              }}
              placeholder="Название скрипта"
              value={versions[currentVersion - 1].name}
              type="text"
              onChange={handleChangeName}
              error={errorName}
            />
            <p className={style["title-description"]}>Описание</p>
            <textarea
              placeholder="Описание"
              className={style["textarea"]}
              value={versions[currentVersion - 1].description}
              onChange={handleChangeDescription}
            ></textarea>
            {errorDescription && (
              <p className={style["error-text"]}>{errorDescription}</p>
            )}
            <div className={style["textarea-hint"]}>
              <span className={style["icon-hint"]}>
                <AiFillInfoCircle />
              </span>
              <div className={style["text-hint"]}>
                <p>
                  Для переноса строки необходимо использовать набор символов :;:{" "}
                </p>
                <p>Для переноса на две строки :;:;</p>
              </div>
            </div>
          </div>
          <div className={style["version-btn-container"]}>
            {versions[currentVersion - 1].buttons.map((_, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    setErrorNameBtn("");
                    setErrorCode("");
                    setCurrentBtnIndex(index);
                  }}
                  className={`${style["version-btn-tab"]} ${
                    cuurentBtnIndex === index
                      ? style["version-btn-tab-active"]
                      : ""
                  }`}
                >
                  btn{index + 1}
                </div>
              );
            })}
            <div
              onClick={() => {
                setVersions((prev) => {
                  return prev.map((version) =>
                    currentVersion === version.v
                      ? {
                          ...version,
                          buttons:
                            version.buttons.length >= 10
                              ? version.buttons
                              : [
                                  ...version.buttons,
                                  { buttonText: "", script: "" },
                                ],
                        }
                      : version
                  );
                });
                setCurrentBtnIndex((prev) => {
                  if (prev < 9) {
                    return versions[currentVersion - 1].buttons.length;
                  } else {
                    return prev;
                  }
                });
              }}
              className={style["version-btn-tab"]}
            >
              +
            </div>
          </div>
          <div className={style["modal-main"]}>
            <Input
              inputStyle={{
                backgroundColor: "var(--background-secondary-color)",
              }}
              placeholder="Название кнопки"
              value={
                versions[currentVersion - 1].buttons[cuurentBtnIndex].buttonText
              }
              type="text"
              onChange={handleChangeNameBtn}
              error={errorNameBtn}
            />
            <p className={style["title-description"]}>Скрипт:</p>
            <textarea
              placeholder="Скрипт"
              className={style["textarea"]}
              value={
                versions[currentVersion - 1].buttons[cuurentBtnIndex].script
              }
              onChange={handleChangeCode}
            ></textarea>
            {errorCode && <p className={style["error-text"]}>{errorCode}</p>}
            {error && <p className={style["core-error-text"]}>{error}</p>}
          </div>
        </div>
      </ModalWindow>
      <Snackbar
        open={isOpenSneckbar}
        setOpen={setIsOpenSneckbar}
        message={textSneckbar}
        variant={variantSneckbar}
      ></Snackbar>
    </div>
  );
};

export const AddNewTeamScript = memo(AddNewTeamScriptInitial);
