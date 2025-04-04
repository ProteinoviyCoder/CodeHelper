import { checkedAllowedRoles, verifyUserToken } from "@/shared/model/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getAllScripts } from "../cache";
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

  const { scriptId, versionId, buttonId, newScript } = await req.json();

  if (newScript.length > 2999) {
    return NextResponse.json(
      { message: "Максимальное кол-во символов 2999" },
      { status: 403 }
    );
  }

  if (newScript.trim().length < 1) {
    return NextResponse.json(
      { message: "Минимально кол-во символов - 1" },
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

  const currentButton = currentVersion.buttons.find(
    (button) => button.id === buttonId
  );

  if (!currentButton) {
    return NextResponse.json(
      {
        message: "Такой код скрипта не существует или код был удалён",
      },
      { status: 404 }
    );
  }

  try {
    await prisma.button.update({
      where: { id: buttonId },
      data: { script: newScript },
    });
    currentButton.script = newScript;
  } catch (error) {
    return NextResponse.json(
      { message: "Ошибка", error: error },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Код скрипта обновлён" });
}
