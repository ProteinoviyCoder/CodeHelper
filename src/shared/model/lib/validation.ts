export const validationInput = (symbol: string, word: string) => {
  const report: { status: boolean; message: string } = {
    status: false,
    message: "",
  };
  if (symbol === "<" || symbol === ">") {
    report.status = true;
    report.message = `Недопустимый символ ${symbol}`;
    return report;
  }

  if (word.includes("<")) {
    report.status = true;
    report.message = `Недопустимый символ <`;
    return report;
  }

  if (word.includes(">")) {
    report.status = true;
    report.message = `Недопустимый символ >`;
    return report;
  }

  if (word.length > 50) {
    report.status = true;
    report.message = `Максимальное кол-во символов 50`;
    return report;
  }

  return report;
};

export const validationSubmitForm = (...inputs: string[]) => {
  let report = {
    status: false,
    message: "",
  };

  for (let inputValue of inputs) {
    const word = inputValue;
    const lastSymbol = inputValue[inputValue.length - 1];
    const result = validationInput(lastSymbol, word);

    if (result.status) {
      report.status = result.status;
      report.message = result.message;
      return report;
    }

    if (inputValue.length === 0) {
      report.status = true;
      report.message = "Все поля должны быть заполнены";

      return report;
    }
  }

  return report;
};
