import nearestColor from 'nearest-color';
import { colornames } from 'color-name-list';
import parseColor from 'parse-color';
import Color, { type ColorInstance, type ColorLike } from 'color';

export interface ColorShade {
  hex: string;
  rgb: number[];
  contrastRatio: number;
  contrastLevel: string;
  isDark: boolean;
}

export interface ColorInfo {
  contrast: string;
  hex: string;
  rgb: number[];
  cmyk: number[];
  hsl: number[];
  hsv: number[];
  name: string;
  highContrast: string;
  lowContrast: string;
  oppositeContrast: string;
  shades: ColorShade[];
  timeString?: string;
  dateString?: string;
  keyword?: string;
}

export function getRandomColor(): ColorInstance {
  const color = [...'0123456789ABCDEF'].reduce(
    (a: string, _c: string, i: number, arr: string[]) =>
      i < 6 ? a + arr[Math.floor(Math.random() * 16)] : a,
    '#',
  );
  return Color(color);
}

function calculateGradient(
  color: ColorInstance,
  isDark: boolean,
  opacity: number,
): ColorInstance {
  return isDark
    ? color.mix(Color('black'), opacity).rgb().round()
    : color.mix(Color('white'), opacity).rgb().round();
}

export function getContrastColor(
  color: ColorInstance,
  minContrastRatio = 4.5,
): ColorInstance {
  const isDark = !color.isDark();
  let i = 0.01;
  let contrastColor: ColorInstance | undefined;
  let contrastRatio = 0;
  while (contrastRatio < minContrastRatio && i < 0.9) {
    contrastColor = calculateGradient(color, isDark, i);
    contrastRatio = color.contrast(contrastColor);
    i += 0.01;
  }
  return contrastColor!;
}

export function getOppositeContrastColor(color: ColorInstance): ColorInstance {
  const isDark = color.isLight();
  return calculateGradient(color, !isDark, 0.3);
}

export function getHighContrastColor(color: ColorInstance): ColorInstance {
  const isDark = color.isLight();
  return calculateGradient(color, isDark, 0.7);
}

export function getLowContrastColor(color: ColorInstance): ColorInstance {
  const isDark = color.isLight();
  return calculateGradient(color, isDark, 0.2);
}

export function searchNamedColors(searchTerm: string): string | null {
  for (const color of colornames) {
    if (color.name.replaceAll(/\s/g, '').toLowerCase() === searchTerm) {
      return color.hex.toUpperCase();
    }
  }
  return null;
}

// Uses the named-colors library for a list of named of colors
// and uses nearest color to match the entered color to the closest
// option with a name
export function getColorName(hexCode: string): string {
  const colors = colornames.reduce<Record<string, string>>(
    (o, { name, hex }) => Object.assign(o, { [name]: hex }),
    {},
  );
  const nearest = nearestColor.from(colors);
  const result = nearest(hexCode);
  return result ? result.name : '';
}

export function calcAllGradients(color: ColorInstance): ColorShade[] {
  const gradientArr: ColorShade[] = [];
  for (let opac = 90; opac >= 5; opac -= 5) {
    const newColor = calculateGradient(color, false, opac / 100);
    gradientArr.push({
      hex: newColor.hex(),
      rgb: newColor.rgb().array(),
      contrastRatio: color.contrast(newColor),
      contrastLevel: color.level(newColor),
      isDark: newColor.isDark(),
    });
  }
  for (let opac = 5; opac <= 90; opac += 5) {
    const newColor = calculateGradient(color, true, opac / 100);
    gradientArr.push({
      hex: newColor.hex(),
      rgb: newColor.rgb().array(),
      contrastRatio: color.contrast(newColor),
      contrastLevel: color.level(newColor),
      isDark: newColor.isDark(),
    });
  }
  return gradientArr;
}

export function attemptCreateColor(colorStr: ColorLike): ColorInstance | null {
  try {
    const color = Color(colorStr);
    return color;
  } catch {
    return null;
  }
}

export function getAllColorInfo(colorVal: ColorInstance | string): ColorInfo {
  const color = typeof colorVal === 'string' ? Color(colorVal) : colorVal;

  return {
    contrast: getContrastColor(color).hex(),
    hex: color.hex(),
    rgb: color.rgb().array(),
    cmyk: color.cmyk().array(),
    hsl: color.hsl().array(),
    hsv: color.hsv().array(),
    name: getColorName(color.hex()),

    highContrast: getContrastColor(color, 7).hex(),
    lowContrast: getLowContrastColor(color).hex(),
    oppositeContrast: getOppositeContrastColor(color).hex(),
    shades: calcAllGradients(color),
  };
}

export function parseColorFromString(str: string): string {
  const cleanStr = str.replaceAll(/\s/g, '').toLowerCase();
  const hex =
    attemptCreateColor(cleanStr)?.hex() ||
    attemptCreateColor(`#${cleanStr}`)?.hex() ||
    parseColor(cleanStr)?.hex ||
    searchNamedColors(cleanStr) ||
    '';
  return hex.toUpperCase();
}
