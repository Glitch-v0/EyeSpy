import { useState, useEffect } from "react";
import propTypes from "prop-types";
import { cleanPhotoURL } from "../photoUtilities.js";
import ClickMarker from "./ClickMarker.jsx";

PictureDisplay.propTypes = {
  setIndex: propTypes.func.isRequired,
};

export default function PictureDisplay({ setIndex }) {
  const [allPictureData, setAllPictureData] = useState([]);
  const [pictureData, setPictureData] = useState({});

  function nextPicture() {
    let currentIndex = pictureData.currentIndex;
    if (currentIndex === allPictureData.length - 1) {
      setIndex(2);
      return;
    }
    let newIndex = currentIndex + 1;
    let resolution = {
      width: allPictureData[newIndex].width,
      height: allPictureData[newIndex].height,
    };

    setPictureData({
      display_name: allPictureData[newIndex].display_name.split("_")[0],
      currentIndex: newIndex,
      originalResolution: resolution,
      url: cleanPhotoURL(allPictureData[newIndex].secure_url, resolution),
    });
  }

  useEffect(() => {
    console.log("Loading component...");
    console.log("API URL:", import.meta.env.VITE_API_URL);
    fetch(`${import.meta.env.VITE_API_URL}/pictures`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(`{Sending token: ${localStorage.getItem("token")}`);
        setAllPictureData(data.pictureData);
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        const firstItem = data.pictureData[0];

        const resolution = { width: firstItem.width, height: firstItem.height };
        setPictureData({
          display_name: firstItem.display_name.split("_")[0],
          currentIndex: 0,
          originalResolution: resolution,
          url: cleanPhotoURL(firstItem.secure_url, resolution),
        });
      });
  }, []);

  return (
    <div id="pictureDisplay">
      <img id="picture" src={pictureData.url} alt={pictureData.display_name} />
      <ClickMarker
        originalPictureSize={pictureData.originalResolution}
        nextPicture={nextPicture}
      />
    </div>
  );
}
