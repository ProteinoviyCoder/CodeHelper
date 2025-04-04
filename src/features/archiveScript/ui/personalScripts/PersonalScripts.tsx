import style from "./PersonalScripts.module.scss";
import { FC, memo } from "react";

type PersonalScriptsInitialProps = {};

const PersonalScriptsInitial: FC<PersonalScriptsInitialProps> = () => {
  return <div>1</div>;
};

export const PersonalScripts = memo(PersonalScriptsInitial);
