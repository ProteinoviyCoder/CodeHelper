import { NextRequest, NextResponse } from "next/server";
import { getAllScripts } from "../cache";
import { verifyUserToken } from "@/shared/model/lib/auth";

export async function GET(req: NextRequest) {
  const report = verifyUserToken(req);
  if (report.status) {
    return NextResponse.json({ message: report.message }, { status: 401 });
  }

  const allScripts = await getAllScripts();

  if (!allScripts) {
    return NextResponse.json(
      { message: "Скрпиты сейчас не доступны" },
      { status: 404 }
    );
  }

  return NextResponse.json({ allScripts });
}
