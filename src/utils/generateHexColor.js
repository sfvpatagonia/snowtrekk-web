function hexColor() {
  // Define ranges for vivid colors (R, G, B values between 128-255)
  const min = 128; // Minimum value for vibrant colors
  const max = 230; // Maximum value for vibrant colors

  // Generate random R, G, B values within the defined range
  const r = Math.floor(Math.random() * (max - min + 1)) + min;
  const g = Math.floor(Math.random() * (max - min + 1)) + min;
  const b = Math.floor(Math.random() * (max - min + 1)) + min;

  // Convert to hexadecimal and format as #RRGGBB
  const hex = `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  return hex;
}

export default hexColor;
