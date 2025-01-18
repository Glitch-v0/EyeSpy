import { useState, useEffect } from "react";
import ClickMarker from "./components/ClickMarker";
import PictureDisplay from "./components/PictureDisplay";

function App() {
  const [clickCoordinate, setCoordinates] = useState({ x: 0, y: 0 });
  const [correct, setCorrect] = useState(false);

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
    <>
      {/* <h1>
        Click Coordinates: X-{clickCoordinate.x} Y-{clickCoordinate.y}
      </h1> */}
      <PictureDisplay />
      <ClickMarker
        coordinates={clickCoordinate}
        setCoordinates={setCoordinates}
      />
    </>
  );
}

export default App;
