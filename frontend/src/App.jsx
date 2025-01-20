import { useState } from "react";
import PictureDisplay from "./components/PictureDisplay";

function App() {
  const [correct, setCorrect] = useState(false);

  return (
    <>
      <PictureDisplay />
    </>
  );
}

export default App;
