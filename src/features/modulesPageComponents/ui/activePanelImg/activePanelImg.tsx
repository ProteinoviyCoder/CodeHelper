"use client";

import { ModalImg } from "@/shared/ui/modalImg/modalImg";
import style from "./activePanelImg.module.scss";
import { FC, memo, useState } from "react";
import { useUpdateImgModuleMutation } from "../../api/modulesEndpoints";
import { Button } from "@/shared/ui/button/button";
import { getErrorMessage } from "@/shared/model/lib/help";
import { Snackbar } from "@/shared/ui/snackbar/snackbar";

type ActivePanelImgInitialProps = {
  id: number;
  img: string | null;
};

const ActivePanelImgInitial: FC<ActivePanelImgInitialProps> = ({ id, img }) => {
  const [updateImgModuleBD, { isLoading }] = useUpdateImgModuleMutation();

  const [isOpenModalImg, setIsOpenModalImg] = useState<boolean>(false);
  const [urlImg, setUrlImg] = useState<string | null>(img);
  const [errorReadFile, setErrorReadFile] = useState<string>("");
  const [isChangedImg, setIsChangedImg] = useState<boolean>(false);
  const [isOpenSneckbar, setIsOpenSneckbar] = useState<boolean>(false);
  const [textSneckbar, setTextSneckbar] = useState<string>("");
  const [variantSneckbar, setVariantSneckbar] = useState<
    "error" | "information"
  >("information");

  const handleOpenModalImg = () => {
    setIsOpenModalImg(true);
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
        setIsChangedImg(true);
        return;
      }
    };
    reader.onerror = () => {
      setErrorReadFile("Ошибка загрузки");
    };
    reader.readAsDataURL(file);
  };

  const handleCancelChanges = () => {
    setUrlImg(img);
    setErrorReadFile("");
    setIsChangedImg(false);
  };

  const handleChangeImgModule = async () => {
    if (typeof urlImg !== "string") return;
    const { error } = await updateImgModuleBD({ moduleId: id, newImg: urlImg });

    if (error) {
      const myError = getErrorMessage(error);
      setErrorReadFile(myError);

      setVariantSneckbar("error");
      setTextSneckbar(myError);
      setIsOpenSneckbar(true);

      return;
    }

    setVariantSneckbar("information");
    setTextSneckbar("Картинка модуля изменена");
    setIsOpenSneckbar(true);

    setIsChangedImg(false);
  };

  return (
    <div className={style["container"]}>
      <div className={style["img-setting"]}>
        <div className={style["img-container"]}>
          <img
            className={style["img"]}
            onClick={handleOpenModalImg}
            src={urlImg ? urlImg : "/default-module.png"}
            alt="#"
          />
        </div>
        <div className={style["buttons"]}>
          <label
            className={style["input-file"]}
            onClick={() => handleResetError()}
          >
            <p>Изменить фото</p>
            <input onChange={(e) => handleReadImg(e)} type="file" />
          </label>
          {isChangedImg && (
            <>
              <Button
                onClick={handleChangeImgModule}
                variant="secondary"
                disabled={isLoading}
              >
                Сохранить
              </Button>
              <Button onClick={handleCancelChanges} variant="error">
                Отмена
              </Button>
            </>
          )}
        </div>
      </div>
      {errorReadFile && <p className={style["text-error"]}>{errorReadFile}</p>}
      <ModalImg
        isOpen={isOpenModalImg}
        setIsOpen={setIsOpenModalImg}
        src={urlImg ? urlImg : "./default-module.png"}
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

export const ActivePanelImg = memo(ActivePanelImgInitial);
