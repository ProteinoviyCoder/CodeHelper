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
  const isAllowedRole = await checkedAllowedRoles(userId, ["owner", "admin"]);

  if (!isAllowedRole) {
    return NextResponse.json({ message: "Недостаточно прав" }, { status: 403 });
  }

  const { moduleId } = await req.json();

  const allModules = await getAllModules();
  const currentModuleIndex = allModules.findIndex(
    (module) => module.id === moduleId
  );

  if (currentModuleIndex === -1) {
    return NextResponse.json(
      { message: "Такого модуля не существует или модуль был удален" },
      { status: 404 }
    );
  }

  try {
    await prisma.module.delete({
      where: { id: moduleId },
    });
    allModules.splice(currentModuleIndex, 1);
  } catch (error) {
    return NextResponse.json(
      { message: "Ошибка БД", error: error },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Модуль удалён" });
}
