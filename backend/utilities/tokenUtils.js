import jwt from "jsonwebtoken";
import { userFunctions } from "../database/user.js";

export function createOrRefreshToken(userId) {
  return jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token) {
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return error.message;
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
  const verified = verifyToken(token);
  let user;
  let sentToken;
  // console.log({ verified, token });
  if (verified !== true) {
    // console.log({ verified });
    if (verified === "jwt malformed") {
      //Create new token and new user
      console.log("Going malformed route");
      sentToken = createOrRefreshToken(crypto.randomUUID());
      user = await userFunctions.createUser(sentToken);
    } else if (verified === "jwt expired") {
      console.log("Going expired route");
      //Refresh user token
      const newToken = createOrRefreshToken(crypto.randomUUID());
      user = await userFunctions.refreshToken(token, newToken);
      sentToken = newToken;
    } else {
      console.log("Going other route");
      //Invalid token
      user = createOrRefreshToken(crypto.randomUUID());
      sentToken = user.jwt;
    }
  } else {
    //Valid token
    user = await userFunctions.getUserByJwt(token);
    if (!user) {
      user = await userFunctions.createUser(token);
      sentToken = user.jwt;
    }
    sentToken = token;
  }
  return { token: sentToken, user: user };
}
