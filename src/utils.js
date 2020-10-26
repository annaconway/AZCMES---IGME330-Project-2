
// Utility Make Color Function
const makeColor = (red, green, blue, alpha = 1) => {
    return `rgba(${red},${green},${blue},${alpha})`;
};

// Utility Get Random Function
const getRandom = (min, max) => {
    return Math.random() * (max - min) + min;
};

// Utility Get Random Color
const getRandomColor = () => {
    const floor = 35; // so that colors are not too bright or too dark 
    const getByte = () => getRandom(floor, 255 - floor);
    return `rgba(${getByte()},${getByte()},${getByte()},1)`;
};

// Utility Get Linear Gradient Function
const getLinearGradient = (ctx, startX, startY, endX, endY, colorStops) => {
    let lg = ctx.createLinearGradient(startX, startY, endX, endY);
    for (let stop of colorStops) {
        lg.addColorStop(stop.percent, stop.color);
    }
    return lg;
};

// Utility Go Fullscreen function
const goFullscreen = (element) => {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullscreen) {
        element.mozRequestFullscreen();
    } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
    // .. and do nothing if the method is not supported
};


export { makeColor, getRandom, getRandomColor, getLinearGradient, goFullscreen };