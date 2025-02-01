// import cloudinary from "./cloudinary.js";
import asyncHandler from "express-async-handler";
import mockapi from "./mockapi.js";
import { createOrRefreshToken, verifyToken } from "./utilities/tokenUtils.js";
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
    let token = req.headers.authorization.split(" ")[1];

    try {
      verifyToken(token);
    } catch (error) {
      // Check if token is expired
      if (error.name === "TokenExpiredError") {
        //Refresh user token
        const newToken = createOrRefreshToken(crypto.randomUUID());
        userFunctions.refreshToken(token, newToken);
        token = newToken;
      } else {
        //Create new token and new user
        token = createOrRefreshToken(crypto.randomUUID());
        userFunctions.createUser(token);
      }
    }

    res.json({ pictureData: controller.reducedPictureData, token: token });
  }),
  checkGuess: asyncHandler(async (req, res) => {
    // Check if picture list hasn't been loaded
    if (!controller.pictureNames.length) {
      await controller.loadPictureData();
    }

    let token;
    //Check if token exists
    if (!req.headers.authorization) {
      token = createOrRefreshToken(crypto.randomUUID());
      userFunctions.createUser(token);
    } else {
      token = req.headers.authorization.split(" ")[1];

      try {
        verifyToken(token);
      } catch (error) {
        // Check if token is expired
        if (error.name === "TokenExpiredError") {
          //Refresh user token
          const newToken = createOrRefreshToken(crypto.randomUUID());
          userFunctions.refreshToken(token, newToken);
          token = newToken;
        } else {
          //Create new token and new user
          token = createOrRefreshToken(crypto.randomUUID());
          userFunctions.createUser(token);
        }
      }
    }

    //Check if user token is in db
    let user = userFunctions.getUserByJwt(token);
    if (!user) {
      user = userFunctions.createUser(token);
    }

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
    if (
      coordinateUtils.correctUserAttempt(
        userGuessX,
        userGuessY,
        xRange1,
        yRange1
      )
    ) {
      console.log("Eye 1 is correct!");
      if (eyeCount === 1) {
        userFunctions.pictureComplete(token, picture.name);
      } else if (eyeCount === 2) {
        // const eye1Success = prisma.user.update({
        //   where: { jwt: token },
        //   data: {
        //     currentGuessCoordinates: {
        //       eye1: { userGuessX, userGuessY },
        //     },
        //   },
        // });
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
    } else {
      console.log("Incorrect!");
      userFunctions.incorrectAttempt(token);
    }

    // console.log(`Guess: ${req.params.guessCoordinates}`);
    // res.json("Guess: " + req.params.guessCoordinates);
  }),
};

export default controller;
