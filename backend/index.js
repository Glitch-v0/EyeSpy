import express from "express";
import "dotenv/config";
import prisma from "./prisma/prisma.js";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import router from "./router.js";
import cors from "cors";

const app = express();

// set up middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

app.use(
  session({
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

const corsOptions = {
  origins: [process.env.FRONT_ORIGIN],
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
  console.log(`Route called: ${req.method} ${req.originalUrl}`);
  console.log(`From origin: ${req.get("origin")}`);
  next();
});

app.use("/api", router);
app.all("*", (req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
