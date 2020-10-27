import * as utils from './utils.js';
import * as audio from './audio.js';

let analyserNode, audioData;
const canvasWidth = 1075, canvasHeight = 300;
const barWidth = 8, barHeightMult = .15, gridOffset = 10;
let ctx;
let color, colorWater, colorPetal, colorAurora;

// Background animation variables
let stars = makeStars(5000);

// CANVAS SETUP
function setupCanvas(canvasElement) {

    // Create canvas
    ctx = canvasElement.getContext("2d");

    // Water Gradient
    colorWater = ctx.createLinearGradient(10, 0, 1050, 0);
    colorWater.addColorStop(0, 'lightblue');
    colorWater.addColorStop(1 / 6, 'skyblue');
    colorWater.addColorStop(2 / 6, 'aqua');
    colorWater.addColorStop(3 / 6, 'lightblue')
    colorWater.addColorStop(4 / 6, 'skyblue');
    colorWater.addColorStop(5 / 6, 'aqua');
    colorWater.addColorStop(1, 'lightblue');

    // Petal Gradient
    colorPetal = ctx.createLinearGradient(10, 0, 1050, 0);
    colorPetal.addColorStop(0, 'pink');
    colorPetal.addColorStop(1 / 6, 'plum');
    colorPetal.addColorStop(2 / 6, 'violet');
    colorPetal.addColorStop(3 / 6, 'pink')
    colorPetal.addColorStop(4 / 6, 'plum');
    colorPetal.addColorStop(5 / 6, 'violet');
    colorPetal.addColorStop(1, 'pink');

    // Aurorora Gradient
    colorAurora = ctx.createLinearGradient(10, 0, 1050, 0);

    colorAurora.addColorStop(0, utils.makeColor(0, 255, 255, 0.09));
    colorAurora.addColorStop(1 / 6, utils.makeColor(0, 128, 128, 0.5));
    colorAurora.addColorStop(2 / 6, utils.makeColor(46, 139, 87, 0.8));
    colorAurora.addColorStop(3 / 6, 'midnightblue')
    colorAurora.addColorStop(4 / 6, utils.makeColor(46, 139, 87, 0.8));
    colorAurora.addColorStop(5 / 6, utils.makeColor(0, 128, 128, 0.5));
    colorAurora.addColorStop(1, utils.makeColor(0, 255, 255, 0.09));

    // Set canvas size
    canvasElement.width = canvasWidth;
    canvasElement.height = canvasHeight;

    // Draw background
    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

}

