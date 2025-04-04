// import prisma from "../../../../prisma/prisma";

// declare global {
//   var users:
//     | {
//         id: number;
//         userEmail: string;
//         username: string | null;
//         userImg: string | null;
//         userRole: string;

//         createdAt: Date;
//       }[]
//     | null;
// }

// if (!globalThis.users) {
//   globalThis.modules = null;
// }

// const getAllUsers = async () => {
//   if (!globalThis.users) {
//     console.log("Загружаем всех юзеров");

//     const usersFromBD = await prisma.user.findMany();
//     globalThis.users = usersFromBD.map((user) => {
//       const {
//         userPassword,
//         userRefreshToken,
//         updatedAt,
//         themeId,
//         ...coreDataUser
//       } = user;

//       return coreDataUser;
//     });
//   } else {
//     console.log("Все юзеры уже загружены");
//   }
//   return globalThis.users;
// };

// export const resetCacheUsers = () => {
//   globalThis.users = null;
// };
