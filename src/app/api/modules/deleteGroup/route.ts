import { checkedAllowedRoles, verifyUserToken } from "@/shared/model/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getAllModulesGroups } from "../cache";
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

  const { group }: { group: string } = await req.json();

  const allModulesGroups = await getAllModulesGroups();
  const currentModulesGroupIndex = allModulesGroups.findIndex(
    (modulesGroup) => modulesGroup.group === group
  );

  if (currentModulesGroupIndex === -1) {
    return NextResponse.json(
      { message: "Такой группы нет или она уже удалена" },
      { status: 404 }
    );
  }

  try {
    await prisma.modulesGroup.delete({
      where: { group: group },
    });

    allModulesGroups.splice(currentModulesGroupIndex, 1);
  } catch (error) {
    return NextResponse.json({ message: "Ошибка БД" }, { status: 404 });
  }

  return NextResponse.json({
    message: "Группа удалена",
  });
}
