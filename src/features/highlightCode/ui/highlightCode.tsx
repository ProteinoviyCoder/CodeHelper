"use client";

import { FC, memo, useEffect } from "react";
import "prismjs/themes/prism-okaidia.css";
import "prismjs";
import "prismjs/components/prism-javascript.min.js";
import { formatCode } from "../model/functions";

type HighlightCodeInitialProps = {
  dependencies?: (string | number)[];
  code: string;
};

const HighlightCodeInitial: FC<HighlightCodeInitialProps> = ({
  code,
  dependencies,
}) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("prismjs").then((Prism) => {
        Prism.highlightAll();
      });
    }
  }, dependencies || []);

  return (
    <pre
      style={{
        borderRadius: "15px",
        margin: "0px",
      }}
    >
      <code className={`language-javascript`}>{formatCode(code)}</code>
    </pre>
  );
};

export const HighlightCode = memo(HighlightCodeInitial);
