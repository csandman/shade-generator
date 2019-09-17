import nearestColor from "nearest-color";
import namedColors from "color-name-list";

export const getRandomHexColor = () => {
    return "0123456789ABCDEF".split("").reduce((a, c, i, arr) => {
        return i < 6 ? a + arr[Math.floor(Math.random() * 16)] : a;
    }, "#");
};

function getRandomRgbColor(){
  return Array(3).fill().map(() => Math.floor(Math.random() * 255));
}

export const getContrastColor = rgb => {
    let contrastIsDark = isContrastDark(rgb);
    let i = 0.01;
    const minContrastRatio = 4.5;
    let contrastRgb = [];
    let contrastRatio = 0;
    while (contrastRatio < minContrastRatio && i < 1) {
        contrastRgb = calculateGradient(rgb, contrastIsDark, i);
        contrastRatio = getContrastRatio(rgb, contrastRgb, contrastIsDark);
        i += 0.01;
    }
    return rgbToHex(contrastRgb);
};

const getContrastRatio = (rgb1, rgb2, isDark) => {
    return isDark
        ? (getLuminance(rgb1) + 0.05) / (getLuminance(rgb2) + 0.05)
        : (getLuminance(rgb2) + 0.05) / (getLuminance(rgb1) + 0.05);
};

const isContrastDark = rgb => {
    const isDark = getLuminance(rgb) > Math.sqrt(1.05 * 0.05) - 0.05; // ~= 0.179
    return isDark;
};

const rgbToLinearRgb = rgb => {
    return rgb.map(el => {
        el = el / 255.0;
        return el <= 0.03928 ? el / 12.92 : ((el + 0.055) / 1.055) ** 2.4;
    });
};

const getLuminance = rgb => {
    const linRgb = rgbToLinearRgb(rgb);
    return 0.2126 * linRgb[0] + 0.7152 * linRgb[1] + 0.0722 * linRgb[2];
};

// export const getContrastColor = rgb => {
//   const isDark = isContrastDark(rgb)
//   return rgbToHex(calculateGradient(rgb, isDark, 0.40));
// }

export const getOppositeContrastColor = rgb => {
    const isDark = isContrastDark(rgb);
    return rgbToHex(calculateGradient(rgb, !isDark, 0.3));
};

export const getHighContrastColor = rgb => {
    const isDark = isContrastDark(rgb);
    return rgbToHex(calculateGradient(rgb, isDark, 0.7));
};

export const getLowContrastColor = rgb => {
    const isDark = isContrastDark(rgb);
    return rgbToHex(calculateGradient(rgb, isDark, 0.2));
};

export const searchNamedColors = searchTerm => {
    for (let i = 0; i < namedColors.length; i++) {
        if (namedColors[i].name.replace(/\s/g, "").toLowerCase() === searchTerm)
            return parse(namedColors[i].hex).hex;
    }
    return null;
};

// Uses the named-colors library for a list of named of colors
// and uses nearest color to match the entered color to the closest
// option with a name
export const getColorName = hex => {
    const colors = namedColors.reduce(
        (o, { name, hex }) => Object.assign(o, { [name]: hex }),
        {}
    );
    const nearest = nearestColor.from(colors);
    return nearest(hex).name;
};

export const rgbToHex = rgb => {
    const [r, g, b] = rgb;
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

const componentToHex = c => {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
};

export const hexToRgb = hex => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? [
              parseInt(result[1], 16),
              parseInt(result[2], 16),
              parseInt(result[3], 16)
          ]
        : null;
};

const parse = require("parse-color");

export const calcAllGradients = rgb => {
    let gradientArr = [];
    for (let opac = 90; opac >= 5; opac -= 5) {
        let newColor = { rgb: calculateGradient(rgb, false, opac / 100) };
        newColor.hex = rgbToHex(newColor.rgb);
        gradientArr.push(newColor);
    }
    for (let opac = 5; opac <= 90; opac += 5) {
        let newColor = { rgb: calculateGradient(rgb, true, opac / 100) };
        newColor.hex = rgbToHex(newColor.rgb);
        gradientArr.push(newColor);
    }
    return gradientArr;
};

const calculateGradient = (rgb, isDark, opacity) => {
    return rgb.map(val =>
        calculateIndividualColor(val, isDark ? 0 : 255, opacity)
    );
};

const calculateIndividualColor = (color, bColor, opacity) => {
    return Math.round(opacity * bColor + (1 - opacity) * color);
};

export const getAllColorInfo = colorStr => {
    let colorObj = parse(colorStr);
    colorObj.hex = colorObj.hex.toUpperCase();
    colorObj.contrast = getContrastColor(colorObj.rgb).toUpperCase();
    colorObj.highContrast = getHighContrastColor(colorObj.rgb).toUpperCase();
    colorObj.lowContrast = getLowContrastColor(colorObj.rgb).toUpperCase();
    colorObj.oppositeContrast = getOppositeContrastColor(
        colorObj.rgb
    ).toUpperCase();
    colorObj.name = getColorName(colorObj.hex);
    colorObj.shades = calcAllGradients(colorObj.rgb).map(childObj => {
        // childObj.highContrast = getHighContrastColor(childObj.rgb);
        // childObj.contrast = getContrastColor(childObj.rgb);
        // childObj.lowContrast = getLowContrastColor(childObj.rgb);
        // childObj.oppositeContrast = getOppositeContrastColor(childObj.rgb);
        return childObj;
    });
    return colorObj;
};

export const getCopy = obj => {
    return JSON.parse(JSON.stringify(obj));
};
