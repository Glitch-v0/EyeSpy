import jwt from "jsonwebtoken";

export function createOrRefreshToken(userId) {
  return jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function decodeToken(token) {
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7); // Remove 'Bearer ' (7 characters)
  }
  return jwt.decode(token);
}
