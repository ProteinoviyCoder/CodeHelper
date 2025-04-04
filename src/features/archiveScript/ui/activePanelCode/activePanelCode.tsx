"use client";

import style from "./activePanelCode.module.scss";
import {
  ChangeEvent,
  Dispatch,
  FC,
  memo,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { ArchiveScriptButton } from "../../model/types";
import { HighlightCode } from "@/features/highlightCode/ui/highlightCode";
import { User } from "@/entities/user/model/types";
import { Permissions } from "@/shared/model/config/permissions";
import { Button } from "@/shared/ui/button/button";
import { AiFillEdit, AiFillInfoCircle } from "react-icons/ai";
import { formatCode } from "@/features/highlightCode/model/functions";
import { useChangeScriptCodeMutation } from "../../api/activePanelEndpoints";
import { Snackbar } from "@/shared/ui/snackbar/snackbar";

type ActivePanelCodeInitialProps = {
  buttons: ArchiveScriptButton[];
  currentIndexBtn: number;
  setCurrentIndexBtn: Dispatch<SetStateAction<number>>;
  currentTab: string;
  currentVersion: number;
  userData?: User;
  scriptId: number;
  versionId: number;
};

const ActivePanelCodeInitial: FC<ActivePanelCodeInitialProps> = ({
  buttons,
  currentIndexBtn,
  setCurrentIndexBtn,
  currentTab,
  currentVersion,
  userData,
  scriptId,
  versionId,
}) => {
  const [isVisibleTextarea, setIsVisibleTextarea] = useState<boolean>(false);
  const [currentTextValue, setCurrentTextValue] = useState<string>(
    buttons[currentIndexBtn].script
  );
  const [isTextareaCode, setIsTextareaCode] = useState<boolean>(false);
  const [errorTextarea, setErrorTextarea] = useState<string>("");
  const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false);
  const [textSnackbar, setTextSnackbar] = useState<string>("");

  const [handleChangeCodeBD, { isLoading }] = useChangeScriptCodeMutation();

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (errorTextarea) setErrorTextarea("");
    setIsTextareaCode(true);
    const text = e.target.value;

    if (text.length > 2999) {
      setErrorTextarea("Максимальное кол-во символов 2999");
      return;
    }

    setCurrentTextValue(text);
  };

  const handleChangeCode = async () => {
    if (!isVisibleTextarea) {
      setIsVisibleTextarea(true);
      return;
    }

    const newScript = currentTextValue;
    const buttonId = buttons[currentIndexBtn].id;

    if (newScript.length > 2999) {
      setErrorTextarea("Максимальное кол-во символов 2999");
      return;
    }

    if (newScript.trim().length < 1) {
      setErrorTextarea("Поле не может быть пустым");
      return;
    }

    const { error } = await handleChangeCodeBD({
      scriptId,
      versionId,
      buttonId,
      newScript,
    });

    if (error) {
      if (error) {
        const myError =
          typeof error === "object" && "data" in error
            ? (error.data as { message: string }).message
            : "Неизвестная ошибка";
        setTextSnackbar(myError);
        setIsOpenSnackbar(true);
        setErrorTextarea(myError);
        console.error(error);

        return;
      }
    }

    setIsVisibleTextarea(false);
  };

  useEffect(() => {
    setCurrentTextValue(buttons[currentIndexBtn].script);
  }, [currentVersion, currentIndexBtn]);

  return (
    <div className={style["info-code"]}>
      <div className={style["info-code__sidebar"]}>
        {buttons.map((button, index) => {
          return (
            <div
              key={button.id}
              onClick={() => setCurrentIndexBtn(index)}
              className={`${style["info-code__sidebar-tab"]} ${
                currentIndexBtn === index
                  ? style["info-code__sidebar-tab-active"]
                  : ""
              }`}
            >
              {button.buttonText}
            </div>
          );
        })}
      </div>
      <div className={style["info-code__text"]}>
        {errorTextarea && (
          <p className={style["error-text"]}>
            <span>
              <AiFillInfoCircle />
            </span>
            {errorTextarea}
          </p>
        )}
        {isVisibleTextarea ? (
          <textarea
            className={style["textarea-code"]}
            value={
              isTextareaCode ? currentTextValue : formatCode(currentTextValue)
            }
            onChange={handleInput}
          ></textarea>
        ) : (
          <HighlightCode
            dependencies={[
              currentIndexBtn,
              currentTab,
              currentVersion,
              buttons[currentIndexBtn].script,
            ]}
            code={buttons[currentIndexBtn].script}
          ></HighlightCode>
        )}
      </div>
      {userData && Permissions.activePanel.includes(userData.userRole) && (
        <div className={style["buttons-container"]}>
          <Button
            onClick={handleChangeCode}
            variant="secondary"
            customClass={isVisibleTextarea ? "" : style["btn-change"]}
            disabled={isLoading}
          >
            {isVisibleTextarea ? "Сохранить" : <AiFillEdit />}
          </Button>
          {isVisibleTextarea && (
            <Button
              onClick={() => {
                setIsVisibleTextarea(false);
                setIsTextareaCode(false);
                setErrorTextarea("");
                setCurrentTextValue(buttons[currentIndexBtn].script);
              }}
              variant="primary"
            >
              Отмена
            </Button>
          )}
        </div>
      )}
      <Snackbar
        message={textSnackbar}
        open={isOpenSnackbar}
        setOpen={setIsOpenSnackbar}
        variant="error"
      ></Snackbar>
    </div>
  );
};

export const ActivePanelCode = memo(ActivePanelCodeInitial);
