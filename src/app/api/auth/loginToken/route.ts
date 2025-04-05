import { checkedJwtToken } from "@/shared/model/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getAllUsers } from "../cache";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Невалидный токен" }, { status: 401 });
  }

  const isCurrentToken = checkedJwtToken(token);

  if (!isCurrentToken || typeof isCurrentToken === "string") {
    return NextResponse.json({ message: "Невалидный токен" }, { status: 401 });
  }

  const { userId } = isCurrentToken;

  const allUsers = await getAllUsers();

  const currentUser = allUsers.find((user) => user.id === userId);

  if (!currentUser) {
    return NextResponse.json(
      {
        message:
          "Такого юзера не существует, токен поддельный или юзер был удалён",
      },
      { status: 401 }
    );
  }

  const {
    userPassword: _,
    userRefreshToken: __,
    createdAt: ___,
    updatedAt: ____,
    ...userForClient
  } = currentUser;

  return NextResponse.json({ ...userForClient });
}
