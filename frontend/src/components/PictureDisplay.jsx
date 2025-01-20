import { useState, useEffect } from "react";
import photoCalculation from "../photoCalculation.js";
import ClickMarker from "./ClickMarker.jsx";

export default function PictureDisplay() {
  const [pictureData, setPictureData] = useState([]);
  const [currentPicture, setCurrentPicture] = useState("");
  const [currentPictureMeasurements, setCurrentPictureMeasurements] = useState(
    {}
  );

  //Insert the adjusted measurements into the picture link
  const pictureLink = `${
    currentPicture.split("upload/")[0] +
    "upload/w_" +
    parseInt(currentPictureMeasurements.adjustedWidth) +
    ",h_" +
    parseInt(currentPictureMeasurements.adjustedHeight) +
    "/" +
    currentPicture.split("upload/")[1]
  }`;

  console.log(pictureLink);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/pictures`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPictureData(data);
        setCurrentPicture(data[0].secure_url);
        setCurrentPictureMeasurements(
          photoCalculation(data[0].height, data[0].width)
        );
      });
  }, []);

  return (
    <div>
      <img id="picture" src={pictureLink} alt={currentPicture} />
      <ClickMarker />
    </div>
  );
}
