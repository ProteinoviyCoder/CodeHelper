import { ProfilePage } from "@/page/profile/ui/profilePage";
import { JSX } from "react";

export const metadata = {
  title: "CodeHelper | Команда",
  icons: {
    icon: "/favicon.png",
  },
};

export default function Profile(): JSX.Element {
  return <ProfilePage></ProfilePage>;
}
