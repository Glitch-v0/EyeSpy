// import cloudinary from "./cloudinary.js";
import asyncHandler from "express-async-handler";
import mockapi from "./mockapi.js";
import { createOrRefreshToken } from "./tokenUtils.js";
import prisma from "./prisma.js";

const controller = {
  allPictureData: [],
  reducedPictureData: [],
  pictureNames: [],
  loadPictureData: async () => {
    // controller.allPictureData =
    //   await cloudinary.v2.api.resources_by_asset_folder("Photo Tagging App");
    controller.allPictureData = mockapi;

    //Creates a list of all animal names
    controller.allPictureData.resources.forEach((resource) => {
      //Adds each animal's name to the list
      controller.pictureNames.push(resource.display_name.split("_")[0]);
    });

    // Reduce picture data to send to frontend
    controller.reducedPictureData = controller.allPictureData.resources.map(
      (resource) => {
        return {
          display_name: resource.display_name.split("_")[0],
          secure_url: resource.secureUrl,
          width: resource.width,
          height: resource.height,
        };
      }
    );
  },
  getPictureNames: asyncHandler(async (req, res) => {
    // Check if picture list hasn't been loaded
    if (!controller.pictureNames.length) {
      await controller.loadPictureData();
    }
    console.log(controller.allPictureData);
    res.json(controller.pictureNames);
  }),
  getPictureURL: asyncHandler(async (req, res) => {
    // Check if picture list hasn't been loaded
    if (!controller.pictureNames.length) {
      await controller.loadPictureData();
    }
    controller.allPictureData.resources.filter((resource) => {
      if (resource.display_name.includes(req.params.name)) {
        res.json(`${resource.secure_url}/`);
      }
    });
  }),
  sendAllPictureData: asyncHandler(async (req, res) => {
    // Check if picture list hasn't been loaded
    if (!controller.pictureNames.length) {
      await controller.loadPictureData();
    }

    //Generate and send JWT
    const token = createOrRefreshToken(crypto.randomUUID());

    res.json({ pictureData: controller.reducedPictureData, token: token });
  }),
  checkGuess: asyncHandler(async (req, res) => {
    // Check if picture list hasn't been loaded
    if (!controller.pictureNames.length) {
      await controller.loadPictureData();
    }

    //Check if user token is in db
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });
    if (!user) {
      res.json("User not found");
    }

    // Compare guessed coordinates to db coordinates

    console.log(`Guess: ${req.params.guessCoordinates}`);
    res.json("Guess: " + req.params.guessCoordinates);
  }),
};

export default controller;
