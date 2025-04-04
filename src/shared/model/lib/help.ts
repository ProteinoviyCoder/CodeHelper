export const readerScriptsDescription = (text: string) => {
  return text.split(":;:");
};

export const getErrorMessage = (error: unknown) => {
  let errorMessage: string;
  if (error && typeof error === "object" && "data" in error) {
    const myError = error as { data: { message?: string } };
    errorMessage = myError.data?.message || "Неизвестная ошибка";
    return errorMessage;
  }

  return "Неизвестная ошибка";
};
