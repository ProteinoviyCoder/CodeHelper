"use client";

import { Button } from "@/shared/ui/button/button";
import style from "./addNewModuleCard.module.scss";
import { ChangeEvent, FC, memo, MouseEvent, useState } from "react";
import { ModalWindow } from "@/shared/ui/modalWindow/modalWindow";
import { Input } from "@/shared/ui/input/input";
import { validationInput } from "@/shared/model/lib/validation";
import { User } from "@/entities/user/model/types";
import { Permissions } from "@/shared/model/config/permissions";
import { getErrorMessage } from "@/shared/model/lib/help";
import { ModalImg } from "@/shared/ui/modalImg/modalImg";
import { useAddNewModuleMutation } from "../../api/modulesEndpoints";
import { Snackbar } from "@/shared/ui/snackbar/snackbar";
import { useAppSelector } from "@/shared/model/hooks";
import { Dropdown } from "@/shared/ui/dropdown/dropdown";
import { AiOutlineClose } from "react-icons/ai";

type AddNewModuleCardInitialProps = {
  userData?: User;
};

const AddNewModuleCardInitial: FC<AddNewModuleCardInitialProps> = ({
  userData,
}) => {
  const existGroups = useAppSelector((state) => state.modulesGroups.groups);
  const [addNewModuleBD, { isLoading }] = useAddNewModuleMutation();

  const [currentGroup, setCurrentGroup] = useState<string[]>([]);
  const [isOpenModalWindow, setIsOpenModalWindow] = useState<boolean>(false);
  const [inputNameValue, setInputNameValue] = useState<string>("");
  const [inputErrorName, setInputErrorName] = useState<string>("");
  const [inputCodeModuleValue, setInputCodeModuleValue] = useState<string>("");
  const [inputCodeModuleError, setInputCodeModuleError] = useState<string>("");
  const [urlImg, setUrlImg] = useState<string | null>(null);
  const [errorReadFile, setErrorReadFile] = useState<string>("");
  const [isOpenModalImg, setIsOpenModalImg] = useState<boolean>(false);
  const [coreError, setCoreError] = useState<string>("");
  const [isOpenSneckbar, setIsOpenSneckbar] = useState<boolean>(false);
  const [textSneckbar, setTextSneckbar] = useState<string>("");
  const [variantSneckbar, setVariantSneckbar] = useState<
    "error" | "information"
  >("information");

  const handleOpenModalWindow = () => {
    setIsOpenModalWindow(true);
  };

  const handleOpenModalImg = () => {
    setIsOpenModalImg(true);
  };

  const handleAddCurrentGroup = (e: MouseEvent<HTMLLIElement>) => {
    if (typeof e.currentTarget.textContent !== "string") return;

    const word = e.currentTarget.textContent;
    const isUniqueGroup = currentGroup.find((group) => group === word);

    if (isUniqueGroup) {
      return;
    }

    setCurrentGroup((prev) => [...prev, word]);
  };

  const handleDeleteCurrentGroup = (word: string) => {
    setCurrentGroup((prev) => [...prev.filter((group) => group !== word)]);
  };

  const handleChangeNameModule = (e: ChangeEvent<HTMLInputElement>) => {
    if (inputErrorName) setInputErrorName("");
    const text = e.target.value;
    const lastSymbol = text[text.length];
    const report = validationInput(lastSymbol, text);

    if (report.status) {
      setInputErrorName(report.message);
      return;
    }

    setInputNameValue(text);
  };

  const handleChangeCodeModule = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (inputCodeModuleError) setInputCodeModuleError("");
    const text = e.target.value;
    console.log(text.trim().length);

    if (text.length > 20000) {
      setInputCodeModuleError("Максимальное кол-во символов 20.000");
      return;
    }

    setInputCodeModuleValue(text);
  };

  const handleClearAll = () => {
    setCurrentGroup([]);
    setInputNameValue("");
    setInputErrorName("");
    setInputCodeModuleValue("");
    setInputCodeModuleError("");
    setUrlImg(null);
    setErrorReadFile("");
    setIsOpenModalWindow(false);
  };

  const handleResetError = () => {
    setErrorReadFile("");
  };

  const handleReadImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : "";
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg",
      "images/PNG",
      "image/svg+xml",
    ];
    const maxSize = 2 * 1024 * 1024;

    if (file === "") {
      setErrorReadFile("Файл не выбран");
      return;
    }

    if (!validTypes.includes(file.type)) {
      setErrorReadFile(`Неподдерживаемый тип файла ${file.type}`);
      return;
    }

    if (file.size > maxSize) {
      setErrorReadFile("Ошибка, максимальный размер изображение - 2 МБ");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === "string") {
        setUrlImg(reader.result);
        return;
      }
    };
    reader.onerror = () => {
      setErrorReadFile("Ошибка загрузки");
    };
    reader.readAsDataURL(file);
  };

  const handleCreateModule = async () => {
    if (inputNameValue.trim().length < 1) {
      setInputErrorName("Поле не может быть пустым");
      return;
    }
    if (inputCodeModuleValue.trim().length < 1) {
      setInputCodeModuleError("Поле не может быть пустым");
      return;
    }

    const newModule = {
      name: inputNameValue.trim(),
      img: urlImg,
      groups: ["Все", ...currentGroup],
      code: inputCodeModuleValue.trim(),
    };

    const { error } = await addNewModuleBD({ newModule });

    if (error) {
      const myError = getErrorMessage(error);
      setCoreError(myError);

      setVariantSneckbar("error");
      setTextSneckbar(myError);
      setIsOpenSneckbar(true);

      return;
    }

    setVariantSneckbar("information");
    setTextSneckbar("Модуль создан");
    setIsOpenSneckbar(true);

    handleClearAll();
  };

  const footerModalWindow = (
    <div className={style["modal-footer-container"]}>
      <Button onClick={handleClearAll} variant="error">
        Отменить
      </Button>
      <Button
        onClick={handleCreateModule}
        variant="secondary"
        disabled={isLoading}
      >
        Создать
      </Button>
    </div>
  );

  if (!userData || !Permissions.modulesPage.includes(userData.userRole)) {
    return;
  }

  return (
    <div className={style["container"]}>
      <Button onClick={handleOpenModalWindow} variant="secondary">
        Добавить +
      </Button>
      <ModalWindow
        isOpen={isOpenModalWindow}
        setIsOpen={setIsOpenModalWindow}
        title="Добавить новый модуль?"
        style={{ width: "600px" }}
        footer={footerModalWindow}
      >
        <div className={style["modal-content"]}>
          <div className={style["img-container"]}>
            <img
              onClick={handleOpenModalImg}
              className={style["img"]}
              src={urlImg ? urlImg : "./default-module.png"}
              alt="#"
            />

            <label
              className={style["input-file"]}
              onClick={() => handleResetError()}
            >
              <p>{userData?.userImg ? "Изменить фото +" : "Добавить фото +"}</p>
              <input onChange={(e) => handleReadImg(e)} type="file" />
            </label>
          </div>
          {errorReadFile && (
            <p className={style["text-error"]}>{errorReadFile}</p>
          )}
          <br />
          <div className={style["groups-container"]}>
            <p className={style["name-groups"]}>Группы</p>
            <ul className={style["selected-groups"]}>
              <li className={style["selected-group"]}>Все</li>
              {currentGroup.map((group) => {
                return (
                  <li key={group} className={style["selected-group"]}>
                    {group}
                    <AiOutlineClose
                      onClick={() => handleDeleteCurrentGroup(group)}
                    />
                  </li>
                );
              })}
            </ul>
            <Dropdown
              buttonText="Добавить группу"
              dontChangeBtnText={true}
              variants={
                existGroups
                  ? [...existGroups.map((group) => group.group)]
                  : null
              }
              onChange={handleAddCurrentGroup}
            ></Dropdown>
          </div>
          <Input
            value={inputNameValue}
            onChange={handleChangeNameModule}
            inputStyle={{
              backgroundColor: "var(--background-secondary-color)",
            }}
            error={inputErrorName}
            placeholder="Название модуля"
            type="text"
          ></Input>

          <p className={style["name-textarea"]}>Код модуля</p>
          <textarea
            className={style["textarea"]}
            value={inputCodeModuleValue}
            onChange={handleChangeCodeModule}
            placeholder="Код модуля"
          ></textarea>
          {inputCodeModuleError && (
            <p className={style["text-error"]}>{inputCodeModuleError}</p>
          )}
          {coreError && <p className={style["core-error"]}>{coreError}</p>}
        </div>
      </ModalWindow>
      <ModalImg
        src={urlImg ? urlImg : "./default-module.png"}
        isOpen={isOpenModalImg}
        setIsOpen={setIsOpenModalImg}
      ></ModalImg>
      <Snackbar
        open={isOpenSneckbar}
        setOpen={setIsOpenSneckbar}
        message={textSneckbar}
        variant={variantSneckbar}
      ></Snackbar>
    </div>
  );
};

export const AddNewModuleCard = memo(AddNewModuleCardInitial);
