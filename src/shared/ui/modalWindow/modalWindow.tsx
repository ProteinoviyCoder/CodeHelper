"use client";

import { createPortal } from "react-dom";
import style from "./modalWindow.module.scss";
import { Dispatch, FC, memo, ReactNode, SetStateAction } from "react";
import { Title } from "../title/title";
import { AiOutlineClose } from "react-icons/ai";

type ModalWindowInitialProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title?: string;
  children: ReactNode;
  style?: React.CSSProperties;
  footer?: ReactNode;
};

const ModalWindowInitial: FC<ModalWindowInitialProps> = ({
  isOpen,
  setIsOpen,
  title,
  children,
  style: ModalWindwoStyle,
  footer,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      className={style["modal-window-background"]}
      onMouseDown={() => setIsOpen(false)}
    >
      <div
        className={style["modal-window"]}
        onMouseDown={(e) => e.stopPropagation()}
        style={ModalWindwoStyle && { ...ModalWindwoStyle }}
      >
        <div className={style["modal_header"]}>
          {title && <Title size="s2">{title}</Title>}
          <span onClick={() => setIsOpen(false)} className={style["icon-btn"]}>
            <AiOutlineClose />
          </span>
        </div>
        <div className={style["modal-content"]}>{children}</div>
        {footer && <div className={style["modal-footer"]}>{footer}</div>}
      </div>
    </div>,
    document.body
  );
};

export const ModalWindow = memo(ModalWindowInitial);
