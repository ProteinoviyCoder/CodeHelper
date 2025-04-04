import { checkedAllowedRoles, verifyUserToken } from "@/shared/model/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";
import { getAllUsers } from "../../auth/cache";

export async function POST(req: NextRequest) {
  const report = verifyUserToken(req);
  if (report.status) {
    return NextResponse.json({ message: report.message }, { status: 401 });
  }

  const { userId } = report.tokenPayload!;
  const isAllowedRole = await checkedAllowedRoles(userId, ["owner", "admin"]);

  if (!isAllowedRole) {
    return NextResponse.json({ message: "Недостаточно прав" }, { status: 403 });
  }

  const { userTeamId } = await req.json();

  const allUsersTeam = await getAllUsers();
  const currentUserTeamIndex = allUsersTeam.findIndex(
    (user) => user.id === userTeamId
  );

  if (currentUserTeamIndex === -1) {
    return NextResponse.json(
      { message: "Такого юзера не существует или юзер был удален" },
      { status: 404 }
    );
  }

  try {
    await prisma.user.deleteMany({
      where: { id: userTeamId },
    });
    allUsersTeam.splice(currentUserTeamIndex, 1);
  } catch (error) {
    return NextResponse.json(
      { message: "Ошибка БД", error: error },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Юзер удалён" });
}
