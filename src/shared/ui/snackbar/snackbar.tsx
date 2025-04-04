"use client";

import { FC, memo, useEffect, useState } from "react";
import style from "./snackbar.module.scss";
import { createPortal } from "react-dom";
import { AiFillInfoCircle } from "react-icons/ai";

type SnackbarInitialProps = {
  message: string;
  open: boolean;
  setOpen: (a: boolean) => void;
  variant: "information" | "error";
};

const SnackbarInitial: FC<SnackbarInitialProps> = ({
  message,
  open,
  setOpen,
  variant,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (open && isOpen) return;

    setIsOpen(open);

    const timeoutClose = setTimeout(() => {
      setIsOpen(false);
      setOpen(false);
    }, 2500);

    return () => clearTimeout(timeoutClose);
  }, [open]);

  if (!isOpen) return null;

  return createPortal(
    <div className={`${style["container-snackbar"]} ${style[variant]}`}>
      <span>
        <AiFillInfoCircle />
      </span>
      <p>{message}</p>
    </div>,
    document.body
  );
};

export const Snackbar = memo(SnackbarInitial);
