// import cloudinary from "./cloudinary.js";
import asyncHandler from "express-async-handler";
import mockapi from "./mockapi.js";
import { handleUserToken } from "./utilities/tokenUtils.js";
import prisma from "./prisma/prisma.js";
import { userFunctions } from "./database/user.js";
import { coordinateUtils } from "./utilities/coordinateUtils.js";

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

    const { token, user } = await handleUserToken(
      req.headers.authorization.split(" ")[1]
    );

    // console.log(`Sending token: ${token} for user ${user}`);

    res.json({
      pictureData: controller.reducedPictureData,
      token: token ? token : null,
    });
  }),
  checkGuess: asyncHandler(async (req, res) => {
    // Check if picture list hasn't been loaded
    if (!controller.pictureNames.length) {
      await controller.loadPictureData();
    }

    let { token, user } = await handleUserToken(
      req.headers.authorization.split(" ")[1]
    );
    // console.log({ token, user });

    // Compare guessed coordinates to db coordinates
    const picture = await prisma.picture.findUnique({
      where: { name: req.params.name },
    });
    // console.log({ picture: picture.coordinates });
    if (!picture) {
      res.json("Picture not found");
    }

    const { xRange1, yRange1, xRange2, yRange2 } =
      coordinateUtils.gatherPictureCoordinates(picture.coordinates);

    // console.log({ xRange1, yRange1, xRange2, yRange2 });

    const [userGuessX, userGuessY] = req.params.guessCoordinates
      .split("_")
      .map(Number);
    // console.log({ userGuessX, userGuessY });

    //Check if coordinates are stored for one or two eyes
    const eyeCount = xRange2.length ? 2 : 1;
    // console.log({ eyeCount });

    let pictureIsFinished = false;
    if (
      coordinateUtils.correctUserAttempt(
        userGuessX,
        userGuessY,
        xRange1,
        yRange1
      )
    ) {
      console.log("Eye 1 is correct!");
      if (eyeCount === 1 || !("eye2" in user.eyesFound)) {
        await userFunctions.pictureComplete(
          token,
          picture.name,
          user.picturesComplete
        );
        pictureIsFinished = true;
      } else if (eyeCount === 2) {
        await userFunctions.eyesFound(token, "eye1");
      }
    } else if (
      coordinateUtils.correctUserAttempt(
        userGuessX,
        userGuessY,
        xRange2,
        yRange2
      )
    ) {
      console.log("Eye 2 is correct!");
      if ("eye1" in user.eyesFound) {
        await userFunctions.pictureComplete(
          token,
          picture.name,
          user.picturesComplete
        );
        pictureIsFinished = true;
      } else if (!("eye1" in user.eyesFound)) {
        await userFunctions.eyesFound(token, "eye2");
      }
    } else {
      // console.log(`Incorrect! Passing ${token} into incorrectAttempt`);
      await userFunctions.incorrectAttempt(token);
    }

    console.log(`Guess: ${req.params.guessCoordinates}`);
    console.log({ pictureIsFinished }, picture.name, picture.coordinates);
    res.json({
      finished: pictureIsFinished,
      token: token ? token : null,
    });
  }),
};

export default controller;
