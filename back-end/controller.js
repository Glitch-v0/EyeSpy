import cloudinary from "./cloudinary.js";
import asyncHandler from "express-async-handler";
// import mockapi from "./mockapi.js";

const controller = {
  allPictureData: [],
  pictureNames: [],
  loadPictures: async () => {
    try {
      controller.allPictureData =
        await cloudinary.v2.api.resources_by_asset_folder("Photo Tagging App");
      controller.allPictureData.resources.forEach((resource) => {
        //Adds each animal's name to the list
        controller.pictureNames.push(resource.display_name.split("_")[0]);
      });
    } catch (error) {
      console.log(error);
    }
  },
  getPictureNames: asyncHandler(async (req, res) => {
    if (!controller.pictureNames.length) {
      await controller.loadPictures(req, res);
    }
    console.log(controller.allPictureData);
    res.json(controller.pictureNames);
  }),
  getPictureURL: asyncHandler(async (req, res) => {
    if (!controller.pictureNames.length) {
      await controller.loadPictures(req, res);
    }
    controller.allPictureData.resources.filter((resource) => {
      if (resource.display_name.includes(req.params.name)) {
        res.json(resource.secure_url);
      }
    });
  }),
};

export default controller;
