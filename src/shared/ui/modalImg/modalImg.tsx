import style from "./modalImg.module.scss";
import { Dispatch, FC, memo, SetStateAction } from "react";
import { createPortal } from "react-dom";

type ModalImgInitial = {
  src: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const ModalImgInitial: FC<ModalImgInitial> = ({
  src: srcImg,
  isOpen,
  setIsOpen,
}) => {
  if (!isOpen) return;
  const handleCloseModalImg = () => {
    setIsOpen(false);
  };

  return createPortal(
    <div onClick={handleCloseModalImg} className={style["container-modal-img"]}>
      {/* <Image className={style["modal-img"]} width={180} height={120} src={srcImg} alt="#"></Image> */}
      <img className={style["modal-img"]} src={srcImg} alt="#" />
      <span className={style["close-btn"]}>x</span>
    </div>,
    document.body
  );
};

export const ModalImg = memo(ModalImgInitial);
