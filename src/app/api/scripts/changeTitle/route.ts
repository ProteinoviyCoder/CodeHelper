import { checkedAllowedRoles, verifyUserToken } from "@/shared/model/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getAllScripts } from "../cache";
import prisma from "../../../../../prisma/prisma";
import { validationInput } from "@/shared/model/lib/validation";

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

  const { scriptId, versionId, newTitle } = await req.json();

  if (newTitle.length > 50) {
    return NextResponse.json(
      { message: "Максимальное кол-во символов 50" },
      { status: 403 }
    );
  }

  if (newTitle.trim().length < 1) {
    return NextResponse.json(
      { message: "Минимально кол-во символов - 1" },
      { status: 403 }
    );
  }

  const reportValidation = validationInput(
    newTitle[newTitle.length - 1],
    newTitle
  );

  if (reportValidation.status) {
    return NextResponse.json(
      { message: reportValidation.message },
      { status: 403 }
    );
  }

  const allScripts = await getAllScripts();
  const currentScript = allScripts.find((script) => script.id === scriptId);

  if (!currentScript) {
    return NextResponse.json(
      { message: "Такого скрипта не существует или скрипт был удален" },
      { status: 404 }
    );
  }

  const currentVersion = currentScript.versions.find(
    (version) => version.id === versionId
  );

  if (!currentVersion) {
    return NextResponse.json(
      {
        message: "Такой версии скрипта не существует или версия была удалена",
      },
      { status: 404 }
    );
  }

  try {
    await prisma.version.update({
      where: { id: versionId },
      data: { name: newTitle },
    });
    currentVersion.name = newTitle;
  } catch (error) {
    return NextResponse.json(
      { message: "Ошибка", error: error },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Заголвок версии скрипта обновлен" });
}
