import { Button } from "@/shared/ui/button/button";
import style from "./settingPanelAddNewUser.module.scss";
import { ChangeEvent, FC, memo, MouseEvent, useState } from "react";
import { HiOutlineUserAdd } from "react-icons/hi";
import { ModalWindow } from "@/shared/ui/modalWindow/modalWindow";
import { Input } from "@/shared/ui/input/input";
import { Dropdown } from "@/shared/ui/dropdown/dropdown";
import { Roles } from "@/shared/model/config/roles";
import { InputValue } from "../../model/types";
import { validationInput } from "@/shared/model/lib/validation";
import { useAddNewUserTeamMutation } from "../../api/teamEndpoints";
import { getErrorMessage } from "@/shared/model/lib/help";
import { Snackbar } from "@/shared/ui/snackbar/snackbar";

const regex = /^$|^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|`~]+$/;

const SettingPanelAddNewUserInitial: FC = () => {
  const [createNewUserTeamBD, { isLoading }] = useAddNewUserTeamMutation();

  const [isOpenModalWindow, setIsOpenModalWindow] = useState<boolean>(false);
  const [inputLogin, setInputLogin] = useState<InputValue>({
    value: "",
    error: "",
  });
  const [inputPassword, setInputPassword] = useState<InputValue>({
    value: "",
    error: "",
  });
  const [inputRepeatPassword, setInputRepeatPassword] = useState<InputValue>({
    value: "",
    error: "",
  });
  const [currentUserTeamRole, setCurrentUserTeamRole] = useState<string>(
    Roles.USER
  );
  const [coreError, setCoreError] = useState<string>("");
  const [isOpenSneckbar, setIsOpenSneckbar] = useState<boolean>(false);
  const [textSneckbar, setTextSneckbar] = useState<string>("");
  const [variantSneckbar, setVariantSneckbar] = useState<
    "error" | "information"
  >("information");

  const handleOpenModalWindow = () => {
    setIsOpenModalWindow(true);
  };

  const handleCloseModalWindow = () => {
    setIsOpenModalWindow(false);
  };

  const handleCancelChanges = () => {
    setInputLogin((prev) => ({ ...prev, value: "", error: "" }));
    setInputPassword((prev) => ({ ...prev, value: "", error: "" }));
    setInputRepeatPassword((prev) => ({ ...prev, value: "", error: "" }));
    setCurrentUserTeamRole(Roles.USER);
    handleCloseModalWindow();
  };

  const handleChangeInputLogin = (e: ChangeEvent<HTMLInputElement>) => {
    if (inputLogin.error) setInputLogin((prev) => ({ ...prev, error: "" }));

    const text = e.target.value;
    if (!regex.test(text)) {
      return;
    }
    const lastSymbol = text[text.length];

    const report = validationInput(lastSymbol, text);

    if (report.status) {
      setInputLogin((prev) => ({ ...prev, error: report.message }));
      return;
    }

    setInputLogin((prev) => ({ ...prev, value: text }));
  };

  const handleChangeInputPassword = (e: ChangeEvent<HTMLInputElement>) => {
    if (inputPassword.error)
      setInputPassword((prev) => ({ ...prev, error: "" }));

    const text = e.target.value;

    if (!regex.test(text)) return;

    if (text.length > 50) {
      setInputPassword((prev) => ({
        ...prev,
        error: "Иаксимальное кол-во символов 50",
      }));
      return;
    }

    setInputPassword((prev) => ({ ...prev, value: text }));
  };

  const handleChangeInputRepeatPassword = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (inputRepeatPassword.error)
      setInputRepeatPassword((prev) => ({ ...prev, error: "" }));

    const text = e.target.value;

    if (!regex.test(text)) return;

    if (text.length > 50) {
      setInputRepeatPassword((prev) => ({
        ...prev,
        error: "Иаксимальное кол-во символов 50",
      }));
      return;
    }

    setInputRepeatPassword((prev) => ({ ...prev, value: text }));
  };

  const handleChangeCurrentRole = (e: MouseEvent<HTMLLIElement>) => {
    const newRole = e.currentTarget.textContent;

    if (typeof newRole !== "string") return;

    setCurrentUserTeamRole(newRole);
  };

  const handleCreateNewUserTeam = async () => {
    if (inputLogin.value.trim().length < 1) {
      setInputLogin((prev) => ({
        ...prev,
        error: "Поле логин не может быть пустым",
      }));
      return;
    }

    if (!inputLogin.value.includes("@")) {
      setInputLogin((prev) => ({
        ...prev,
        error: "Логин должен содержать символ @",
      }));
      return;
    }

    if (inputPassword.value.trim().length < 7) {
      setInputPassword((prev) => ({
        ...prev,
        error: "Минимальная длина пароля 7 символов",
      }));
      return;
    }

    if (inputRepeatPassword.value.trim().length < 7) {
      setInputRepeatPassword((prev) => ({
        ...prev,
        error: "Минимальная длина поля 7 символов",
      }));
      return;
    }

    if (inputPassword.value.trim() !== inputRepeatPassword.value.trim()) {
      setInputPassword((prev) => ({ ...prev, error: "Пароли не совпадают" }));
      setInputRepeatPassword((prev) => ({
        ...prev,
        error: "Пароли не совпадают",
      }));
      return;
    }

    const { error } = await createNewUserTeamBD({
      newUserTeam: {
        userEmail: inputLogin.value.trim(),
        userPassword: inputPassword.value.trim(),
        userRole: currentUserTeamRole.trim(),
      },
    });

    if (error) {
      const myError = getErrorMessage(error);
      setCoreError(myError);

      setVariantSneckbar("error");
      setTextSneckbar(myError);
      setIsOpenSneckbar(true);

      return;
    }

    setVariantSneckbar("information");
    setTextSneckbar("Юзер создан");
    setIsOpenSneckbar(true);

    handleCancelChanges();
  };

  const FooterModalWindow = (
    <div className={style["modal-footer"]}>
      <Button onClick={handleCancelChanges} variant="error">
        Отменить
      </Button>
      <Button
        onClick={handleCreateNewUserTeam}
        variant="secondary"
        disabled={isLoading}
      >
        Добавить
      </Button>
    </div>
  );

  return (
    <>
      <Button
        onClick={handleOpenModalWindow}
        customClass={style["btn-add"]}
        variant="secondary"
        title="Добавить юзера"
      >
        <HiOutlineUserAdd />
      </Button>

      <ModalWindow
        isOpen={isOpenModalWindow}
        setIsOpen={setIsOpenModalWindow}
        title="Добавить нового юзера ?"
        footer={FooterModalWindow}
        style={{ width: "600px" }}
      >
        <div className={style["modal-container"]}>
          <Dropdown
            nameDropdown="Роль юзера"
            buttonText={currentUserTeamRole}
            variants={[Roles.USER, Roles.CREATOR]}
            onChange={handleChangeCurrentRole}
          ></Dropdown>
          <Input
            placeholder="Логин"
            inputStyle={{
              backgroundColor: "var(--background-secondary-color)",
            }}
            type="text"
            value={inputLogin.value}
            onChange={handleChangeInputLogin}
            error={inputLogin.error}
          ></Input>
          <Input
            placeholder="Пароль"
            inputStyle={{
              backgroundColor: "var(--background-secondary-color)",
            }}
            type="password"
            value={inputPassword.value}
            onChange={handleChangeInputPassword}
            error={inputPassword.error}
          ></Input>
          <Input
            placeholder="Повторите пароль"
            inputStyle={{
              backgroundColor: "var(--background-secondary-color)",
            }}
            type="password"
            value={inputRepeatPassword.value}
            onChange={handleChangeInputRepeatPassword}
            error={inputRepeatPassword.error}
          ></Input>
          {coreError && <p className={style["text-core-error"]}>{coreError}</p>}
        </div>
      </ModalWindow>

      <Snackbar
        open={isOpenSneckbar}
        setOpen={setIsOpenSneckbar}
        message={textSneckbar}
        variant={variantSneckbar}
      ></Snackbar>
    </>
  );
};

export const SettingPanelAddNewUser = memo(SettingPanelAddNewUserInitial);
