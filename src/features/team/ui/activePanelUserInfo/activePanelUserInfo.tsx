import style from "./activePanelUserInfo.module.scss";
import { Dispatch, FC, memo, SetStateAction } from "react";
import { TeamuUser } from "../../model/types";
import { FiUser } from "react-icons/fi";
import { Title } from "@/shared/ui/title/title";
import { User } from "@/entities/user/model/types";
import { ActivePanelUserRole } from "../activePanelUserRole/activePanelUserRole";
import { ActivePanelUserDelete } from "../activePanelUserDelete/activePanelUserDelete";

type ActivePanelUserInfoInitialProps = {
  userTeam: TeamuUser;
  userData?: User;
  parentSnackbar: {
    setIsOpenSneckbar: Dispatch<SetStateAction<boolean>>;
    setTextSneckbar: Dispatch<SetStateAction<string>>;
    setVariantSneckbar: Dispatch<SetStateAction<"error" | "information">>;
  };
};

const ActivePanelUserInfoInitial: FC<ActivePanelUserInfoInitialProps> = ({
  userTeam,
  userData,
  parentSnackbar,
}) => {
  const dataCreatedUser = userTeam.createdAt
    .slice(0, 10)
    .split("-")
    .reverse()
    .join(".");
  return (
    <div className={style["container"]}>
      <div className={style["user-img"]}>
        {userTeam.userImg ? (
          <img src={userTeam.userImg} alt="user-img" />
        ) : (
          <FiUser />
        )}
      </div>
      <div className={style["user-info"]}>
        <div>
          <p>Логин: </p>
          <Title size="s1">{userTeam.userEmail}</Title>
        </div>
        <div>
          <p>Имя пользователя: </p>
          <Title size="s1">{userTeam.username}</Title>
        </div>
        <ActivePanelUserRole
          userTeamRole={userTeam.userRole}
          userData={userData}
          userTeamId={userTeam.id}
        ></ActivePanelUserRole>
        <div>
          <p>В сисстеме с </p>
          <Title size="s1">{dataCreatedUser}</Title>
        </div>
        <div>
          <ActivePanelUserDelete
            userData={userData}
            userTeamRole={userTeam.userRole}
            userTeamId={userTeam.id}
            parentSnackbar={parentSnackbar}
          ></ActivePanelUserDelete>
        </div>
      </div>
    </div>
  );
};

export const ActivePanelUserInfo = memo(ActivePanelUserInfoInitial);
