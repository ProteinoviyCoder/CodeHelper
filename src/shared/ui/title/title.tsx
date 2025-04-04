import { FC, memo, ReactNode } from "react";
import style from "./title.module.scss";

type TitleInitialProps = {
  children: ReactNode;
  size: "s1" | "s2" | "s3";
  style?: React.CSSProperties;
};

const TitleInitial: FC<TitleInitialProps> = ({
  children,
  size,
  style: styleTitle,
}) => {
  return (
    <p
      className={`${style["title"]} ${style[size]}`}
      style={styleTitle && { ...styleTitle }}
    >
      {children}
    </p>
  );
};

export const Title = memo(TitleInitial);
