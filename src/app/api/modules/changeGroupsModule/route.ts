import { checkedAllowedRoles, verifyUserToken } from "@/shared/model/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";
import { getAllModules } from "../cache";

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

  const { moduleId, newGroups } = await req.json();

  for (const group of newGroups) {
    if (group.trim().length < 1) {
      return NextResponse.json(
        { message: "Группа не может быть пустой" },
        { status: 409 }
      );
    }
    if (group.length > 20) {
      return NextResponse.json(
        { message: "Максимальное кол-во символо для названия группы 20" },
        { status: 409 }
      );
    }
  }

  const allModules = await getAllModules();
  const currentModule = allModules.find((module) => module.id === moduleId);

  if (!currentModule) {
    return NextResponse.json(
      { message: "Такого модуля не существует или модуль был удален" },
      { status: 404 }
    );
  }

  try {
    await prisma.module.update({
      where: { id: moduleId },
      data: { groups: newGroups },
    });
    currentModule.groups = newGroups;
  } catch (error) {
    return NextResponse.json(
      { message: "Ошибка БД", error: error },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Группы модуля обновлены" });
}
