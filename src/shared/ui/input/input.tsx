"use client";

import style from "./input.module.scss";
import { FC, memo, ReactNode, useState } from "react";
import { HiEye, HiEyeSlash } from "react-icons/hi2";

type InputInitialProps = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputStyle?: React.CSSProperties;
  type: "text" | "number" | "password";
  placeholder?: string;
  autoComplete?: string;
  icon?: ReactNode;
  error?: string;
};

const InputInitial: FC<InputInitialProps> = ({
  value,
  onChange,
  onKeyDown,
  inputStyle,
  type,
  placeholder,
  autoComplete,
  icon,
  error,
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isVisiblePassword, setIsVisiblePassword] = useState<boolean>(false);

  const stylePasswordInput: React.CSSProperties =
    type === "password" ? { paddingRight: "45px" } : {};

  return (
    <div className={style["div-input"]} style={{ ...inputStyle }}>
      {/* Имя инпута */}
      {placeholder && (
        <p
          className={`${style["input-name"]} ${
            isFocused || (typeof value === "string" && value.length > 0)
              ? style["input-name-focused"]
              : ""
          }`}
        >
          {placeholder}
        </p>
      )}

      {/* Инпут */}
      <input
        onKeyDown={onKeyDown}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={style["input"]}
        style={{ ...stylePasswordInput }}
        type={type === "password" && isVisiblePassword ? "text" : type}
        autoComplete={autoComplete && autoComplete}
        value={value}
      />

      {/* Иконки */}
      {type === "password" && (
        <span
          className={style["icon-password"]}
          onClick={() => setIsVisiblePassword(!isVisiblePassword)}
        >
          {isVisiblePassword ? <HiEye /> : <HiEyeSlash />}
        </span>
      )}

      {icon && icon}
      {error && <p className={style["error"]}>{error}</p>}
    </div>
  );
};

export const Input = memo(InputInitial);
