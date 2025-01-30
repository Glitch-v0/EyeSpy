import { useState, useEffect } from "react";
import propTypes from "prop-types";

ClickMarker.propTypes = {
  originalPictureSize: propTypes.shape({
    width: propTypes.number,
    height: propTypes.number,
  }),
};

export default function ClickMarker({ originalPictureSize }) {
  const [clickCoordinate, setCoordinates] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleClick = async (event) => {
      if (originalPictureSize) {
        setCoordinates({ x: event.clientX, y: event.clientY });
        function normalizeClickCoordinates(event) {
          const picture = document.getElementById("picture");
          // console.log(originalPictureSize);
          // console.log(originalPictureSize.width);
          // console.log(originalPictureSize.height);

          if (picture) {
            const pictureRect = picture.getBoundingClientRect();

            //X and Y are the picture coordinates, pretending the rest of the screen doesn't exist
            const pictureX = event.clientX - pictureRect.left;
            const pictureY = event.clientY - pictureRect.top;

            //Compare X and Y to picture size to get normalized coordinates
            const xRatio = originalPictureSize.width / pictureRect.width;
            const yRatio = originalPictureSize.height / pictureRect.height;
            // console.log({ xRatio, yRatio, originalPictureSize, pictureRect });

            const normalizedX = Math.round(pictureX * xRatio);
            const normalizedY = Math.round(pictureY * yRatio);

            setCoordinates({ x: event.clientX, y: event.clientY });
            let currentPictureAltText = document.getElementById("picture").alt;

            // console.log(
            //   `PictureX: ${pictureX}, PictureY: ${pictureY} from coordinates: ${event.clientX}, ${event.clientY}`
            // );
            // console.log(
            //   `SentCoordinates X: ${normalizedX}, Y: ${normalizedY}, converted from original picture size: ${originalPictureSize}`
            // );
            fetch(
              `${
                import.meta.env.VITE_API_URL
              }/pictures/${currentPictureAltText}/guess/${normalizedX}_${normalizedY}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            ).then((response) => console.log(response));
          }
        }

        normalizeClickCoordinates(event);
      }

      // async () => {
      //   fetch(`${import.meta.env.VITE_API_URL}/api/click`);
      // };
    };
    document.addEventListener("click", handleClick);
  }, [originalPictureSize]);

  return (
    <div
      className="clickMarker"
      style={{
        position: "absolute",
        left: clickCoordinate.x,
        top: clickCoordinate.y,
      }}
    />
  );
}
