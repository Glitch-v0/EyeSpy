import { useState, useEffect } from "react";
import { cleanPhotoURL } from "../photoUtilities.js";
import ClickMarker from "./ClickMarker.jsx";

export default function PictureDisplay() {
  const [allPictureData, setAllPictureData] = useState([]);
  const [pictureData, setPictureData] = useState({});

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
      originalResoulution: resolution,
      url: cleanPhotoURL(allPictureData[newIndex].secure_url, resolution),
    });
  }

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/pictures`)
      .then((response) => response.json())
      .then((data) => {
        setAllPictureData(data);
        const resolution = { width: data[0].width, height: data[0].height };
        setPictureData({
          display_name: data[0].display_name.split("_")[0],
          currentIndex: 0,
          originalResoulution: resolution,
          url: cleanPhotoURL(data[0].secure_url, resolution),
        });
      });
  }, []);

  return (
    <div>
      <img id="picture" src={pictureData.url} alt={pictureData.display_name} />
      <ClickMarker originalPictureSize={pictureData.originalResoulution} />
    </div>
  );
}
