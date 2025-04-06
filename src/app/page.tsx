import { ModulesPage } from "@/page/modulesPage/ui/modulesPage";
import { JSX } from "react";

export const metadata = {
  title: "CodeHelper | Модули",
  icons: {
    icon: "/favicon.png",
  },
};

export default function Components(): JSX.Element {
  return <ModulesPage></ModulesPage>;
}
