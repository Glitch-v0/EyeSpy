import PictureDisplay from "./components/PictureDisplay";
import TextNotice from "./components/TextNotice.jsx";
import ScoreScreen from "./components/ScoreScreen.jsx";
import { useState } from "react";
import { GoFullScreen } from "./components/GoFullScreen.jsx";

function App() {
  const [sequenceIndex, setSequenceIndex] = useState(0);

  const welcomeMessage = (
    <>
      <strong>Welcome to Eye Spy!</strong>
      <br />
      There are several animals <em>carefully watching you.</em>
      <br />
      Can you spot their peering eyes?
      <br />
      You will get more points for <strong>speed and accuracy</strong> in your
      clicks.
      <br />
      Some pictures you will need to find multiple eyes.
    </>
  );

  return (
    <>
      <GoFullScreen />
      {sequenceIndex === 0 ? (
        <TextNotice text={welcomeMessage} setIndex={setSequenceIndex} />
      ) : sequenceIndex === 1 ? (
        <PictureDisplay setIndex={setSequenceIndex} />
      ) : (
        <ScoreScreen />
      )}
    </>
  );
}

export default App;
