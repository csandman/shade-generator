import nearestColor from 'nearest-color';
import namedColors from 'color-name-list';

export const getRandomHexColor = () => {
  return '#'+'0123456789abcdef'.split('').map((v,i,a) => {
    return i>5 ? null : a[Math.floor(Math.random()*16)] 
  }).join('');
}

const isContrastDark = rgb => {
  const lumRgb = rgb.map(el => {
    el = el / 255.000;
    return el <= 0.03928 ? el / 12.92 : Math.pow((el+0.055)/1.055, 2.4);
  });
  const lum = 0.2126 * lumRgb[0] + 0.7152 * lumRgb[1] + 0.0722 * lumRgb[2];
  const isDark = lum > Math.sqrt(1.05 * 0.05) - 0.05; // ~= 0.179
  return isDark;
}

export const getContrastColor = rgb => {
  const isDark = isContrastDark(rgb)
  return rgbToHex(...calculateGradient(rgb, isDark, 0.40));
}

export const getOppositeContrastColor = rgb => {
  const isDark = isContrastDark(rgb)
  return rgbToHex(...calculateGradient(rgb, !isDark, 0.30));
}

export const getHighContrastColor = rgb => {
  const isDark = isContrastDark(rgb)
  return rgbToHex(...calculateGradient(rgb, isDark, 0.70));
}

export const getLowContrastColor = rgb => {
  const isDark = isContrastDark(rgb)
  return rgbToHex(...calculateGradient(rgb, isDark, 0.20));
}

export const searchNamedColors = searchTerm => {
  for (let i = 0; i < namedColors.length; i++) {
    if (namedColors[i].name.replace(/\s/g,'').toLowerCase() === searchTerm)
      return parse(namedColors[i].hex).hex;
  }
  return null;
}

// Uses the named-colors library for a list of named of colors
// and uses nearest color to match the entered color to the closest
// option with a name
export const getColorName = hex => {
  const colors = namedColors.reduce((o, { name, hex }) => Object.assign(o, { [name]: hex }), {});
  const nearest = nearestColor.from(colors);
  return nearest(hex).name;
}

export const rgbToHex = (r, g, b) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
    
const componentToHex = c => {
  var hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

export const hexToRgb = hex => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}

const parse = require('parse-color');

export const calcAllGradients = rgb => {
  let gradientArr = [];
  for (let opac = 90; opac >= 5; opac-=5) {
    gradientArr.push(parse(rgbToHex(...calculateGradient(rgb,false,opac/100))));
  }
  for (let opac = 5; opac <= 90; opac+=5) {
    gradientArr.push(parse(rgbToHex(...calculateGradient(rgb,true,opac/100))));
  }
  return gradientArr;
}

const calculateGradient = (rgb, isDark, opacity) => {
  if (isDark)
    return rgb.map(val => calculateIndividualColor(val,0,opacity));
  else
    return rgb.map(val => calculateIndividualColor(val,255,opacity));
}

const calculateIndividualColor = (color, bColor, opacity) => {
  return Math.round(opacity * bColor + (1 - opacity) * color);
}

export const getAllColorInfo = colorStr => {
  let colorObj = parse(colorStr);
  colorObj.hex = colorObj.hex.toUpperCase();
  colorObj.contrast = getContrastColor(colorObj.rgb).toUpperCase();
  colorObj.highContrast = getHighContrastColor(colorObj.rgb).toUpperCase();
  colorObj.lowContrast = getLowContrastColor(colorObj.rgb).toUpperCase();
  colorObj.oppositeContrast = getOppositeContrastColor(colorObj.rgb).toUpperCase();
  colorObj.name = getColorName(colorObj.hex);
  colorObj.shades = calcAllGradients(colorObj.rgb).map(childObj => {
    childObj.highContrast = getHighContrastColor(childObj.rgb);
    childObj.contrast = getContrastColor(childObj.rgb);
    childObj.lowContrast = getLowContrastColor(childObj.rgb);
    childObj.oppositeContrast = getOppositeContrastColor(childObj.rgb);
    return childObj;
  })
  return colorObj;
}