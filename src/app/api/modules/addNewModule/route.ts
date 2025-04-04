import { checkedAllowedRoles, verifyUserToken } from "@/shared/model/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getAllModules, resetCacheModules } from "../cache";
import prisma from "../../../../../prisma/prisma";

type NewModule = {
  img: string | null;
  name: string;
  groups: string[];
  code: string;
};

export async function POST(req: NextRequest) {
  const report = verifyUserToken(req);
  if (report.status) {
    return NextResponse.json({ message: report.message }, { status: 401 });
  }

  const { userId } = report.tokenPayload!;
  const isAllowedRole = await checkedAllowedRoles(userId, [
    "owner",
    "admin",
    "creator",
  ]);

  if (!isAllowedRole) {
    return NextResponse.json({ message: "Недостаточно прав" }, { status: 403 });
  }

  const { newModule }: { newModule: NewModule } = await req.json();

  if (newModule.name.trim().length < 1) {
    return NextResponse.json(
      { message: "Поле 'Название модуля' не может быть пустым" },
      { status: 409 }
    );
  }
  if (newModule.name.length > 50) {
    return NextResponse.json(
      { message: "Максимальное кол-во символов для поля 'Название модуля' 50" },
      { status: 409 }
    );
  }
  if (newModule.name.includes("<") || newModule.name.includes(">")) {
    return NextResponse.json(
      { message: "Для поля 'Название модуля' '<' и '>' недопустимые символы" },
      { status: 409 }
    );
  }
  if (newModule.groups.length < 1) {
    return NextResponse.json(
      { message: "Новый модуль должен содержать хотябы 1 группу" },
      { status: 409 }
    );
  }
  if (newModule.code.trim().length < 1) {
    return NextResponse.json(
      { message: "Поле 'Код модуля' не может быть пустым" },
      { status: 409 }
    );
  }
  if (newModule.code.length > 20000) {
    return NextResponse.json(
      { message: "Максимальное кол-во символов для поля 'Код модуля' 20.000" },
      { status: 409 }
    );
  }

  const allModules = await getAllModules();
  const checkIsUniqueName = allModules.find(
    (module) =>
      module.name.toLowerCase().trim() === newModule.name.toLowerCase().trim()
  );

  if (checkIsUniqueName) {
    return NextResponse.json(
      { message: "Модуль с таким названием уже есть" },
      { status: 409 }
    );
  }

  try {
    await prisma.module.create({
      data: {
        img: newModule.img,
        name: newModule.name,
        groups: newModule.groups,
        code: newModule.code,
      },
    });
    resetCacheModules();
  } catch (error) {
    return NextResponse.json({ message: "Ошибка БД" }, { status: 404 });
  }

  return NextResponse.json({
    message: "Новый модуль создан",
  });
}
