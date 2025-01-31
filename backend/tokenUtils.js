import jwt from "jsonwebtoken";
import prisma from "./prisma/prisma.js";

export function createOrRefreshToken(userId) {
  return jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token) {
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.log(error);
    return error;
  }
  return true;
}

export function decodeToken(token) {
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7); // Remove 'Bearer ' (7 characters)
  }
  return jwt.decode(token);
}

export async function handleUserToken(token) {
  //Verify token
  try {
    verifyToken(token);
  } catch (error) {
    // Check if token is expired
    if (error.name === "TokenExpiredError") {
      //Refresh user token
      await prisma.user.update({
        where: { jwt: token },
        data: {
          jwt: createOrRefreshToken(crypto.randomUUID()),
        },
      });
    } else {
      //Create new token and new user
      token = createOrRefreshToken(crypto.randomUUID());
      await prisma.user.create({
        data: {
          jwt: token,
          startTime: new Date(),
        },
      });
    }
  }
}
