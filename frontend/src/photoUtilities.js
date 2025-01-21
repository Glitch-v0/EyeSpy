export function photoCalculation(height, width) {
  let adjustedHeight, adjustedWidth;
  const aspectRatio = width / height;

  console.log(
    `Running photoCalculation: with height: ${height}, width: ${width}, and aspect ratio: ${aspectRatio}`
  );

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

  console.log({ url, resolution, adjustedResolution, pictureLink });
  return pictureLink;
}
