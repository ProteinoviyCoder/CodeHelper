"uce client";

import { Title } from "@/shared/ui/title/title";
import { TeamuUser } from "../../model/types";
import style from "./teamUser.module.scss";
import { Dispatch, FC, memo, SetStateAction, useState } from "react";
import { FiUser } from "react-icons/fi";
import { ActivePanel } from "@/shared/ui/activePanel/activePanel";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { ActivePanelUserInfo } from "../activePanelUserInfo/activePanelUserInfo";
import { User } from "@/entities/user/model/types";
import { Permissions } from "@/shared/model/config/permissions";

type TeamUserInitialProps = {
  userTeam: TeamuUser;
  userData?: User;
  parentSnackbar: {
    setIsOpenSneckbar: Dispatch<SetStateAction<boolean>>;
    setTextSneckbar: Dispatch<SetStateAction<string>>;
    setVariantSneckbar: Dispatch<SetStateAction<"error" | "information">>;
  };
};

const TeamUserInitial: FC<TeamUserInitialProps> = ({
  userTeam,
  userData,
  parentSnackbar,
}) => {
  const [isOpenActivePanel, setIsOpenActivePanel] = useState<boolean>(false);

  const dataCreatedUser = userTeam.createdAt
    .slice(0, 10)
    .split("-")
    .reverse()
    .join(".");

  const handleOpenActivePanel = () => {
    setIsOpenActivePanel(true);
  };
  return (
    <div className={style["user-card"]}>
      <div className={style["user-card__img"]}>
        {userTeam.userImg ? (
          <img src={userTeam.userImg} alt="userTeam-img" />
        ) : (
          <FiUser />
        )}
      </div>
      <div className={style["user-card__info"]}>
        <div>
          <p>Логин: </p>
          <Title size="s1">{userTeam.userEmail}</Title>
        </div>
        <div>
          <p>Имя пользователя: </p>
          <Title size="s1">{userTeam.username}</Title>
        </div>
        <div>
          <p>Роль: </p>
          <Title size="s1">{userTeam.userRole}</Title>
        </div>
        <div>
          <p>В сисстеме с </p>
          <Title size="s1">{dataCreatedUser}</Title>
        </div>
      </div>
      {userData && Permissions.teamPage.includes(userData.userRole) && (
        <div
          onClick={handleOpenActivePanel}
          className={style["user-card__change-btn"]}
        >
          <HiMiniPencilSquare />
        </div>
      )}

      <ActivePanel isOpen={isOpenActivePanel} setIsOpen={setIsOpenActivePanel}>
        <ActivePanelUserInfo
          userTeam={userTeam}
          userData={userData}
          parentSnackbar={parentSnackbar}
        ></ActivePanelUserInfo>
      </ActivePanel>
    </div>
  );
};

export const TeamUser = memo(TeamUserInitial);
