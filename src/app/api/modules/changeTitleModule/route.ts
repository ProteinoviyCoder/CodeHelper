import { checkedAllowedRoles, verifyUserToken } from "@/shared/model/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";
import { validationInput } from "@/shared/model/lib/validation";
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

  const { moduleId, newTitle } = await req.json();

  if (newTitle.trim().length < 1) {
    return NextResponse.json(
      { message: "Минимально кол-во символов 1" },
      { status: 403 }
    );
  }

  const reportValidation = validationInput(newTitle[newTitle.length], newTitle);

  if (reportValidation.status) {
    return NextResponse.json(
      { message: reportValidation.message },
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
      data: { name: newTitle },
    });
    currentModule.name = newTitle;
  } catch (error) {
    return NextResponse.json(
      { message: "Ошибка БД", error: error },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Название модуля обновлено" });
}
