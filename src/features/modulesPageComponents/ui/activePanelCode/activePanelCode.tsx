"use client";

import style from "./activePanelCode.module.scss";
import { HighlightCode } from "@/features/highlightCode/ui/highlightCode";
import { Button } from "@/shared/ui/button/button";
import { Title } from "@/shared/ui/title/title";
import { ChangeEvent, FC, memo, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { useUpdateCodeModuleMutation } from "../../api/modulesEndpoints";
import { getErrorMessage } from "@/shared/model/lib/help";
import { Snackbar } from "@/shared/ui/snackbar/snackbar";

type ActivePanelCodeInitialProps = {
  id: number;
  code: string;
};

const ActivePanelCodeInitial: FC<ActivePanelCodeInitialProps> = ({
  id,
  code,
}) => {
  const [updateCodeModuleBD, { isLoading }] = useUpdateCodeModuleMutation();

  const [isVisibleTextarea, setIsVisibleTextarea] = useState<boolean>(false);
  const [valueTextareaCode, setValueTextareaCode] = useState<string>(code);
  const [errotTextareaCode, setErrotTextareaCode] = useState<string>("");
  const [isOpenSneckbar, setIsOpenSneckbar] = useState<boolean>(false);
  const [textSneckbar, setTextSneckbar] = useState<string>("");
  const [variantSneckbar, setVariantSneckbar] = useState<
    "error" | "information"
  >("information");

  const handleChahgeValueTextareaCode = (
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    const code = e.target.value;

    if (errotTextareaCode) {
      setErrotTextareaCode("");
    }

    if (code.length > 20000) {
      setErrotTextareaCode("Максимальное кол-во символов 20.000");
      return;
    }

    setValueTextareaCode(code);
  };

  const handleShowTextareaCode = () => {
    setIsVisibleTextarea(true);
  };

  const hnadleCancelChanges = () => {
    if (errotTextareaCode) {
      setErrotTextareaCode("");
    }
    setValueTextareaCode(code);
    setIsVisibleTextarea(false);
  };

  const handleChangeCodeModule = async () => {
    if (valueTextareaCode.length < 1) {
      setErrotTextareaCode("Поле не может быть пустым");
      return;
    }

    const { error } = await updateCodeModuleBD({
      moduleId: id,
      newCode: valueTextareaCode.trim(),
    });

    if (error) {
      const myError = getErrorMessage(error);
      setErrotTextareaCode(myError);

      setVariantSneckbar("error");
      setTextSneckbar(myError);
      setIsOpenSneckbar(true);

      return;
    }

    setVariantSneckbar("information");
    setTextSneckbar("Код модуля изменён");
    setIsOpenSneckbar(true);

    setIsVisibleTextarea(false);
  };

  return (
    <>
      <Title style={{ marginBottom: "5px" }} size="s2">
        Код модуля:
      </Title>
      <div className={style["container"]}>
        <div className={style["code"]}>
          {isVisibleTextarea ? (
            <textarea
              value={valueTextareaCode}
              onChange={handleChahgeValueTextareaCode}
              className={style["textarea"]}
              name="codeModule"
            ></textarea>
          ) : (
            <HighlightCode code={code} dependencies={[code]}></HighlightCode>
          )}
        </div>

        {errotTextareaCode && (
          <p className={style["text-error"]}>{errotTextareaCode}</p>
        )}

        <div className={style["buttons"]}>
          {isVisibleTextarea ? (
            <>
              <Button onClick={hnadleCancelChanges} variant="error">
                Отменить
              </Button>
              <Button
                onClick={handleChangeCodeModule}
                variant="secondary"
                disabled={isLoading}
              >
                Сохранить
              </Button>
            </>
          ) : (
            <Button
              onClick={handleShowTextareaCode}
              customClass={style["btn-change"]}
              variant="secondary"
            >
              <AiFillEdit />
            </Button>
          )}
        </div>
        <Snackbar
          open={isOpenSneckbar}
          setOpen={setIsOpenSneckbar}
          message={textSneckbar}
          variant={variantSneckbar}
        ></Snackbar>
      </div>
    </>
  );
};

export const ActivePanelCode = memo(ActivePanelCodeInitial);
