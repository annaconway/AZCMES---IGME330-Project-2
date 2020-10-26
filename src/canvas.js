import * as utils from './utils.js';
import * as audio from './audio.js';

let analyserNode, audioData;
const canvasWidth = 1050, canvasHeight = 290;
const barWidth = 8, barHeightMult = .15, gridOffset = 10;
let ctx;
let color, colorWater, colorPetal, colorAurora;

function setupCanvas(canvasElement, analyserNodeRef) {

    // Create canvas
    ctx = canvasElement.getContext("2d");

    colorWater = ctx.createLinearGradient(10, 0, 1050, 0);
    colorWater.addColorStop(0, 'lightblue');
    colorWater.addColorStop(1 / 6, 'skyblue');
    colorWater.addColorStop(2 / 6, 'aqua');
    colorWater.addColorStop(3 / 6, 'lightblue')
    colorWater.addColorStop(4 / 6, 'skyblue');
    colorWater.addColorStop(5 / 6, 'aqua');
    colorWater.addColorStop(1, 'lightblue');

    colorPetal = ctx.createLinearGradient(10, 0, 1050, 0);
    colorPetal.addColorStop(0, 'pink');
    colorPetal.addColorStop(1 / 6, 'plum');
    colorPetal.addColorStop(2 / 6, 'violet');
    colorPetal.addColorStop(3 / 6, 'pink')
    colorPetal.addColorStop(4 / 6, 'plum');
    colorPetal.addColorStop(5 / 6, 'violet');
    colorPetal.addColorStop(1, 'pink');

    colorAurora = ctx.createLinearGradient(10, 0, 1050, 0);
    colorAurora.addColorStop(0, 'aqua');
    colorAurora.addColorStop(1 / 6, 'teal');
    colorAurora.addColorStop(2 / 6, 'seagreen');
    colorAurora.addColorStop(3 / 6, 'midnightblue')
    colorAurora.addColorStop(4 / 6, 'seagreen');
    colorAurora.addColorStop(5 / 6, 'teal');
    colorAurora.addColorStop(1, 'aqua');

    canvasElement.width = canvasWidth;
    canvasElement.height = canvasHeight;

    // Draw background
    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

}

function draw(colorParams = {}, customParams = {}) {
    // Draw background
    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    // Draw quads
    ctx.save();
    if (colorParams.colorPicnic)
    {
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
    }
    else {
        color = 'black';
    }
    ctx.fillStyle = color;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = "1";

    //standard draw loop
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
    ctx.fill();
    if (customParams.showLines && !colorParams.colorPicnic) {
        ctx.stroke();
    }
    ctx.restore();

    //picnic draw loop
    if (colorParams.colorPicnic) {
        //loop through values again to add checkerboard pattern
        ctx.fillStyle = 'red';
        ctx.beginPath();
        for (let x = audio.K_SampleSpecs.numSamples / 2 - 1; x > 0; x--) {
            for (let y = 1 + x%2; y < audio.K_SampleSpecs.delayTime * audio.K_SampleSpecs.samplesPerSecond; y+=2) {
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
        ctx.fill();
    }

    ctx.restore();


    //effects
    if (customParams.showNoise || customParams.showInvert) {
        let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        let data = imageData.data;
        let length = data.length;
        let width = imageData.width;

        for (let i = 0; i < length; i += 4) {
            if (customParams.showNoise && Math.random() < .1) {
                // data[i] is the red channel
                // data[i+1] is the green channel
                // data[i+2] is the blue channel
                // data[i+3] is the alpha channel
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;
            } // end if
            if (customParams.showInvert) {
                let red = data[i], green = data[i + 1], blue = data[i + 2];

                data[i] = 255 - red;
                data[i + 1] = 255 - green;
                data[i + 2] = 255 - blue;
            }
        } // end for

        // D) copy image data back to canvas
        ctx.putImageData(imageData, 0, 0);
    }
}

function drawTris(x1, y1, x2, y2, x3, y3, fillColor, strokeColor) {
    ctx.save();
    ctx.lineWidth = "2";
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;

    // Draw Lines 
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x1, y1);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

function strokeQuad(x1, y1, x2, y2, x3, y3, x4, y4) {

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.lineTo(x1, y1);
}

//modified to not be only drawn from left edge
function drawBarFromLeft(x, y, width, length, barLength, fillColor, strokeColor) {

    ctx.save();
    ctx.lineWidth = "2";
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;

    // Draw Square
    ctx.fillRect(x, y, width, length);
    ctx.strokeRect(x, y, width, length);

    // Draw Lines 
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - barLength, y + barLength);
    ctx.lineTo(x - barLength, y + length + barLength);
    ctx.lineTo(x, y + length);
    ctx.lineTo(x, y);
    ctx.fill();
    ctx.stroke();

    ctx.moveTo(x + width, y + length);
    ctx.lineTo(x - barLength + width, y + length + barLength);
    ctx.lineTo(x - barLength, y + length + barLength);
    ctx.lineTo(x, y + length);
    ctx.lineTo(x + width, y + length);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

function drawBarFromBottom(x, y, width, length, barLength, fillColor, strokeColor) {

    ctx.save();
    ctx.lineWidth = "2";
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;

    // Draw Square
    ctx.fillRect(x, y, width, length);
    ctx.strokeRect(x, y, width, length);

    // Draw Lines 
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - barLength, canvasHeight);
    ctx.lineTo(x + width - barLength, canvasHeight);
    ctx.lineTo(x, y + length);
    ctx.lineTo(x, y);
    ctx.fill();
    ctx.stroke();

    ctx.moveTo(x + width, y + length);
    ctx.lineTo(x + width + width - barLength, canvasHeight);
    ctx.lineTo(x + width - barLength, canvasHeight);
    ctx.lineTo(x, y + length);
    ctx.lineTo(x + width, y + length);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

export { setupCanvas, draw };