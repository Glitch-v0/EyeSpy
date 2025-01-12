import express from "express";
import controller from "./controller.js";

const router = express.Router();

//get all app pictures from cloudinary
router.get("/", async (req, res) => {
  await controller.getPictureNames(req, res);
});

router.get("/:name", async (req, res) => {
  await controller.getPictureURL(req, res);
});

export default router;
