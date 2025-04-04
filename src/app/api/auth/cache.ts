import prisma from "../../../../prisma/prisma";
import jwt from "jsonwebtoken";

declare global {
  var allUsers:
    | {
        id: number;
        userEmail: string;
        userPassword: string;
        username: string | null;
        userImg: string | null;
        userRole: string;
        userRefreshToken: string | null;
        createdAt: Date;
        updatedAt: Date;
        themeId: number;
        userTheme: {
          id: number;
          themeMode: string;
          themeVariant: string;
        };
      }[]
    | null;
}

if (!globalThis.allUsers) {
  globalThis.allUsers = null;
}

export const getAllUsers = async () => {
  if (!globalThis.allUsers) {
    globalThis.allUsers = await prisma.user.findMany({
      orderBy: { id: "asc" },
      include: { userTheme: true },
    });
    console.log("Загружаем юзеров");
  } else {
    console.log("Юзеры уже загружены");
  }

  return globalThis.allUsers;
};

export const resetCacheAllUsers = () => {
  globalThis.allUsers = null;
};

export const checkedRefreshToken = async (token: string) => {
  let verifydToken;
  try {
    verifydToken = jwt.verify(token, process.env.SECRET_JWT_TOKEN_REFRESH!);
  } catch {
    return null;
  }

  if (typeof verifydToken === "string") {
    return null;
  }

  const userId = Number(verifydToken.userId);

  const allUsers = await getAllUsers();

  const currentUser = allUsers.find((user) => user.id === userId);

  if (!currentUser) {
    return null;
  }

  if (currentUser.userRefreshToken !== token) {
    return null;
  }

  return currentUser;
};
