import { Button } from "@/shared/ui/button/button";
import style from "./activePanelDescription.module.scss";
import { ChangeEvent, FC, memo, useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { AiFillInfoCircle } from "react-icons/ai";
import { useChangeScriptDescriptionMutation } from "../../api/activePanelEndpoints";
import { Snackbar } from "@/shared/ui/snackbar/snackbar";
import { Permissions } from "@/shared/model/config/permissions";
import { User } from "@/entities/user/model/types";

type ActivePanelDescriptionInitial = {
  description: string;
  scriptId: number;
  versionId: number;
  userData?: User;
};

const ActivePanelDescriptionInitial: FC<ActivePanelDescriptionInitial> = ({
  description,
  scriptId,
  versionId,
  userData,
}) => {
  const [valueTextarea, setValueTextarea] = useState<string>(description);
  const [isVisibleTextarea, setIsVisibleTextarea] = useState<boolean>(false);
  const [errorTextarea, setErrorTextarea] = useState<string>("");
  const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false);
  const [textSnackbar, setTextSnackbar] = useState<string>("");

  const [handleChangeTextBD, { isLoading }] =
    useChangeScriptDescriptionMutation();

  const formatText = (inputString: string) => {
    let cleanedString = inputString.replace(/\s+/g, " ").trim();

    cleanedString = cleanedString.replace(/:;:;/g, "\n\n");
    cleanedString = cleanedString.replace(/:;:/g, "\n");

    return cleanedString;
  };

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setErrorTextarea("");
    const text = e.target.value;

    if (text.length > 999) {
      setErrorTextarea("Максимальное кол-во символов 999");
      return;
    }

    setValueTextarea(text);
  };

  const handleChangeText = async () => {
    if (!isVisibleTextarea) {
      setIsVisibleTextarea(true);
      return;
    }

    const newDescription = valueTextarea;

    if (newDescription.length > 999) {
      setErrorTextarea("Максимальное кол-во символов 999");
      return;
    }

    if (newDescription.trim().length < 1) {
      setErrorTextarea("Поле не может быть пустым");
      return;
    }

    const { error } = await handleChangeTextBD({
      scriptId,
      versionId,
      newDescription,
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
    setValueTextarea(description);
  }, [description]);

  return (
    <div className={style["info-description"]}>
      {isVisibleTextarea && (
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
      )}
      {isVisibleTextarea ? (
        <textarea
          className={style["textarea"]}
          name="description"
          value={valueTextarea}
          onChange={handleInput}
        ></textarea>
      ) : (
        <p>{formatText(description)}</p>
      )}

      {userData && Permissions.activePanel.includes(userData.userRole) && (
        <div className={style["buttons-container"]}>
          {errorTextarea && (
            <div className={style["text-error"]}>
              <span>
                <AiFillInfoCircle />
              </span>
              <p>{errorTextarea}</p>
            </div>
          )}
          <Button
            onClick={handleChangeText}
            variant="secondary"
            customClass={isVisibleTextarea ? "" : style["btn-change"]}
            disabled={isLoading}
          >
            {isVisibleTextarea ? "Сохранить" : <AiFillEdit />}
          </Button>
          {isVisibleTextarea && (
            <Button
              onClick={() => {
                setValueTextarea(description);
                setErrorTextarea("");
                setIsVisibleTextarea(false);
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

export const ActivePanelDescription = memo(ActivePanelDescriptionInitial);
