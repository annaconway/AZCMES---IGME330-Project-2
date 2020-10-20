import * as utils from './utils.js';
import * as audio from './audio.js';

let analyserNode, audioData;
const canvasWidth = 700, canvasHeight = 400;
const barWidth = 10, barHeightMult = .1,gridOffset = 50;
let ctx;

function setupCanvas(canvasElement, analyserNodeRef) {

    // Create canvas
    ctx = canvasElement.getContext("2d");
    canvasElement.width = canvasWidth;
    canvasElement.height = canvasHeight;

    // Draw background
    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

}

function draw() {
    // Draw background
    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    for(let x = audio.K_SampleSpecs.numSamples/2-1; x >= 0 ; x--)
    {
        for(let y = 0; y < audio.K_SampleSpecs.delayTime  * audio.K_SampleSpecs.samplesPerSecond; y++)
        {
            let height = audio.getBarHeight(x,y) * barHeightMult;
            drawBarFromLeft(gridOffset + barWidth * x + height, gridOffset + barWidth * y - height,barWidth,barWidth,height,'khaki','coral');
        }
    }
    console.log("finished draw");
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