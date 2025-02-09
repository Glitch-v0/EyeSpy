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
    // console.log({ token, pictureName, picturesCompleted });
    if (!picturesCompleted?.includes(pictureName)) {
      try {
        const user = await prisma.user.update({
          where: { jwt: token },
          data: {
            picturesComplete: {
              push: pictureName,
            },
            attempts: {
              increment: 1,
            },
            eyesFound: {
              set: [],
            },
          },
          select: {
            picturesComplete: true,
          },
        });
        return user.picturesComplete;
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

  allPicturesComplete: async (token) => {
    let user;
    try {
      user = await prisma.user.findFirst({
        where: { jwt: token },
      });
    } catch (error) {
      console.log(`Failed to get user: ${error.message}`);
      return;
    }
    //Calculate score
    const baseScore = 100000;
    const accuracy = user.attempts / (user.attempts + user.misses * 0.25);
    const duration = Date.now() - user.startTime;
    let score = Math.round((baseScore - duration * 0.5) * accuracy);
    if (score < 0) {
      score = 0;
    }
    console.log({ score });

    try {
      user = await prisma.user.update({
        where: { jwt: token },
        data: {
          picturesComplete: [],
          eyesFound: [],
          attempts: 0,
          misses: 0,
          score: {
            upsert: {
              create: {
                score: score,
              },
              update: {
                score: score,
              },
            },
          },
        },
      });
    } catch (error) {
      console.log(`Failed to create score for user: ${error.message}`);
    }
  },

  getScores: async (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    let userScore = await prisma.user.findFirst({
      where: { jwt: token },
      select: {
        score: {
          select: {
            score: true,
          },
        },
      },
    });

    let topScores;
    //Get top 3 scores
    try {
      topScores = await prisma.score.findMany({
        orderBy: {
          score: "desc",
        },
        take: 3,
        select: {
          score: true,
          user: {
            select: {
              initials: true,
            },
          },
        },
      });
    } catch (error) {
      console.log(`Failed to get top scores: ${error.message}`);
    }

    let userRank;
    try {
      //Get user rank
      userRank = await prisma.score.count({
        where: {
          score: {
            gte: userScore.score.score,
          },
        },
      });
    } catch (error) {
      console.log(`Failed to get user rank: ${error.message}`);
    }

    console.log({ userScore: userScore, userRank, topScores });
    res.json({
      userScore: userScore.score,
      userRank: userRank,
      topScores: topScores,
    });
  },
  postScore: async (req, res) => {
    let token = req.headers.authorization.split(" ")[1];
    let initials = req.body.initials;

    console.log({ token, initials });
    console.log(typeof initials, initials);

    //Update user score with received initials
    let test;
    try {
      test = await prisma.user.update({
        where: { jwt: token },
        data: {
          initials: initials,
          startTime: new Date(),
        },
        select: {
          score: true,
        },
      });

      res.json({ success: true });
    } catch (error) {
      res.json({ error: error.message });
    }
    console.log({ test });
  },
};
