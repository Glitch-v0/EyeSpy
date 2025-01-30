import { useState, useEffect } from "react";
import { cleanPhotoURL } from "../photoUtilities.js";
import ClickMarker from "./ClickMarker.jsx";

export default function PictureDisplay() {
  const [allPictureData, setAllPictureData] = useState([]);
  const [pictureData, setPictureData] = useState({});
  const [correct, setCorrect] = useState(false);

  function nextPicture() {
    const currentIndex = pictureData.currentIndex;
    const newIndex = currentIndex + 1;
    const resolution = {
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
    fetch(`${import.meta.env.VITE_API_URL}/pictures`)
      .then((response) => response.json())
      .then((data) => {
        console.log({ data });
        setAllPictureData(data.pictureData);
        localStorage.setItem("token", data.token);
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
      <ClickMarker originalPictureSize={pictureData.originalResolution} />
    </div>
  );
}
