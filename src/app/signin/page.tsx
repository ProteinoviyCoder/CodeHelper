import { SigninPage } from "@/page/signin/ui/signin";
import { JSX } from "react";

export const metadata = {
  title: "CodeHelper | Команда",
  icons: {
    icon: "/favicon.png",
  },
};

export default function Signin(): JSX.Element {
  return <SigninPage></SigninPage>;
}
