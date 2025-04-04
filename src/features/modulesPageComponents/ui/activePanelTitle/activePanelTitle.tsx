"use client";

import { Title } from "@/shared/ui/title/title";
import style from "./activePanelTitle.module.scss";
import { ChangeEvent, FC, memo, useState } from "react";
import { Button } from "@/shared/ui/button/button";
import { AiFillEdit } from "react-icons/ai";
import { Input } from "@/shared/ui/input/input";
import { validationInput } from "@/shared/model/lib/validation";
import { useUpdateTileModuleMutation } from "../../api/modulesEndpoints";
import { getErrorMessage } from "@/shared/model/lib/help";
import { Snackbar } from "@/shared/ui/snackbar/snackbar";

type ActivePanelTitleInititalProps = {
  title: string;
  id: number;
};

const ActivePanelTitleInitital: FC<ActivePanelTitleInititalProps> = ({
  title,
  id,
}) => {
  const [updateModuleTitleBD, { isLoading }] = useUpdateTileModuleMutation();

  const [isVisibleInput, setIsVisibleInput] = useState<boolean>(false);
  const [valueInputTitle, setValueInputTitle] = useState<string>(title);
  const [errorInputTitle, setErrorInputTitle] = useState<string>("");
  const [isOpenSneckbar, setIsOpenSneckbar] = useState<boolean>(false);
  const [textSneckbar, setTextSneckbar] = useState<string>("");
  const [variantSneckbar, setVariantSneckbar] = useState<
    "error" | "information"
  >("information");

  const handleChangeVisibleInput = () => {
    setIsVisibleInput(true);
  };

  const handleChangeInputTitle = (e: ChangeEvent<HTMLInputElement>) => {
    if (errorInputTitle) setErrorInputTitle("");

    const word = e.target.value;
    const lastSymbol = word[word.length];

    const report = validationInput(lastSymbol, word);

    if (report.status) {
      setErrorInputTitle(report.message);
      return;
    }

    setValueInputTitle(word);
  };

  const handleCancelChange = () => {
    setValueInputTitle(title);
    setErrorInputTitle("");
    setIsVisibleInput(false);
  };

  const handleChangeName = async () => {
    if (valueInputTitle.trim().length < 1) {
      setErrorInputTitle("Поле не может быть пустым");
      return;
    }

    const { error } = await updateModuleTitleBD({
      moduleId: id,
      newTitle: valueInputTitle,
    });

    if (error) {
      const myError = getErrorMessage(error);
      setErrorInputTitle(myError);

      setVariantSneckbar("error");
      setTextSneckbar(myError);
      setIsOpenSneckbar(true);

      return;
    }

    setVariantSneckbar("information");
    setTextSneckbar("Название модуля изменено");
    setIsOpenSneckbar(true);

    if (errorInputTitle) setErrorInputTitle("");

    setIsVisibleInput(false);
  };

  return (
    <div className={style["container-title"]}>
      {isVisibleInput ? (
        <Input
          onChange={handleChangeInputTitle}
          value={valueInputTitle}
          error={errorInputTitle}
          inputStyle={{
            backgroundColor: "var(--background-secondary-color)",
            width: "100%",
          }}
          placeholder="Название"
          type="text"
        ></Input>
      ) : (
        <Title size="s2">Название модуля - {title}</Title>
      )}
      {!isVisibleInput && (
        <Button
          onClick={handleChangeVisibleInput}
          customClass={style["btn-icon"]}
          variant="secondary"
        >
          <AiFillEdit />
        </Button>
      )}
      {isVisibleInput && (
        <>
          <Button
            onClick={handleChangeName}
            variant="secondary"
            disabled={isLoading}
          >
            Сохранить
          </Button>
          <Button onClick={handleCancelChange} variant="error">
            Отменить
          </Button>
        </>
      )}
      <Snackbar
        open={isOpenSneckbar}
        setOpen={setIsOpenSneckbar}
        message={textSneckbar}
        variant={variantSneckbar}
      ></Snackbar>
    </div>
  );
};

export const ActivePanelTitle = memo(ActivePanelTitleInitital);
