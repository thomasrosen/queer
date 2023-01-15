function hexToRGBArray(color) {
  if (color.startsWith('#')) {
    color = color.substring(1)
  }

  if (color.length === 3) {
    color = color.charAt(0) + color.charAt(0) + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2);
  } else if (color.length !== 6) {
    throw (new Error('Invalid hex color: ' + color));
  }

  let rgb = [];
  for (var i = 0; i <= 2; i++) {
    rgb[i] = parseInt(color.substr(i * 2, 2), 16);
  }

  return rgb;
}
function luma(color) {
  // color can be a hex string or an array of RGB values 0-255
  const rgb = (typeof color === 'string') ? hexToRGBArray(color) : color;
  return (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]); // SMPTE C, Rec. 709 weightings
}
function getContrastingColorFromHex(color) {
  // source: https://stackoverflow.com/questions/635022/calculating-contrasting-colours-in-javascript
  // exact answer: https://stackoverflow.com/a/6511606/2387277
  // example: https://jsfiddle.net/thomasrosen/9njo6t7s/20/

  return (luma(color) >= 165) ? '#000' : '#fff';
}

function string2color(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}

module.exports = {
  getContrastingColorFromHex,
  string2color,
};
