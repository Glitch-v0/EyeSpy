import { useState, useEffect } from "react";

export default function PictureDisplay() {
  const [currentPicture, setCurrentPicture] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/pictures/Bee`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCurrentPicture(data);
      });
  }, []);

  return (
    <div>
      <img src={currentPicture} alt="Picture" />
    </div>
  );
}
