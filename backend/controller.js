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

    const { token } = await handleUserToken(
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
    let correctAttempt = false;
    let scoreData = null;
    if (
      coordinateUtils.correctUserAttempt(
        userGuessX,
        userGuessY,
        xRange1,
        yRange1
      )
    ) {
      // console.log("Eye 1 is correct!");
      if (eyeCount === 1) {
        // Complete picture if only one eye
        const allCompletedPictures = await userFunctions.pictureComplete(
          token,
          picture.name,
          user.picturesComplete
        );
        // console.log({ allCompletedPictures });
        if (
          allCompletedPictures &&
          allCompletedPictures.length === controller.pictureNames.length
        ) {
          //Check for completing all pictures
          // console.log("All pictures completed!");
          scoreData = await userFunctions.allPicturesComplete(token);
        } else {
          pictureIsFinished = true;
        }
      } else if (eyeCount === 2) {
        if (user.eyesFound.includes("eye2")) {
          const allCompletedPictures = await userFunctions.pictureComplete(
            token,
            picture.name,
            user.picturesComplete
          );
          if (
            allCompletedPictures &&
            allCompletedPictures.length === controller.pictureNames.length
          ) {
            //Check for completing all pictures
            // console.log("All pictures completed!");
            scoreData = await userFunctions.allPicturesComplete(token);
          } else {
            pictureIsFinished = true;
          }
        } else if (!user.eyesFound.includes("eye1")) {
          await userFunctions.correctAttempt(token, "eye1");
          correctAttempt = true;
        }
      }
    } else if (
      coordinateUtils.correctUserAttempt(
        userGuessX,
        userGuessY,
        xRange2,
        yRange2
      )
    ) {
      if (user.eyesFound.includes("eye1")) {
        const allCompletedPictures = await userFunctions.pictureComplete(
          token,
          picture.name,
          user.picturesComplete
        );
        if (
          allCompletedPictures &&
          allCompletedPictures.length === controller.pictureNames.length
        ) {
          //Check for completing all pictures
          // console.log("All pictures completed!");
          scoreData = await userFunctions.allPicturesComplete(token);
        } else {
          pictureIsFinished = true;
        }
      } else if (
        !user.eyesFound.includes("eye1") &&
        !user.eyesFound.includes("eye2")
      ) {
        await userFunctions.correctAttempt(token, "eye2");
        correctAttempt = true;
      }
    } else {
      // console.log(Incorrect! Passing ${token} into incorrectAttempt);
      await userFunctions.incorrectAttempt(token);
    }

    // console.log({ pictureIsFinished, correctAttempt });
    // console.log(`Guess: ${req.params.guessCoordinates}`);
    res.json({
      finished: pictureIsFinished,
      correct: correctAttempt,
      token: token ? token : null,
      scoreData: scoreData ? scoreData : null,
    });
  }),

  getScores: asyncHandler(async (req, res) => {}),
};

export default controller;
