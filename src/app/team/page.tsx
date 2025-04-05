import { TeamPage } from "@/page/team/ui/teamPage";
import { JSX } from "react";

export const metadata = {
  title: "CodeHelper | Команда",
  icons: {
    icon: "/favicon.png",
  },
};

export default function Team(): JSX.Element {
  return <TeamPage></TeamPage>;
}
