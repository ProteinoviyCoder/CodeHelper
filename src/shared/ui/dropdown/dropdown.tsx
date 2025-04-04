"use client";

import { FC, memo, useEffect, useRef, useState } from "react";
import style from "./dropdown.module.scss";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";

type DropdownInitialProps = {
  buttonText: string;
  variants: string[] | null;
  customClass?: string;
  nameDropdown?: string;
  onChange?: (e: React.MouseEvent<HTMLLIElement>) => void;
  dontChangeBtnText?: boolean;
};

const DropdownInitial: FC<DropdownInitialProps> = ({
  buttonText,
  variants,
  customClass,
  nameDropdown,
  onChange,
  dontChangeBtnText,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [textDropdown, setTextDropdown] = useState<string>(buttonText);
  const [isAddingClass, setIsAddingClass] = useState<boolean>(false);

  const listRef = useRef<HTMLUListElement>(null);
  const btnDropdownRef = useRef<HTMLButtonElement>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickListener = (e: MouseEvent): void => {
    !dropdownRef.current?.contains(e.target as Node) && setIsOpen(false);
  };

  const calculateHeight = () => {
    console.log(1);
    if (btnDropdownRef.current === null) return;
    console.log(2);

    const heightList = 200;
    const windowHeight = window.innerHeight;
    const sizeFromTopWindowToBottomList =
      btnDropdownRef.current.getBoundingClientRect().bottom;

    const result = windowHeight - sizeFromTopWindowToBottomList;

    console.log(result);
    if (result < heightList) {
      setIsAddingClass(true);
      return;
    }
    setIsAddingClass(false);
  };

  const debounce = (func: () => void, delay: number) => {
    let timer: NodeJS.Timeout;

    return function () {
      clearTimeout(timer);

      timer = setTimeout(() => {
        func();
      }, delay);
    };
  };

  const debounceCalculateHeight = debounce(calculateHeight, 300);

  useEffect(() => {
    document.addEventListener("click", handleClickListener);

    return () => {
      document.removeEventListener("click", handleClickListener);
    };
  }, []);

  useEffect(() => {
    calculateHeight();

    document.body.addEventListener("scroll", debounceCalculateHeight, {
      capture: true,
    });
    window.addEventListener("resize", debounceCalculateHeight);

    return () => {
      document.body.removeEventListener("scroll", debounceCalculateHeight);
      window.removeEventListener("resize", debounceCalculateHeight);
    };
  }, []);

  useEffect(() => {
    setTextDropdown(buttonText);
  }, [buttonText]);

  return (
    <div ref={dropdownRef} className={style["dropdown"]}>
      <p className={style["dropdown-name"]}>{nameDropdown}</p>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        ref={btnDropdownRef}
        className={`${style["dropdown_btn"]} ${
          customClass ? customClass : style["default-style-dropdown-btn"]
        } `}
        title={
          typeof textDropdown === "string" && textDropdown.length > 15
            ? textDropdown
            : ""
        }
      >
        <span className={style["btn-text"]}>{textDropdown}</span>
        <span
          className={`${style["btn-icon"]} ${
            isOpen && style["btn-icon__padding-top"]
          }`}
        >
          {isOpen ? <FaCaretUp /> : <FaCaretDown />}
        </span>
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          className={`${style["dropdown_menu"]} ${
            isAddingClass ? style["dropdown_menu__top"] : ""
          }`}
        >
          {variants ? (
            variants.map((variant, index) => {
              return (
                <li
                  key={index}
                  onClick={(e) => {
                    if (!dontChangeBtnText) {
                      setTextDropdown(variant);
                    }
                    setIsOpen(!isOpen);
                    onChange && onChange(e);
                  }}
                  className={style["dropdown_menu-item"]}
                  title={variant}
                >
                  {variant}
                </li>
              );
            })
          ) : (
            <li
              className={`${style["dropdown_menu-item-inactive"]} ${style["dropdown_menu-item"]}`}
              title="Ничего нет"
            >
              Ничего нет
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export const Dropdown = memo(DropdownInitial);
