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
  const isAllowedRole = await checkedAllowedRoles(userId, ["owner", "admin"]);

  if (!isAllowedRole) {
    return NextResponse.json({ message: "Недостаточно прав" }, { status: 403 });
  }

  const { scriptId } = await req.json();

  const allScripts = await getAllScripts();
  const currentScriptIndex = allScripts.findIndex(
    (script) => script.id === scriptId
  );

  if (currentScriptIndex === -1) {
    return NextResponse.json(
      { message: "Такого скрипта уже не существует" },
      { status: 404 }
    );
  }

  try {
    await prisma.script.deleteMany({
      where: { id: scriptId },
    });
    allScripts.splice(currentScriptIndex, 1);
  } catch (error) {
    return NextResponse.json(
      { message: "Ошибка", error: error },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Скрипт удален" });
}
