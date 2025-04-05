import { MyScriptsPage } from "@/page/myArchive/ui/myScripts";
import { JSX } from "react";

export const metadata = {
  title: "CodeHelper | Команда",
  icons: {
    icon: "/favicon.png",
  },
};

export default function MyScripts(): JSX.Element {
  return <MyScriptsPage></MyScriptsPage>;
}
