export function photoCalculation(height, width) {
  let adjustedHeight, adjustedWidth;
  const aspectRatio = width / height;

  // console.log(
  //   `Running photoCalculation: with height: ${height}, width: ${width}, and aspect ratio: ${aspectRatio}`
  // );

  if (height > window.innerHeight) {
    //Picture is too tall
    adjustedHeight = window.innerHeight;
    adjustedWidth = adjustedHeight * aspectRatio;
  } else if (width > window.innerWidth) {
    //Picture is too wide
    adjustedWidth = window.innerWidth;
    adjustedHeight = adjustedWidth / aspectRatio;
  } else {
    //Picture is not too big
    adjustedHeight = height;
    adjustedWidth = width;
  }

  return { height: adjustedHeight, width: adjustedWidth };
}

export function cleanPhotoURL(url, resolution) {
  const adjustedResolution = photoCalculation(
    resolution.height,
    resolution.width
  );
  const pictureLink = `${
    url.split("upload/")[0] +
    "upload/w_" +
    parseInt(adjustedResolution.width) +
    ",h_" +
    parseInt(adjustedResolution.height) +
    "/" +
    url.split("upload/")[1]
  }
    `;

  // console.log({ url, resolution, adjustedResolution, pictureLink });
  return pictureLink;
}

export function normalizeCoordinates(picture, event, originalPictureSize) {
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

  return [normalizedX, normalizedY, pictureX, pictureY];
}
