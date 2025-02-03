import { useState, useEffect } from "react";
import { cleanPhotoURL } from "../photoUtilities.js";
import ClickMarker from "./ClickMarker.jsx";

export default function PictureDisplay() {
  const [allPictureData, setAllPictureData] = useState([]);
  const [pictureData, setPictureData] = useState({});
  const [correct, setCorrect] = useState(false);

  function nextPicture() {
    let currentIndex = pictureData.currentIndex;
    let newIndex = currentIndex + 1;
    let resolution = {
      width: allPictureData[newIndex].width,
      height: allPictureData[newIndex].height,
    };
    // console.log({
    //   allPictureData,
    //   currentIndex,
    //   newIndex,
    //   resolution,
    //   display_name: allPictureData[newIndex].display_name.split("_")[0],
    // });
    setPictureData({
      display_name: allPictureData[newIndex].display_name.split("_")[0],
      currentIndex: newIndex,
      originalResolution: resolution,
      url: cleanPhotoURL(allPictureData[newIndex].secure_url, resolution),
    });
  }

  useEffect(() => {
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
    <div>
      <img id="picture" src={pictureData.url} alt={pictureData.display_name} />
      <ClickMarker
        originalPictureSize={pictureData.originalResolution}
        nextPicture={nextPicture}
      />
    </div>
  );
}
