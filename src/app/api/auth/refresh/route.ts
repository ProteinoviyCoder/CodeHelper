import { createJwtToken } from "@/shared/model/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { checkedRefreshToken } from "../cache";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("refresh_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Нет рефреш-токена" }, { status: 401 });
  }

  const result = await checkedRefreshToken(token);

  if (!result) {
    return NextResponse.json(
      { message: "Невалидный рефреш-токен" },
      { status: 401 }
    );
  }

  const newToken = createJwtToken(result.userEmail, result.id);

  const response = NextResponse.json({ message: "Токен обновлён" });
  response.cookies.set("auth_token", `${newToken}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.IS_PROD === "true" ? true : false,
    maxAge: 60 * 60,
  });

  return response;
}
