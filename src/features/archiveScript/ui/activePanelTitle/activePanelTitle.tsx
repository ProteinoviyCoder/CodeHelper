import { Title } from "@/shared/ui/title/title";
import style from "./activePanelTitle.module.scss";
import { ChangeEvent, FC, memo, useEffect, useState } from "react";
import { Button } from "@/shared/ui/button/button";
import { AiFillEdit } from "react-icons/ai";
import { User } from "@/entities/user/model/types";
import { Permissions } from "@/shared/model/config/permissions";
import { Input } from "@/shared/ui/input/input";
import { useChangeScriptTitleMutation } from "../../api/activePanelEndpoints";
import { validationInput } from "@/shared/model/lib/validation";
import { Snackbar } from "@/shared/ui/snackbar/snackbar";

type ActivePanelTitleInitialProps = {
  title: string;
  userData?: User;
  scriptId: number;
  versionId: number;
};

const ActivePanelTitleInitial: FC<ActivePanelTitleInitialProps> = ({
  title,
  userData,
  scriptId,
  versionId,
}) => {
  const [isVisibleInput, setIsVisibleInput] = useState<boolean>(false);
  const [valueInput, setValueInput] = useState<string>(title);
  const [errorInput, setErrorInput] = useState<string>("");
  const [isOpenSnackbar, setIsOpenSnackbar] = useState<boolean>(false);
  const [textSnackbar, setTextSnackbar] = useState<string>("");

  const [handleChangeScriptTitleBD, { isLoading }] =
    useChangeScriptTitleMutation();

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorInput("");
    const word = e.target.value;

    if (word.length > 999) {
      setErrorInput("Максимальное кол-во символов 999");
      return;
    }

    const lastSymbol = word[word.length - 1];
    const report = validationInput(lastSymbol, word.trim());

    if (report.status) {
      setErrorInput(report.message);
      return;
    }

    setValueInput(word);
  };

  const handleChangeTitle = async () => {
    if (!isVisibleInput) {
      setIsVisibleInput(true);
      return;
    }

    if (valueInput.trim().length < 1) {
      setErrorInput("Поле не может быть пустым");
      return;
    }

    if (valueInput.length > 999) {
      setErrorInput("Максимальное кол-во символов 999");
      return;
    }

    const { error } = await handleChangeScriptTitleBD({
      scriptId,
      versionId,
      newTitle: valueInput,
    });

    if (error) {
      const myError =
        typeof error === "object" && "data" in error
          ? (error.data as { message: string }).message
          : "Неизвестная ошибка";
      setTextSnackbar(myError);
      setIsOpenSnackbar(true);
      setErrorInput(myError);
      console.error(error);

      return;
    }

    setIsVisibleInput(false);
  };

  const TitleTextJSX = (
    <Title style={{ textOverflow: "ellipsis" }} size="s3">
      {title}
    </Title>
  );

  const TitleInputJSX = (
    <Input
      type="text"
      value={valueInput}
      onChange={(e) => handleInput(e)}
      placeholder="Название"
      inputStyle={{ backgroundColor: "var(--background-secondary-color)" }}
      error={errorInput}
    />
  );

  useEffect(() => {
    setValueInput(title);
  }, [title]);

  useEffect(() => {
    setIsVisibleInput(false);
  }, [versionId]);

  return (
    <div className={style["title-container"]}>
      {isVisibleInput ? TitleInputJSX : TitleTextJSX}
      {userData && Permissions.activePanel.includes(userData.userRole) && (
        <>
          <Button
            onClick={handleChangeTitle}
            customClass={`${!isVisibleInput && style["btn-change-title"]}`}
            variant="secondary"
            disabled={isLoading ? true : false}
          >
            {isVisibleInput ? "Сохранить" : <AiFillEdit />}
          </Button>
          {isVisibleInput && (
            <Button
              onClick={() => {
                setIsVisibleInput(false);
                setValueInput(title);
                setErrorInput("");
              }}
              variant="primary"
            >
              Отменить
            </Button>
          )}
        </>
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

export const ActivePanelTitle = memo(ActivePanelTitleInitial);
