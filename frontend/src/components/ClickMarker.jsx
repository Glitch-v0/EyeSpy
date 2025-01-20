import { useState, useEffect } from "react";

export default function ClickMarker() {
  const [clickCoordinate, setCoordinates] = useState({ x: 0, y: 0 });

  function normalizeClickCoordinates(event) {
    const picture = document.getElementById("picture");

    if (picture) {
      const pictureRect = picture.getBoundingClientRect();
      const x = event.clientX - pictureRect.left;
      const y = event.clientY - pictureRect.top;
      setCoordinates({ x: event.clientX, y: event.clientY });
      console.log(
        `X: ${x}, Y: ${y} from normalizedClickCoordinates: ${event.clientX}, ${event.clientY}`
      );
    }
  }

  useEffect(() => {
    const handleClick = (event) => {
      // setCoordinates({ x: event.clientX, y: event.clientY });
      normalizeClickCoordinates(event);
      async () => {
        fetch(`${import.meta.env.VITE_API_URL}/api/click`);
      };
    };

    document.addEventListener("click", handleClick);
  }, []);

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
