import { FC, memo, ReactNode, useEffect } from "react";
import style from "./button.module.scss";
import { ImSpinner8 } from "react-icons/im";

type ButtonInitialProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "error";
  customClass?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  styleButton?: React.CSSProperties;
  disabled?: boolean;
  title?: string;
};

const ButtonInitial: FC<ButtonInitialProps> = ({
  children,
  variant,
  customClass,
  onClick,
  styleButton,
  disabled,
  title,
}) => {
  return (
    <button
      onClick={onClick}
      className={`${style["button"]} ${style[variant ? variant : ""]} ${
        customClass ? customClass : style["default-btn"]
      }`}
      style={styleButton && { ...styleButton }}
      disabled={disabled}
      title={title && title}
    >
      {children}
      {disabled && (
        <span className={style["loader"]}>
          <ImSpinner8 />
        </span>
      )}
    </button>
  );
};

export const Button = memo(ButtonInitial);
