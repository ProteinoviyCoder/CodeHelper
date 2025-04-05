import { getAllUsers } from "@/app/api/auth/cache";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const hashPassword = async (password: string) => {
  const saltRounds: number = 15;
  const hashPassword = await bcrypt.hash(password, saltRounds);
  return hashPassword;
};

export const checkedPassword = async (
  password: string,
  passwordHash: string
) => {
  const result = await bcrypt.compare(password, passwordHash);
  return result;
};

export const createJwtToken = (userEmail: string, userId: number) => {
  try {
    const secret = process.env.SECRET_JWT_TOKEN;
    const token = jwt.sign({ userEmail, userId }, secret!, { expiresIn: "1h" });
    return token;
  } catch (error) {
    const myErr = "Невозможно создать токен";
    const err = myErr ?? error;
    return err;
  }
};

export const createRefreshToken = (userEmail: string, userId: number) => {
  try {
    const secret = process.env.SECRET_JWT_TOKEN_REFRESH;
    const token = jwt.sign({ userEmail, userId }, secret!, {
      expiresIn: "30d",
    });
    return token;
  } catch (error) {
    const myErr = "Невозможно создать токен";
    const err = myErr ?? error;
    return err;
  }
};

export const checkedJwtToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.SECRET_JWT_TOKEN!);
  } catch {
    return null;
  }
};

export const verifyUserToken = (req: NextRequest) => {
  type Report = {
    message: string;
    status: boolean;
    tokenPayload: jwt.JwtPayload | null;
  };
  const report: Report = {
    message: "",
    status: false,
    tokenPayload: null,
  };

  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    report.status = true;
    report.message = "Невалидный токен";

    return report;
  }

  const result = checkedJwtToken(token);

  if (!result || typeof result === "string") {
    report.status = true;
    report.message = "Невалидный токен";

    return report;
  }

  report.tokenPayload = result;

  return report;
};

export const checkedAllowedRoles = async (
  userId: number,
  allowedRoles: string[]
) => {
  let result: boolean;

  const allUsers = await getAllUsers();
  const currentUser = allUsers.find((user) => user.id === userId);

  if (!currentUser) {
    result = false;
    return result;
  }

  result = allowedRoles.includes(currentUser.userRole);
  return result;
};
