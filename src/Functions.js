import nearestColor from 'nearest-color';
import namedColors from 'color-name-list';
import Color from 'color';

export function getRandomColor() {
  const color = '0123456789ABCDEF'.split('').reduce((a, c, i, arr) => {
    return i < 6 ? a + arr[Math.floor(Math.random() * 16)] : a;
  }, '#');
  return Color(color);
}

function calculateGradient(color, isDark, opacity) {
  return isDark
    ? color
        .mix(Color('black'), opacity)
        .rgb()
        .round()
    : color
        .mix(Color('white'), opacity)
        .rgb()
        .round();
}

export function getContrastColor(color, minContrastRatio = 4.5) {
  const isDark = !color.isDark();
  let i = 0.01;
  let contrastColor;
  let contrastRatio = 0;
  while (contrastRatio < minContrastRatio && i < 0.9) {
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
  for (let i = 0; i < namedColors.length; i += 1) {
    if (namedColors[i].name.replace(/\s/g, '').toLowerCase() === searchTerm)
      return namedColors[i].hex.toUpperCase();
  }
  return null;
}

// Uses the named-colors library for a list of named of colors
// and uses nearest color to match the entered color to the closest
// option with a name
export function getColorName(hexCode) {
  const colors = namedColors.reduce(
    (o, { name, hex }) => Object.assign(o, { [name]: hex }),
    {}
  );
  const nearest = nearestColor.from(colors);
  return nearest(hexCode).name;
}

export function calcAllGradients(color) {
  const gradientArr = [];
  for (let opac = 90; opac >= 5; opac -= 5) {
    const newColor = calculateGradient(color, false, opac / 100);
    gradientArr.push({
      hex: newColor.hex(),
      rgb: newColor.rgb().array(),
      contrastRatio: color.contrast(newColor),
      contrastLevel: color.level(newColor),
      isDark: newColor.isDark()
    });
  }
  for (let opac = 5; opac <= 90; opac += 5) {
    const newColor = calculateGradient(color, true, opac / 100);
    gradientArr.push({
      hex: newColor.hex(),
      rgb: newColor.rgb().array(),
      contrastRatio: color.contrast(newColor),
      contrastLevel: color.level(newColor),
      isDark: newColor.isDark()
    });
  }
  return gradientArr;
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

export function getAllColorInfo(colorVal) {
  let color;
  if (typeof colorVal === 'string') {
    color = Color(colorVal);
  } else {
    color = colorVal;
  }

  return {
    contrast: getContrastColor(color).hex(),
    hex: color.hex(),
    rgb: color.rgb().array(),
    cmyk: color.cmyk().array(),
    hsl: color.hsl().array(),
    hsv: color.hsv().array(),
    name: getColorName(color.hex()),

    highContrast: getContrastColor(color, 7.0).hex(),
    lowContrast: getLowContrastColor(color).hex(),
    oppositeContrast: getOppositeContrastColor(color).hex(),
    shades: calcAllGradients(color)
  };
}

export function parseColorFromString(str) {
  const cleanStr = str.replace(/\s/g, '').toLowerCase();
  let hex = '';
  if (!hex) {
    try {
      hex = attemptCreateColor(cleanStr).hex();
    } catch (err) {
      // ignore invalid expression
    }
  }
  if (!hex) {
    try {
      hex = attemptCreateColor(`#${cleanStr}`).hex();
    } catch (err) {
      // ignore invalid expression
    }
  }
  if (!hex) {
    try {
      hex = searchNamedColors(cleanStr);
    } catch (err) {
      // ignore invalid expression
    }
  }

  return hex.toUpperCase();
}

export function getCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
