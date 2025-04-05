import { BsArrowRight } from "react-icons/bs";
import style from "./activePanel.module.scss";
import { Dispatch, FC, memo, ReactNode, SetStateAction } from "react";

type ActivePanelInitialProps = {
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onClick?: () => void;
};

const ActivePanelInitial: FC<ActivePanelInitialProps> = ({
  children,
  isOpen,
  setIsOpen,
  onClick: onClickContainer,
}) => {
  if (!isOpen) return;

  return (
    <div
      onMouseDown={() => {
        setIsOpen(false);
        if (onClickContainer) {
          onClickContainer();
        }
      }}
      className={`${style["description-container"]} ${
        isOpen ? style["description-container-active"] : ""
      }`}
    >
      <span className={style["description-container__close-icon"]}>
        <BsArrowRight />
      </span>
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className={style["description"]}
      >
        {children}
      </div>
    </div>
  );
};

export const ActivePanel = memo(ActivePanelInitial);
