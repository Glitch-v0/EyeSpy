import { useState, useEffect } from "react";

export default function ClickMarker() {
  const [clickCoordinate, setCoordinates] = useState({ x: 0, y: 0 });

  const handleClick = (event) => {
    setCoordinates({ x: event.clientX, y: event.clientY });
    async () => {
      fetch(`${import.meta.env.VITE_API_URL}/api/click`);
    };
  };

  useEffect(() => {
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
