export const calcTextColor = rgb => {
  const lumRgb = rgb.map(el => {
    el = el / 255.000;
    return el <= 0.03928 ? el / 12.92 : Math.pow((el+0.055)/1.055, 2.4);
  });
  const lum = 0.2126 * lumRgb[0] + 0.7152 * lumRgb[1] + 0.0722 * lumRgb[2];
  // let isDark = lum > 0.179;
  let isDark = lum > Math.sqrt(1.05 * 0.05) - 0.05;
  return rgbToHex(...calculateGradient(rgb, isDark, 0.40));
}

const namer = require('color-namer');

export const getColorName = hex => {
  let colors = namer(hex, { pick: ['html', 'ntc', 'pantone'] });
  console.log(colors);
  let colorArr = [];
  for (const key in colors) {
    colorArr = mergeTwo(colorArr,colors[key])
  }
  console.log(colorArr);
  let sorted = colorArr.sort((a,b) => a.distance < b.distance);
  return sorted[0].name;
}

// Merge two already sorted arrays
const mergeTwo = (arr1, arr2) => {
  let merged = [];
  let index1 = 0;
  let index2 = 0;
  let current = 0;
  while (current < (arr1.length + arr2.length)) {
    let isArr1Depleted = index1 >= arr1.length;
    let isArr2Depleted = index2 >= arr2.length;
    if (!isArr1Depleted && (isArr2Depleted || (arr1[index1].distance < arr2[index2].distance))) {
      merged[current] = arr1[index1];
      index1++;
    } else {
      merged[current] = arr2[index2];
      index2++;
    }
    current++;
  }
  return merged;
}

export const rgbToHex = (r, g, b) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
    
const componentToHex = c => {
  var hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
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

const calculateGradient = (colorVals, isDark, opacity) => {
  if (isDark) {
    return colorVals.map(val => calculateIndividualColor(val,0,opacity))
  } else {
    return colorVals.map(val => calculateIndividualColor(val,255,opacity))
  } 
}

const calculateIndividualColor = (color, bColor, opacity) => {
  return Math.round(opacity * bColor + (1 - opacity) * color);
}    