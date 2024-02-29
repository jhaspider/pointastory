export const Util_f = {
  randomColor: () => {
    let colors = ["#1eae98", "#f29191", "#f1ca89", "#ffdf6b", "#fea82f", "#ff7bf5", "#ffd6a5", "#caffbf", "#9bf6ff", "#a0c4ff"];
    let color = colors[Math.floor(Math.random() * colors.length)];
    return color;
  },

  hitTest: (a, b) => {
    const padding = 20;
    var aX1 = a.left;
    var aY1 = a.top;
    var aX2 = aX1 + a.dimension;
    var aY2 = aY1;
    var aX3 = aX1;
    var aY3 = aY1 + a.dimension;
    var aX4 = aX2;
    var aY4 = aY3;

    var bX1 = b.initCord.left;
    var bY1 = b.initCord.top;
    var bX2 = bX1 + b.dimension + padding;
    var bY2 = bY1;
    var bX3 = bX1;
    var bY3 = bY1 + b.height + padding;
    var bX4 = bX2;
    var bY4 = bY3;

    var hOverlap = true;
    if (aX1 < bX1 && aX2 < bX1) hOverlap = false;
    if (aX1 > bX2 && aX2 > bX2) hOverlap = false;

    var vOverlap = true;
    if (aY1 < bY1 && aY3 < bY1) vOverlap = false;
    if (aY1 > bY3 && aY3 > bY3) vOverlap = false;

    if (hOverlap && vOverlap) return true;
    else return false;
  },
  isTouchingBoundingBox: (cord, box) => {
    let padding = 80;
    if (cord.left > padding && cord.left < box.width - padding && cord.top > padding && cord.top < box.height - padding) {
      return false;
    }
    return true;
  },
  isOverlapping: (drawnItems, newItem) => {
    let overlap = false;
    for (let j = 0; j < drawnItems.filter((item) => item.dimension > 0).length; j++) {
      let test = hitTest(newItem, drawnItems[j]);
      if (test) {
        overlap = true;
        break;
      }
    }
    return overlap;
  },
};
