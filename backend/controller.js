// import cloudinary from "./cloudinary.js";
import asyncHandler from "express-async-handler";
import mockapi from "./mockapi.js";
import { createOrRefreshToken } from "./tokenUtils.js";
import prisma from "./prisma/prisma.js";

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

    //Check if user has token
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      //Verify token
      const user = await prisma.user.findUnique({
        where: { token: token },
      });
      if (!user) {
        console.log("User not in DB!");
      } else {
        console.log({ user });
      }

      return res.json({ pictureData: controller.reducedPictureData });
    }

    //Generate and send JWT
    const token = createOrRefreshToken(crypto.randomUUID());
    // console.log({ token });

    // Create user with token
    await prisma.user.create({
      data: {
        jwt: token,
        startTime: new Date(),
      },
    });

    res.json({ pictureData: controller.reducedPictureData, token: token });
  }),
  checkGuess: asyncHandler(async (req, res) => {
    // Check if picture list hasn't been loaded
    if (!controller.pictureNames.length) {
      await controller.loadPictureData();
    }

    //Get token from header
    const token = req.headers.authorization.split(" ")[1];
    console.log({ token });
    //Check if user token is in db
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });
    if (!user) {
      res.json("User not found");
    }

    // Compare guessed coordinates to db coordinates
    const picture = await prisma.picture.findUnique({
      where: { name: req.params.name },
    });
    // console.log({ picture });
    if (!picture) {
      res.json("Picture not found");
    }

    const xRange1 = [];
    const yRange1 = [];
    const xRange2 = [];
    const yRange2 = [];
    const coordinateCheck = picture.coordinates;
    // console.log({ coordinateCheck });

    // console.log(Object.keys(coordinateCheck));

    //Sorts picture coordinates into arrays. range2 is only used if there are multiple eyes to click.
    if (
      Object.keys(coordinateCheck).includes("br") &&
      Object.keys(coordinateCheck).includes("tl")
    ) {
      xRange1.push(coordinateCheck.br.x, coordinateCheck.tl.x);
      yRange1.push(coordinateCheck.br.y, coordinateCheck.tl.y);
    } else if (
      Object.keys(coordinateCheck).includes("rightEye") &&
      Object.keys(coordinateCheck).includes("leftEye")
    ) {
      xRange1.push(
        coordinateCheck.rightEye.br.x,
        coordinateCheck.rightEye.tl.x
      );
      yRange1.push(
        coordinateCheck.rightEye.br.y,
        coordinateCheck.rightEye.tl.y
      );

      xRange2.push(coordinateCheck.leftEye.br.x, coordinateCheck.leftEye.tl.x);
      yRange2.push(coordinateCheck.leftEye.br.y, coordinateCheck.leftEye.tl.y);
    }

    console.log({ xRange1, yRange1, xRange2, yRange2 });

    // console.log(`Guess: ${req.params.guessCoordinates}`);
    // res.json("Guess: " + req.params.guessCoordinates);
  }),
};

export default controller;
