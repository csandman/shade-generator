import nearestColor from "nearest-color";
import namedColors from "color-name-list";
import Color from "color";

export function getRandomHexColor() {
  return "0123456789ABCDEF".split("").reduce((a, c, i, arr) => {
    return i < 6 ? a + arr[Math.floor(Math.random() * 16)] : a;
  }, "#");
}

export function getRandomRgbColor() {
  return Array(3)
    .fill()
    .map(() => Math.floor(Math.random() * 255));
}

export function getContrastColor(color) {
  let isDark = !color.isDark();
  let i = 0.01;
  const minContrastRatio = 4.5;
  let contrastColor;
  let contrastRatio = 0;
  while (contrastRatio < minContrastRatio && i < 1) {
    contrastColor = calculateGradient(color, isDark, i);
    contrastRatio = color.contrast(contrastColor);
    i += 0.01;
  }
  return contrastColor;
}

export function getOppositeContrastColor(color) {
  const isDark = color.isLight();
  return calculateGradient(color, !isDark, 0.3);
}

export function getHighContrastColor(color) {
  const isDark = color.isLight();
  return calculateGradient(color, isDark, 0.7);
}

export function getLowContrastColor(color) {
  const isDark = color.isLight();
  return calculateGradient(color, isDark, 0.2);
}

export function searchNamedColors(searchTerm) {
  for (let i = 0; i < namedColors.length; i++) {
    if (namedColors[i].name.replace(/\s/g, "").toLowerCase() === searchTerm)
      return namedColors[i].hex.toUpperCase();
  }
  return null;
}

// Uses the named-colors library for a list of named of colors
// and uses nearest color to match the entered color to the closest
// option with a name
export function getColorName(hex) {
  const colors = namedColors.reduce(
    (o, { name, hex }) => Object.assign(o, { [name]: hex }),
    {}
  );
  const nearest = nearestColor.from(colors);
  return nearest(hex).name;
}

export function rgbToHex(rgb) {
  const [r, g, b] = rgb;
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

export function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ]
    : null;
}

export const calcAllGradients = color => {
  let gradientArr = [];
  for (let opac = 90; opac >= 5; opac -= 5) {
    const newColor = calculateGradient(color, false, opac / 100);
    gradientArr.push({
      hex: newColor.hex(),
      rgb: newColor.rgb().array()
    });
  }
  for (let opac = 5; opac <= 90; opac += 5) {
    const newColor = calculateGradient(color, true, opac / 100);
    gradientArr.push({
      hex: newColor.hex(),
      rgb: newColor.rgb().array()
    });
  }
  return gradientArr;
};

function calculateGradient(color, isDark, opacity) {
  return isDark
    ? color
        .mix(Color("black"), opacity)
        .rgb()
        .round()
    : color
        .mix(Color("white"), opacity)
        .rgb()
        .round();
  // return isDark
  //   ? col
  //       .darken(opacity)
  //       .rgb()
  //       .round()
  //       .array()
  //   : col
  //       .lighten(opacity)
  //       .rgb()
  //       .round()
  //       .array();
  // return rgb.map(val =>
  //   calculateIndividualColor(val, isDark ? 0 : 255, opacity)
  // );
}

export function attemptCreateColor(colorStr) {
  let color;

  try {
    color = Color(colorStr);
  } catch (err) {
    return null;
  }

  return color;
}

export function getAllColorInfo(color) {
  if (typeof color === "string") {
    color = Color(color);
  }

  return {
    contrast: getContrastColor(color).hex(),
    hex: color.hex(),
    rgb: color.rgb().array(),
    cmyk: color.cmyk().array(),
    hsl: color.hsl().array(),
    hsv: color.hsv().array(),
    name: getColorName(color.hex()),

    highContrast: getHighContrastColor(color).hex(),
    lowContrast: getLowContrastColor(color).hex(),
    oppositeContrast: getOppositeContrastColor(color).hex(),
    shades: calcAllGradients(color)
  };
}

export function getCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
