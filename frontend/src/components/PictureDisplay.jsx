import { useState, useEffect } from "react";
import photoCalculation from "../photoCalculation.js";

export default function PictureDisplay() {
  const [pictureData, setPictureData] = useState([]);
  const [currentPicture, setCurrentPicture] = useState("");
  const [currentPictureMeasurements, setCurrentPictureMeasurements] = useState(
    {}
  );

  const screenMeasurements = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  //Split the current picture url at "upload/" to insert screen height and width
  //between that and "v173xxxxxx/File_name.jpg"
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
        console.log(currentPictureMeasurements);
      });
  }, []);

  return (
    <div>
      <img src={pictureLink} alt={currentPicture} />
    </div>
  );
}
