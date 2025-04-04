import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";
import { verifyUserToken } from "@/shared/model/lib/auth";
import { getAllUsers } from "../../auth/cache";

export async function POST(req: NextRequest) {
  const report = verifyUserToken(req);
  if (report.status) {
    return NextResponse.json({ message: report.message }, { status: 401 });
  }

  const {
    userId,
    themeMode,
    themeVariant,
  }: { userId: number; themeMode: string; themeVariant: string } =
    await req.json();

  const allUsers = await getAllUsers();
  const currentUser = allUsers.find((user) => user.id === userId);

  if (!currentUser) {
    return NextResponse.json(
      { message: "Юзера с таким id не существует" },
      { status: 404 }
    );
  }

  try {
    const themeBD = await prisma.theme.findFirst({
      where: { themeMode: themeMode, themeVariant: themeVariant },
    });

    if (!themeBD) {
      throw new Error("Такой темы нет");
    }

    await prisma.user.update({
      where: { id: userId },
      data: { themeId: themeBD.id },
    });

    currentUser.userTheme.themeMode = themeMode;
    currentUser.userTheme.themeVariant = themeVariant;
    currentUser.userTheme.id = themeBD.id;
    currentUser.themeId = themeBD.id;
  } catch (error) {
    return NextResponse.json(
      { message: "Ошибка", error: error },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Тема была обновлена" });
}
