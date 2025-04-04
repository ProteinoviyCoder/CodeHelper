import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Токены сброшены" });

  response.cookies.set("auth_token", ``, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.IS_PROD === "true" ? true : false,
    maxAge: 60 * 60,
  });

  response.cookies.set("refresh_token", ``, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.IS_PROD === "true" ? true : false,
    maxAge: 60 * 60,
  });

  return response;
}
