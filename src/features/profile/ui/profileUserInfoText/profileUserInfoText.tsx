"use client";

import { useAppDispatch, useAppSelector } from "@/shared/model/hooks";
import style from "./profileUserInfoText.module.scss";
import { Title } from "@/shared/ui/title/title";
import { FC, memo, useState } from "react";
import { Input } from "@/shared/ui/input/input";
import { Button } from "@/shared/ui/button/button";
import { actionChangeUsername } from "@/entities/user/model/userSlice";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { useChangeUsernameMutation } from "../../api/userInfoEndpoints";

const ProfileUserInfoTextInitital: FC = () => {
  const { userData } = useAppSelector((state) => state.user);
  const dispath = useAppDispatch();

  const [changeUsernameBD, { isLoading }] = useChangeUsernameMutation();

  const [isVisibleUsernameInput, setIsVisibleUsernameInput] =
    useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(
    userData?.username ? userData.username : ""
  );
  const [errorInput, setErrorInput] = useState<string>("");

  const handleChangeUsername = async () => {
    if (!isVisibleUsernameInput) {
      if (userData?.username) setInputValue(userData?.username);
      setIsVisibleUsernameInput((prev) => !prev);
      return;
    }

    const { error } = await changeUsernameBD({
      userId: userData!.id,
      newName: inputValue,
    });

    if (error) {
      const { error: errorSecond } = await changeUsernameBD({
        userId: userData!.id,
        newName: inputValue,
      });

      if (errorSecond) {
        const message =
          (errorSecond as unknown as { message: string })?.message ||
          "Неизвестная ошибка";

        setErrorInput(message);

        return;
      }
    }

    dispath(actionChangeUsername(inputValue));
    setIsVisibleUsernameInput((prev) => !prev);
  };

  return (
    <ul className={style["text-list"]}>
      <li className={style["text-list_item"]}>
        <p>Почта: </p>
        <Title style={{ wordBreak: "break-all" }} size="s1">
          {userData?.userEmail}
        </Title>
      </li>
      <li className={style["text-list_item"]}>
        {!isVisibleUsernameInput && <p>Имя пользователя:</p>}
        {isVisibleUsernameInput ? (
          <Input
            onKeyDown={(e) => {
              if (e.key === "Enter") handleChangeUsername();
            }}
            onChange={(e) => setInputValue(e.target.value)}
            inputStyle={{
              maxWidth: "250px",
              backgroundColor: "var(--background-secondary-color)",
            }}
            type="text"
            placeholder="Имя пользователя"
            value={inputValue}
            error={errorInput}
          ></Input>
        ) : userData?.username ? (
          <Title style={{ wordBreak: "break-all" }} size="s1">
            {userData.username}
          </Title>
        ) : (
          " ' '"
        )}
        <div className={style["container-buttons"]}>
          <Button
            customClass={isVisibleUsernameInput ? "" : style["btn-change"]}
            onClick={handleChangeUsername}
            variant="secondary"
            disabled={isLoading}
          >
            {isVisibleUsernameInput && isLoading ? (
              "Сохраняем..."
            ) : isVisibleUsernameInput ? (
              "Сохранить"
            ) : (
              <HiMiniPencilSquare style={{ width: "22px", height: "22px" }} />
            )}
          </Button>
          {isVisibleUsernameInput && (
            <Button
              variant="primary"
              onClick={() => setIsVisibleUsernameInput(false)}
            >
              Отменить
            </Button>
          )}
        </div>
      </li>
    </ul>
  );
};

export const ProfileUserInfoText = memo(ProfileUserInfoTextInitital);
