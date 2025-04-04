import { checkedAllowedRoles, verifyUserToken } from "@/shared/model/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getAllModulesGroups, resetCacheModulesGroups } from "../cache";
import prisma from "../../../../../prisma/prisma";

export async function POST(req: NextRequest) {
  const report = verifyUserToken(req);
  if (report.status) {
    return NextResponse.json({ message: report.message }, { status: 401 });
  }

  const { userId } = report.tokenPayload!;
  const isAllowedRole = await checkedAllowedRoles(userId, [
    "owner",
    "admin",
    "creator",
  ]);

  if (!isAllowedRole) {
    return NextResponse.json({ message: "Недостаточно прав" }, { status: 403 });
  }

  const { newGroup } = await req.json();

  if (newGroup.trim().length < 1) {
    return NextResponse.json(
      { message: "Группа не может быть пустой" },
      { status: 409 }
    );
  }

  if (newGroup.length > 20) {
    return NextResponse.json(
      { message: "Максимальное кол-во символов для название группы 20" },
      { status: 409 }
    );
  }

  const allGroups = await getAllModulesGroups();
  const checkIsUniqueName = allGroups.find(
    (group) =>
      group.group.toLowerCase().trim() === newGroup.toLowerCase().trim()
  );

  if (checkIsUniqueName) {
    return NextResponse.json(
      { message: "Такая группа уже есть" },
      { status: 409 }
    );
  }

  try {
    await prisma.modulesGroup.create({
      data: {
        group: newGroup,
      },
    });
    resetCacheModulesGroups();
  } catch (error) {
    return NextResponse.json({ message: "Ошибка БД" }, { status: 404 });
  }

  return NextResponse.json({
    message: "Новая группа создана",
  });
}
