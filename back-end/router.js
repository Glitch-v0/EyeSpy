import express from "express";
// import cloudinary from "./cloudinary.js";
import mockapi from "./mockapi.js";

const router = express.Router();

//get all app pictures from cloudinary
router.get("/", async (req, res) => {
  try {
    // const folders =
    //   await cloudinary.v2.api.resources_by_asset_folder("Photo Tagging App");
    const folders = mockapi;
    console.log(folders);
    const animal_list = [];
    folders.resources.forEach((resource) => {
      //Adds just the animal to the list
      animal_list.push(resource.display_name.split("_")[0]);
    });
    console.log(animal_list);
    res.json(animal_list);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
