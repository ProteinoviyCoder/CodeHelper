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

  const { userTeamId, newRole }: { userTeamId: number; newRole: string } =
    await req.json();

  if (
    newRole.trim().toLowerCase() !== "admin" &&
    newRole.trim().toLowerCase() !== "creator" &&
    newRole.trim().toLowerCase() !== "user"
  ) {
    return NextResponse.json({ message: "Такой роли нет" }, { status: 403 });
  }

  const allUsers = await getAllUsers();
  const currentUserTeam = allUsers.find((user) => user.id === userTeamId);

  if (!currentUserTeam) {
    return NextResponse.json(
      { message: "Такого юзера нет в команде или он был удалён" },
      { status: 404 }
    );
  }

  const isOwner = await checkedAllowedRoles(userId, ["owner"]);

  if (!isOwner && currentUserTeam.userRole.trim().toLowerCase() === "admin") {
    return NextResponse.json(
      { message: "Вы не можете поменять роль админу" },
      { status: 404 }
    );
  }

  if (currentUserTeam.userRole.trim().toLowerCase() === "owner") {
    return NextResponse.json(
      { message: "Вы не можете поменять роль админу" },
      { status: 404 }
    );
  }

  try {
    await prisma.user.update({
      where: { id: userTeamId },
      data: { userRole: newRole },
    });
    currentUserTeam.userRole = newRole;
  } catch (error) {
    return NextResponse.json(
      { message: "Ошибка БД", error: error },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Роль юзера команды обнавлена" });
}
