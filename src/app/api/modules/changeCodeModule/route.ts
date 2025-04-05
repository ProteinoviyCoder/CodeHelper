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

  const { moduleId, newCode } = await req.json();

  if (newCode.trim().length < 1) {
    return NextResponse.json(
      { message: "Минимально кол-во символов 1" },
      { status: 403 }
    );
  }

  if (newCode.trim().length > 20000) {
    return NextResponse.json(
      { message: "Максимальное кол-во символов 20.000" },
      { status: 403 }
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
      data: { code: newCode },
    });
    currentModule.code = newCode;
  } catch (error) {
    return NextResponse.json(
      { message: "Ошибка БД", error: error },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Название модуля обновлено" });
}
