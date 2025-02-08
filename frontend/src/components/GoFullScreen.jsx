import { useState } from "react";

export function GoFullScreen() {
  const [fullScreenMode, setFullScreenMode] = useState(false);

  const toggleFullScreen = () => {
    if (fullScreenMode) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
    setFullScreenMode(!fullScreenMode);
  };

  return <button id="fullScreen" onClick={toggleFullScreen}></button>;
}
