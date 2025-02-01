import prisma from "../prisma/prisma.js";

export const userFunctions = {
  getUserByJwt: async (token) => {
    const user = await prisma.user.findUnique({
      where: { jwt: token },
    });
    return user;
  },

  createUser: async (token) => {
    await prisma.user.create({
      data: {
        jwt: token,
        startTime: new Date(),
      },
    });
  },

  refreshToken: async (token, newToken) => {
    await prisma.user.update({
      where: { jwt: token },
      data: {
        jwt: newToken,
      },
    });
  },

  pictureComplete: async (token, pictureName) => {
    await prisma.user.update({
      where: { jwt: token },
      data: {
        picturesComplete: {
          push: pictureName,
        },
        attempts: {
          increment: 1,
        },
      },
    });
  },

  incorrectAttempt: async (token) => {
    await prisma.user.update({
      where: { jwt: token },
      data: {
        attempts: {
          increment: 1,
        },
        misses: {
          increment: 1,
        },
      },
    });
  },
};
