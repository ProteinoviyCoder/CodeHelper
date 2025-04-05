import { NextRequest, NextResponse } from "next/server";
import { checkedAllowedRoles, verifyUserToken } from "@/shared/model/lib/auth";
import { validationInput } from "@/shared/model/lib/validation";
import prisma from "../../../../../prisma/prisma";
import { resetCache } from "../cache";

type Version = {
  v: number;
  name: string;
  description: string;
  buttons: {
    buttonText: string;
    script: string;
  }[];
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

  const { versions }: { versions: Version[] } = await req.json();

  if (!versions) {
    return NextResponse.json(
      { message: "Недостаточно данных" },
      { status: 404 }
    );
  }

  for (const version of versions) {
    if (version.description.length > 999) {
      return NextResponse.json(
        { message: "Максимальное кол-во символов 999" },
        { status: 404 }
      );
    }

    if (version.name.length < 1) {
      return NextResponse.json(
        { message: "Название скрипта не может быть пустым" },
        { status: 404 }
      );
    }

    const lastSymbol = version.name[version.name.length];
    const report = validationInput(lastSymbol, version.name);

    if (report.status) {
      return NextResponse.json({ message: report.message }, { status: 404 });
    }

    let errorButtons: string | null = null;

    for (const btn of version.buttons) {
      if (btn.buttonText.length > 20) {
        errorButtons = "Максисальное кол-во символов для названия кнопки 20";
        return;
      }
      if (btn.buttonText.length < 1) {
        errorButtons = "Название кнопки не может быть пустым";
        return;
      }
      if (btn.buttonText.includes("<") || btn.buttonText.includes(">")) {
        errorButtons =
          "Недопустимые символы для названия кнопки - ',' или '>' ";
        return;
      }
      if (btn.script.length > 2999) {
        errorButtons = "Максисальное кол-во символов для скрипта 2999";
        return;
      }
      if (btn.script.length < 1) {
        errorButtons = "Скрипт не может быть пустым";
        return;
      }
    }

    if (errorButtons) {
      return NextResponse.json({ message: errorButtons }, { status: 404 });
    }
  }

  try {
    const newScriptBD = await prisma.script.create({
      data: {},
    });

    for (const version of versions) {
      const newVersionBD = await prisma.version.create({
        data: {
          name: version.name,
          v: version.v,
          description: version.description,
          scriptId: newScriptBD.id,
        },
      });

      for (const btn of version.buttons) {
        await prisma.button.create({
          data: {
            buttonText: btn.buttonText,
            script: btn.script,
            versionId: newVersionBD.id,
          },
        });
      }
    }
    resetCache();
  } catch (error) {
    return NextResponse.json(
      { message: "Ошибка БД", error: error },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Скрипт создан" });
}
