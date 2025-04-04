import { NextRequest, NextResponse } from "next/server";
import {
  checkedAllowedRoles,
  hashPassword,
  verifyUserToken,
} from "@/shared/model/lib/auth";
import prisma from "../../../../../prisma/prisma";
import { getAllUsers, resetCacheAllUsers } from "../../auth/cache";

type NewUserTeam = {
  userEmail: string;
  userPassword: string;
  userRole: string;
};

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

  const { newUserTeam }: { newUserTeam: NewUserTeam } = await req.json();

  if (!newUserTeam) {
    return NextResponse.json(
      { message: "Недостаточно данных" },
      { status: 409 }
    );
  }

  if (newUserTeam.userEmail.length > 50) {
    return NextResponse.json(
      { message: "Максимальная длина логина 50 символов" },
      { status: 409 }
    );
  }

  if (newUserTeam.userEmail.trim().length < 1) {
    return NextResponse.json(
      { message: "Поле логин не может быть пустым" },
      { status: 409 }
    );
  }

  if (!newUserTeam.userEmail.includes("@")) {
    return NextResponse.json(
      { message: "Логин должен содержать символ @" },
      { status: 409 }
    );
  }

  if (newUserTeam.userPassword.length > 50) {
    return NextResponse.json(
      { message: "Максимальная длина пароля 50 символов" },
      { status: 409 }
    );
  }

  if (newUserTeam.userPassword.trim().length < 7) {
    return NextResponse.json(
      { message: "Минимальная длина пароля 7 символов" },
      { status: 409 }
    );
  }

  if (
    newUserTeam.userRole.trimEnd().toLowerCase() !== "user" &&
    newUserTeam.userRole.trimEnd().toLowerCase() !== "creator"
  ) {
    return NextResponse.json(
      { message: "Нельзя создать юзера с такой ролью" },
      { status: 409 }
    );
  }

  const allUsers = await getAllUsers();
  const isUniqueEmail = allUsers.findIndex(
    (user) => user.userEmail === newUserTeam.userEmail
  );

  if (isUniqueEmail !== -1) {
    return NextResponse.json(
      { message: "Юзер с таким логином уже существует" },
      { status: 409 }
    );
  }

  const hashedPassword = await hashPassword(newUserTeam.userPassword.trim());

  try {
    await prisma.user.create({
      data: {
        userEmail: newUserTeam.userEmail.trim(),
        userPassword: hashedPassword,
        userRole: newUserTeam.userRole.trim(),
        themeId: 1,
      },
    });
    resetCacheAllUsers();
  } catch (error) {
    return NextResponse.json(
      { message: "Ошибка БД", error: error },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Юзер создан" });
}
