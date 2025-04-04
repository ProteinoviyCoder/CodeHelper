import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";
import { verifyUserToken } from "@/shared/model/lib/auth";
import { getAllUsers } from "../../auth/cache";

export async function POST(req: NextRequest) {
  const report = verifyUserToken(req);
  if (report.status) {
    return NextResponse.json({ message: report.message }, { status: 401 });
  }

  const { userId, userImg }: { userId: number; userImg: string } =
    await req.json();

  if (userImg === "") {
    return NextResponse.json({ message: "Файл не выбран" }, { status: 404 });
  }

  if (typeof userImg !== "string") {
    return NextResponse.json(
      { message: "Неподдерживаемый тип файла" },
      { status: 404 }
    );
  }

  const allUsers = await getAllUsers();

  const currentUser = allUsers.find((user) => user.id === userId);

  if (!currentUser) {
    return NextResponse.json(
      { message: "Юзера с таким id не существует" },
      { status: 404 }
    );
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { userImg: userImg },
    });
    currentUser.userImg = userImg;
  } catch (error) {
    return NextResponse.json(
      { message: "Ошибка", error: error },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "userImg был обновлён" });
}
