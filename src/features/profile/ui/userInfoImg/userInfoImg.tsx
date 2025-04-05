"use client";

import style from "./userInfoImg.module.scss";
import { useAppDispatch, useAppSelector } from "@/shared/model/hooks";
import Image from "next/image";
import { FC, memo, useState } from "react";
import { FiUser } from "react-icons/fi";
import { ErrorReadFile } from "../../model/types";
import { actionChangeUserImg } from "@/entities/user/model/userSlice";
import { useChangeUserImgMutation } from "../../api/userInfoEndpoints";

const UserInfoImgInital: FC = () => {
  const [changeUserImgBD] = useChangeUserImgMutation();

  const [errorReadFile, setErrorReadFile] = useState<ErrorReadFile>({
    isExistError: false,
    errorText: "",
  });

  const { userData } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const handleResetError = () => {
    setErrorReadFile((prev) => ({
      ...prev,
      isExistError: false,
      errorText: "",
    }));
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
      setErrorReadFile((prev) => ({
        ...prev,
        isExistError: true,
        errorText: "Файл не выбран",
      }));
      return;
    }

    if (!validTypes.includes(file.type)) {
      setErrorReadFile((prev) => ({
        ...prev,
        isExistError: true,
        errorText: `Неподдерживаемый тип файла ${file.type}`,
      }));
      return;
    }

    if (file.size > maxSize) {
      setErrorReadFile((prev) => ({
        ...prev,
        isExistError: true,
        errorText: "Ошибка, максимальный размер изображение - 2 МБ",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === "string") {
        const { data, error } = await changeUserImgBD({
          userId: userData!.id,
          userImg: reader.result,
        });

        if (error) {
          const myError = error as unknown as { data: { message: string } };
          if (myError.data.message) {
            setErrorReadFile((prev) => ({
              ...prev,
              errorText: myError.data.message,
            }));
          }
          return;
        }

        if (data) {
          dispatch(actionChangeUserImg(reader.result));
          return;
        }
      }
      setErrorReadFile((prev) => ({
        ...prev,
        isExistError: true,
        errorText: "Ошибка загрузки",
      }));
    };
    reader.onerror = () => {
      setErrorReadFile((prev) => ({
        ...prev,
        isExistError: true,
        errorText: "Ошибка загрузки",
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={style["user-info_img"]}>
      <div className={style["user-img"]}>
        {userData?.userImg ? (
          <Image width={150} height={150} src={userData.userImg} alt="#" />
        ) : (
          <FiUser />
        )}
      </div>
      <label className={style["input-file"]} onClick={() => handleResetError()}>
        <p>{userData?.userImg ? "Изменить фото +" : "Добавить фото +"}</p>
        <input onChange={(e) => handleReadImg(e)} type="file" />
      </label>
      {errorReadFile.isExistError && (
        <p className={style["error-message"]}>{errorReadFile.errorText}</p>
      )}
    </div>
  );
};

export const UserInfoImg = memo(UserInfoImgInital);
