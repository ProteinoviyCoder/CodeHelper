export const formatCode = (code: string) => {
  const cleanedCode = code.replace(/\s+/g, " ").trim();

  let formattedCode = "";
  let indentLevel = 0;

  const lines = cleanedCode
    .split(/(<script.*?>|<\/script>|{|}|;|\n|\/\*|\*\/|\/\/.*?(\n|$))/)
    .filter(Boolean);

  lines.forEach((line) => {
    if (line === "}" || line.trim().endsWith("*/")) {
      indentLevel--;
    }

    if (line.trim()) {
      const trimmedLine = line.trim();

      if (trimmedLine === ";") {
        formattedCode = formattedCode.trim() + line + "\n";
      } else if (trimmedLine === "<script>" || trimmedLine === "</script>") {
        formattedCode += "\n" + trimmedLine + "\n";
      } else if (trimmedLine.startsWith("/*")) {
        formattedCode += "\n" + "  ".repeat(indentLevel) + trimmedLine + "\n";
      } else if (trimmedLine.endsWith("*/")) {
        formattedCode += "  ".repeat(indentLevel) + trimmedLine + "\n\n";
      } else if (trimmedLine.startsWith("*") && !trimmedLine.endsWith("*/")) {
        formattedCode += "  ".repeat(indentLevel) + trimmedLine + "\n";
      } else if (trimmedLine.startsWith("//")) {
        formattedCode += "  ".repeat(indentLevel) + trimmedLine + "\n";
      } else {
        formattedCode += "  ".repeat(indentLevel) + trimmedLine + "\n";
      }

      if (line === "{" || trimmedLine.startsWith("/*")) {
        indentLevel++;
      }
    }
  });

  // Теперь постобработка: вставим переносы после всех закрывающих и одиночных html-тегов
  const htmlTags = [
    "div",
    "a",
    "ul",
    "li",
    "p",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "span",
    "section",
    "article",
    "nav",
    "header",
    "footer",
    "main",
    "aside",
    "button",
    "input",
    "textarea",
    "form",
    "label",
    "img",
    "table",
    "thead",
    "tbody",
    "tr",
    "td",
    "th",
    "strong",
    "em",
    "small",
    "style",
  ];

  const tagRegex = new RegExp(`(</?(${htmlTags.join("|")})(\\s[^>]*)?>)`, "gi");

  const withLineBreaks = formattedCode.replace(tagRegex, "$1\n");

  // Удалим лишние повторные переносы
  return withLineBreaks.replace(/\n{2,}/g, "\n");
};
