import express from "express";
import controller from "./controller.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const limiter = rateLimit({
  windowMs: 2 * 1000, // 1 seconds
  max: 1, // Allow only 1 request per window
  message: "Too many requests, please try again later.",
});

const shortLimiter = rateLimit({
  windowMs: 0.2 * 1000, // 0.2 seconds
  max: 1, // Allow only 1 request per window
  message: "Too many requests, please try again later.",
});

//get all app pictures from cloudinary
router.get("/pictures", limiter, async (req, res) => {
  await controller.sendAllPictureData(req, res);
});

router.get("/pictures/:name/:screenDimension", limiter, async (req, res) => {
  await controller.getPictureURL(req, res);
});

router.get(
  "/pictures/:name/guess/:guessCoordinates",
  shortLimiter,
  async (req, res) => {
    await controller.checkGuess(req, res);
  }
);

export default router;
