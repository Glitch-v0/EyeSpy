import { useState, useEffect } from "react";
import propTypes from "prop-types";
import { normalizeCoordinates } from "../photoUtilities";

ClickMarker.propTypes = {
  originalPictureSize: propTypes.shape({
    width: propTypes.number,
    height: propTypes.number,
  }),
  nextPicture: propTypes.func,
};

export default function ClickMarker({ originalPictureSize, nextPicture }) {
  const [clickCoordinate, setCoordinates] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleClick = async (event) => {
      const picture = document.getElementById("picture");
      const clickMarker = document.getElementById("clickMarker");
      const acceptableClicks = [picture, clickMarker];
      // console.log(event.target);
      if (!picture) return; // Don't count click for unloaded picture
      if (!acceptableClicks.includes(event.target)) return; // Ignore clicks outside the picture or marker

      if (picture) {
        const [normalizedX, normalizedY] = normalizeCoordinates(
          picture,
          event,
          originalPictureSize
        );

        setCoordinates({ x: event.clientX, y: event.clientY });
        const clickMarker = document.getElementById("clickMarker");
        clickMarker.style.display = "";
        let currentPictureAltText = document.getElementById("picture").alt;

        fetch(
          `${
            import.meta.env.VITE_API_URL
          }/pictures/${currentPictureAltText}/guess/${normalizedX}_${normalizedY}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log({ data });
            if (data.token) {
              localStorage.setItem("token", data.token);
            }
            if (data.finished) {
              // console.log("Calling nextPicture");
              const correctMarker = document.getElementById("correctMarker");
              correctMarker.style.display = "none";

              //Remove display of click marker
              clickMarker.style.display = "none";

              nextPicture();
            } else if (data.correct) {
              console.log("Placing correct marker!");
              const correctMarker = document.getElementById("correctMarker");
              correctMarker.style.display = "";
              correctMarker.style.left = event.clientX + "px";
              correctMarker.style.top = event.clientY + "px";
            }
          });
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [originalPictureSize, nextPicture, clickCoordinate]);

  return (
    <div>
      <div
        className="clickMarker"
        id="clickMarker"
        style={{
          left: clickCoordinate.x,
          top: clickCoordinate.y,
        }}
      />
      <div
        className="clickMarker"
        id="correctMarker"
        style={{
          display: "none",
        }}
      />
    </div>
  );
}
