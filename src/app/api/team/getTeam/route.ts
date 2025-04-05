import { NextRequest, NextResponse } from "next/server";
import { verifyUserToken } from "@/shared/model/lib/auth";
import { getAllUsers } from "../../auth/cache";

export async function GET(req: NextRequest) {
  const report = verifyUserToken(req);
  if (report.status) {
    return NextResponse.json({ message: report.message }, { status: 401 });
  }

  const allUsers = await getAllUsers();

  const allUsersTeam = allUsers.map((user) => {
    const {
      userPassword,
      userRefreshToken,
      updatedAt,
      themeId,
      userTheme,
      ...coreDataUser
    } = user;

    void userPassword;
    void userRefreshToken;
    void updatedAt;
    void themeId;
    void userTheme;

    return coreDataUser;
  });

  if (!allUsers) {
    return NextResponse.json(
      { message: "Команда сейчас не доступна" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Команда получена", team: allUsersTeam });
}
