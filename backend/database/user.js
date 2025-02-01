import prisma from "../prisma/prisma.js";

export const userFunctions = {
  getUserByJwt: async (token) => {
    try {
      const user = await prisma.user.findUnique({
        where: { jwt: token },
      });
      return user;
    } catch (error) {
      return error;
    }
  },

  createUser: async (token) => {
    try {
      const user = await prisma.user.create({
        data: {
          jwt: token,
          startTime: new Date(),
        },
      });
      return user;
    } catch (error) {
      return error;
    }
  },

  refreshToken: async (token, newToken) => {
    try {
      const user = await prisma.user.update({
        where: { jwt: token },
        data: {
          jwt: newToken,
        },
      });
      return user;
    } catch (error) {
      console.log(error);
    }
  },

  pictureComplete: async (token, pictureName, picturesCompleted) => {
    console.log({ token, pictureName, picturesCompleted });
    if (!picturesCompleted?.includes(pictureName)) {
      try {
        const test = await prisma.user.update({
          where: { jwt: token },
          data: {
            picturesComplete: {
              push: pictureName,
            },
          },
        });
        console.log({ test });
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Already completed");
    }
  },

  correctAttempt: async (token, eyeNumber) => {
    try {
      await prisma.user.update({
        where: { jwt: token },
        data: {
          attempts: {
            increment: 1,
          },
          eyesFound: {
            push: eyeNumber,
          },
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  },

  incorrectAttempt: async (token) => {
    try {
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
    } catch (error) {
      console.log(error.message);
    }
  },
};