// DRAW LOOP
function draw(colorParams = {}, customParams = {}, tick) {

    // Reset background every loop
    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    // Begin Drawing
    ctx.save();

    ctx.strokeStyle = 'black';
    ctx.lineWidth = "1";

    // Determine Color
    if (colorParams.colorPicnic) {
        color = 'white';
    }
    else if (colorParams.colorWater) {
        color = colorWater;
    }
    else if (colorParams.colorPetal) {
        color = colorPetal;
    }
    else if (colorParams.colorAurora) {

        color = colorAurora;

        // Animate stars
        moveStars(tick * 0.1);

        ctx.save();
        // Get the coordinate dimensions
        const cx = canvasWidth / 2;
        const cy = canvasHeight / 2;

        // Get the array length
        const count = stars.length;

        // Loop through array
        for (var i = 0; i < count; i++) {

            // Get 1 star
            const star = stars[i];

            // Modify it's x and y to canvas coords
            const x = cx + star.x / (star.z * 0.001);
            const y = cy + star.y / (star.z * 0.001);

            // Make sure it's within the bounds of the canvas
            if (x < 0 || x >= canvasWidth || y < 0 || y >= canvasHeight) {
                continue;
            }

            // Determine z distance for brightness
            const d = (star.z / 1000.0)
            const b = 1 - d * d

            // Draw star
            starPixel(x, y, b);
            ctx.restore();
        }
    }
    else if (colorParams.colorGraphPaper)
    {
        color = 'white';
        ctx.strokeStyle = 'CornflowerBlue'
    }
    else {
        color = 'black';
    }


    // Begin Drawing
    ctx.save();

    // Drawing settings
    ctx.fillStyle = color;


    // Standard Draw Loop
    let height1, height2, height3, height4;

    ctx.beginPath();
    for (let x = audio.K_SampleSpecs.numSamples / 2 - 1; x > 0; x--) {
        for (let y = 1; y < audio.K_SampleSpecs.delayTime * audio.K_SampleSpecs.samplesPerSecond; y++) {

            height1 = audio.getBarHeight(x, y) * barHeightMult;
            height2 = audio.getBarHeight(x - 1, y) * barHeightMult;
            height3 = audio.getBarHeight(x - 1, y - 1) * barHeightMult;
            height4 = audio.getBarHeight(x, y - 1) * barHeightMult;

            strokeQuad(gridOffset + barWidth * x + height1,
                gridOffset + barWidth * y + height1,
                gridOffset + barWidth * (x - 1) + height2,
                gridOffset + barWidth * y + height2,
                gridOffset + barWidth * (x - 1) + height3,
                gridOffset + barWidth * (y - 1) + height3,
                gridOffset + barWidth * x + height4,
                gridOffset + barWidth * (y - 1) + height4);
        }
    }
    ctx.closePath();

    // Fill Quads
    ctx.fill();

    // Determine whether Lines Show
    if (customParams.showLines && !colorParams.colorPicnic) {
        ctx.stroke();
    }

    // End Drawing
    ctx.restore();

    // Picnic draw loop
    if (colorParams.colorPicnic) {

        // Loop through values again to add checkerboard pattern
        ctx.fillStyle = 'red';

        ctx.beginPath();
        for (let x = audio.K_SampleSpecs.numSamples / 2 - 1; x > 0; x--) {
            for (let y = 1 + x % 2; y < audio.K_SampleSpecs.delayTime * audio.K_SampleSpecs.samplesPerSecond; y += 2) {
                height1 = audio.getBarHeight(x, y) * barHeightMult;
                height2 = audio.getBarHeight(x - 1, y) * barHeightMult;
                height3 = audio.getBarHeight(x - 1, y - 1) * barHeightMult;
                height4 = audio.getBarHeight(x, y - 1) * barHeightMult;

                strokeQuad(gridOffset + barWidth * x + height1,
                    gridOffset + barWidth * y + height1,
                    gridOffset + barWidth * (x - 1) + height2,
                    gridOffset + barWidth * y + height2,
                    gridOffset + barWidth * (x - 1) + height3,
                    gridOffset + barWidth * (y - 1) + height3,
                    gridOffset + barWidth * x + height4,
                    gridOffset + barWidth * (y - 1) + height4);
            }
        }
        ctx.closePath();

        // Fill Quads
        ctx.fill();
    }

    // End Drawing
    ctx.restore();


    // Effects
    if (customParams.showNoise || customParams.showInvert) {
        let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        let data = imageData.data;
        let length = data.length;
        let width = imageData.width;

        for (let i = 0; i < length; i += 4) {

            // Show Noise
            if (customParams.showNoise && Math.random() < customParams.noiseAmount) {
                // data[i] is the red channel
                // data[i+1] is the green channel
                // data[i+2] is the blue channel
                // data[i+3] is the alpha channel
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;
            }

            // Show Invert
            if (customParams.showInvert) {
                let red = data[i], green = data[i + 1], blue = data[i + 2];

                data[i] = 255 - red;
                data[i + 1] = 255 - green;
                data[i + 2] = 255 - blue;
            }
        }

        // Copy image data back to canvas
        ctx.putImageData(imageData, 0, 0);
    }
}

// DRAW BARS
function strokeQuad(x1, y1, x2, y2, x3, y3, x4, y4) {

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.lineTo(x1, y1);
}

// STAR DRAWING LOGIC
// source: https://medium.com/better-programming/fun-with-html-canvas-lets-create-a-star-field-a46b0fed5002
function makeStars(count) {

    // Make star array
    const out = [];

    // Find star positions
    for (let i = 0; i < count; i++) {

        const s = {
            x: utils.getRandom(-800, 800),
            y: utils.getRandom(-450, 450),
            z: Math.random(0, 1000)
        };

        out.push(s);
    }

    // Return star array
    return out;
}

function starPixel(x, y, brightness) {

    // Brightness between 0 and 1
    const intensity = brightness * 255;

    // Make grey color of varying brightness
    ctx.fillStyle = utils.makeColor(intensity, intensity, intensity);

    // Draw to canvas
    ctx.fillRect(x, y, 1, 1);

}

function moveStars(distance) {
    // Get the star array
    const count = stars.length;

    // Loop through array
    for (var i = 0; i < count; i++) {
        const s = stars[i];
        s.z -= distance;

        while (s.z <= 1) {
            s.z += 1000;
        }
    }
}





export { setupCanvas, draw };