export const coordinateUtils = {
  correctUserAttempt(userGuessX, userGuessY, xRange, yRange) {
    if (
      userGuessX >= Math.min(...xRange) &&
      userGuessX <= Math.max(...xRange) &&
      userGuessY >= Math.min(...yRange) &&
      userGuessY <= Math.max(...yRange)
    ) {
      return true;
    }

    return false;
  },

  gatherPictureCoordinates(pictureCoordinates) {
    const xRange1 = [];
    const yRange1 = [];
    const xRange2 = [];
    const yRange2 = [];
    if (
      Object.keys(pictureCoordinates).includes("br") &&
      Object.keys(pictureCoordinates).includes("tl")
    ) {
      xRange1.push(pictureCoordinates.br.x, pictureCoordinates.tl.x);
      yRange1.push(pictureCoordinates.br.y, pictureCoordinates.tl.y);
    } else if (
      Object.keys(pictureCoordinates).includes("rightEye") &&
      Object.keys(pictureCoordinates).includes("leftEye")
    ) {
      xRange1.push(
        pictureCoordinates.rightEye.br.x,
        pictureCoordinates.rightEye.tl.x
      );
      yRange1.push(
        pictureCoordinates.rightEye.br.y,
        pictureCoordinates.rightEye.tl.y
      );

      xRange2.push(
        pictureCoordinates.leftEye.br.x,
        pictureCoordinates.leftEye.tl.x
      );
      yRange2.push(
        pictureCoordinates.leftEye.br.y,
        pictureCoordinates.leftEye.tl.y
      );
    }
    return { xRange1, yRange1, xRange2, yRange2 };
  },
};
