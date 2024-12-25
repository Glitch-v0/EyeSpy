import { useState, useEffect } from "react";
import ClickMarker from "./components/ClickMarker";

function App() {
  const [clickCoordinate, setCoordinates] = useState({ x: 0, y: 0 });

  const handleClick = (event) => {
    setCoordinates({ x: event.clientX, y: event.clientY });
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
  }, []);

  return (
    <>
      <h1>
        Click Coordinates: X-{clickCoordinate.x} Y-{clickCoordinate.y}
      </h1>
      <ClickMarker
        coordinates={clickCoordinate}
        setCoordinates={setCoordinates}
      />
    </>
  );
}

export default App;
