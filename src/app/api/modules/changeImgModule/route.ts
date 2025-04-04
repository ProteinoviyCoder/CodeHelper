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

  const { moduleId, newImg } = await req.json();

  if (newImg === "") {
    return NextResponse.json({ message: "Файл не выбран" }, { status: 404 });
  }

  if (typeof newImg !== "string") {
    return NextResponse.json(
      { message: "Неподдерживаемый тип файла" },
      { status: 404 }
    );
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
      data: { img: newImg },
    });
    currentModule.img = newImg;
  } catch (error) {
    return NextResponse.json(
      { message: "Ошибка БД", error: error },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Картинка модуля обновлена" });
}
