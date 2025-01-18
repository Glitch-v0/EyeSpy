export function photoCalculation(height, width) {
  let adjustedHeight, adjustedWidth;
  const aspectRatio = width / height;

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

  return { adjustedHeight, adjustedWidth };
}

export default photoCalculation;
