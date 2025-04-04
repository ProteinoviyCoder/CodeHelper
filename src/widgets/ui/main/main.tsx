import style from "./main.module.scss";
import { FC, memo, ReactNode } from "react";

type MainInitialProps = {
  children: ReactNode;
};

const MainInitial: FC<MainInitialProps> = ({ children }) => {
  return (
    <main className={style["main"]}>
      <div className={style["container"]}>{children}</div>
    </main>
  );
};

export const Main = memo(MainInitial);
