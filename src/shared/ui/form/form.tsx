import style from "./form.module.scss";
import { FC, memo, ReactNode } from "react";

type FormInitialProps = {
  children: ReactNode;
};

const FormInitial: FC<FormInitialProps> = ({ children }) => {
  return <form className={style["form"]}>{children}</form>;
};

export const Form = memo(FormInitial);
