"use client";

import style from "./signin.module.scss";
import React, { FC, memo, useEffect, useState } from "react";
import { Title } from "@/shared/ui/title/title";
import { Input } from "@/shared/ui/input/input";
import { Button } from "@/shared/ui/button/button";
import { useUserSigninMutation } from "../api/siginEndpoints";
import { useAppDispatch, useAppSelector } from "@/shared/model/hooks";
import { actionSetUserData } from "@/entities/user/model/userSlice";
import { useRouter } from "next/navigation";
import { AiFillWarning } from "react-icons/ai";
import {
  validationInput,
  validationSubmitForm,
} from "@/shared/model/lib/validation";
import { Loader } from "@/shared/ui/loader/loader";

type AuthFormInputs = {
  inputUsername: {
    inputValue: string;
    inputError: string;
  };
  inputPassword: {
    inputValue: string;
    inputError: string;
  };
};

const SigninPageInitial: FC = () => {
  const [handleUserSignin] = useUserSigninMutation();

  const dispatch = useAppDispatch();
  const route = useRouter();
  const { isAuth } = useAppSelector((state) => state.user);

  const [errorForm, setErrorForm] = useState<string>("");
  const [formInputs, setFormInputs] = useState<AuthFormInputs>({
    inputUsername: { inputValue: "", inputError: "" },
    inputPassword: { inputValue: "", inputError: "" },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleValidationLoginInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const word = e.target.value.trim();
    const character = word[word.length - 1];

    const report = validationInput(character, word);

    setFormInputs((prev) => ({
      ...prev,
      inputUsername: report.status
        ? { ...prev.inputUsername, inputError: report.message }
        : { inputError: "", inputValue: word },
    }));
  };

  const handleValidationPasswordInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const word = e.target.value.trim();
    const character = word[word.length - 1];

    const report = validationInput(character, word);

    setFormInputs((prev) => ({
      ...prev,
      inputPassword: report.status
        ? { ...prev.inputPassword, inputError: report.message }
        : { inputError: "", inputValue: word },
    }));
  };

  const handleAuth = async () => {
    const report = validationSubmitForm(
      formInputs.inputUsername.inputValue,
      formInputs.inputPassword.inputValue
    );

    if (report.status) {
      setErrorForm(report.message);
      return;
    }

    if (formInputs.inputPassword.inputValue.length < 7) {
      setErrorForm("Минимальная длина пароля - 7 символов");
      return;
    }

    setIsLoading(true);

    const { data: user, error } = await handleUserSignin({
      email: formInputs.inputUsername.inputValue,
      password: formInputs.inputPassword.inputValue,
    });

    if (error) {
      const myError = (error as { data: { message: string } }) || undefined;
      if (myError) {
        setErrorForm(myError.data.message);
      }
      setIsLoading(false);
      return;
    }

    dispatch(actionSetUserData(user));
    setIsLoading(false);
    route.push("/profile");
  };

  useEffect(() => {
    if (isAuth) route.replace("profile");
  }, []);

  if (isAuth) return <Loader></Loader>;

  return (
    <div className={style["form-container"]}>
      <form className={style["form"]}>
        <Title size="s2" style={{ marginBottom: "15px", marginTop: "10px" }}>
          Аутентификация
        </Title>
        <Input
          inputStyle={{ backgroundColor: "var(--primary-dark-color)" }}
          type="text"
          placeholder="Логин"
          value={formInputs.inputUsername.inputValue}
          error={formInputs.inputUsername.inputError}
          onChange={handleValidationLoginInput}
        />
        <Input
          inputStyle={{ backgroundColor: "var(--primary-dark-color)" }}
          type="password"
          placeholder="Пароль"
          autoComplete="new-password"
          value={formInputs.inputPassword.inputValue}
          error={formInputs.inputPassword.inputError}
          onChange={handleValidationPasswordInput}
        />
        {errorForm && (
          <p className={style["error-form"]}>
            <AiFillWarning />
            {errorForm}
          </p>
        )}
        <Button
          variant="secondary"
          styleButton={{ marginTop: "20px", marginBottom: "15px" }}
          onClick={(e) => {
            e.preventDefault();
            handleAuth();
          }}
        >
          Войти
        </Button>
      </form>
      {isLoading && (
        <div className={style["laoder-container"]}>
          <Loader></Loader>
        </div>
      )}
    </div>
  );
};

export const SigninPage = memo(SigninPageInitial);
