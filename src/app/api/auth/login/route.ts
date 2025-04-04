import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";
import {
  checkedPassword,
  createJwtToken,
  createRefreshToken,
} from "@/shared/model/lib/auth";
import { validationSubmitForm } from "@/shared/model/lib/validation";
import { checkedRefreshToken, getAllUsers } from "../cache";

export async function POST(req: Request) {
  const { password, email } = await req.json();

  const report = validationSubmitForm(password, email);

  if (report.status) {
    return NextResponse.json({ message: report.message }, { status: 404 });
  }

  if (password.length < 7) {
    return NextResponse.json(
      { message: "Минимальная длина пароля - 7 символов" },
      { status: 404 }
    );
  }

  const allUsers = await getAllUsers();

  const currentUser = allUsers.find((user) => user.userEmail === email);

  if (!currentUser) {
    return NextResponse.json(
      { message: "Такого пользователя не существует" },
      { status: 404 }
    );
  }

  const hashedPassword = await checkedPassword(
    password,
    currentUser.userPassword
  );

  if (!hashedPassword) {
    return NextResponse.json(
      {
        message: "Неверные имя пользователя или пароль",
      },
      { status: 404 }
    );
  }

  const oldRefreshToken = currentUser.userRefreshToken;
  let resultCheckRefreshToken = null;
  if (oldRefreshToken) {
    resultCheckRefreshToken = await checkedRefreshToken(oldRefreshToken);
  }

  let jwtRefreshToken;
  if (!resultCheckRefreshToken) {
    jwtRefreshToken = createRefreshToken(currentUser.userEmail, currentUser.id);

    try {
      await prisma.user.update({
        where: { id: currentUser.id },
        data: { userRefreshToken: jwtRefreshToken },
      });
    } catch (error) {
      console.error(error);
    }
    currentUser.userRefreshToken = jwtRefreshToken;
  } else {
    jwtRefreshToken = currentUser.userRefreshToken;
  }

  const {
    userPassword,
    userRefreshToken,
    createdAt,
    updatedAt,
    ...userWithoutPasswordAndRefreshToken
  } = currentUser;

  const jwtToken = createJwtToken(currentUser.userEmail, currentUser.id);

  const response = NextResponse.json({
    ...userWithoutPasswordAndRefreshToken,
  });

  response.cookies.set("auth_token", `${jwtToken}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.IS_PROD === "true" ? true : false,
    maxAge: 60 * 60,
  });

  response.cookies.set("refresh_token", `${jwtRefreshToken}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.IS_PROD === "true" ? true : false,
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
