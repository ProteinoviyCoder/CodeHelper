import { verifyUserToken } from "@/shared/model/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getAllModulesGroups } from "../cache";

export async function GET(req: NextRequest) {
  const report = verifyUserToken(req);
  if (report.status) {
    return NextResponse.json({ message: report.message }, { status: 401 });
  }

  const allModulesGroups = await getAllModulesGroups();

  if (!allModulesGroups) {
    return NextResponse.json(
      { message: "Группы модулей сейчас не доступны" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Группы модулей получены",
    groups: allModulesGroups,
  });
}
