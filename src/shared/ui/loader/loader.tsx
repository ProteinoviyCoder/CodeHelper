import style from "./loader.module.scss";
import { FC, memo } from "react";

const LoaderInitial: FC = () => {
  return (
    <div className={style["div-loader"]}>
      <p className={style["loading-text"]}>loading...</p>
      <div className={style["loader"]}></div>
    </div>
  );
};

export const Loader = memo(LoaderInitial);
