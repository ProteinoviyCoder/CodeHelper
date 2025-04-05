"use client";

import style from "./switch.module.scss";
import { FC, memo, useEffect, useState } from "react";

type SwitchInitialProps = {
  onClick: () => void;
  isSwitch?: boolean;
};

const SwitchInitial: FC<SwitchInitialProps> = ({ onClick, isSwitch }) => {
  const [isActive, setIsActive] = useState<boolean>(
    typeof isSwitch === "boolean" ? isSwitch : false
  );

  const handleSwitchSwither = () => {
    setIsActive((prev) => !prev);
    onClick();
  };

  useEffect(() => {
    if (typeof isSwitch === "boolean") {
      setIsActive(isSwitch);
    }
  }, [isSwitch]);
  return (
    <label
      className={`${style["switch"]} ${isActive ? style["switch-active"] : ""}`}
      onChange={() => handleSwitchSwither()}
    >
      <input type="checkbox" />
    </label>
  );
};

export const Switch = memo(SwitchInitial);
