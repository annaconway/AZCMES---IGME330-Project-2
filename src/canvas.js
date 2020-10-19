import * as utils from './utils.js';

let analyserNode, audioData;
const canvasWidth = 700, canvasHeight = 400;
let ctx;

function setupCanvas(canvasElement, analyserNodeRef) {

    // Create canvas
    ctx = canvasElement.getContext("2d");
    canvasElement.width = canvasWidth;
    canvasElement.height = canvasHeight;

    // Keep a reference to the analyser node
    analyserNode = analyserNodeRef;

    // This is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize / 2);

    // Draw background
    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

}

function draw() {

    analyserNode.getByteFrequencyData(audioData); // Frequency data
    //analyserNode.getByteTimeDomainData(audioData); // Waveform data
}


function drawBarFromLeft(x, y, width, length, barLength, fillColor, strokeColor) {

    ctx.save();
    ctx.lineWidth = "4";
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;

    // Draw Square
    ctx.fillRect(x, y, width, length);
    ctx.strokeRect(x, y, width, length);

    // Draw Lines 
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(0, y + barLength);
    ctx.lineTo(0, y + length + barLength);
    ctx.lineTo(x, y + length);
    ctx.lineTo(x, y);
    ctx.fill();
    ctx.stroke();

    ctx.moveTo(x + width, y + length);
    ctx.lineTo(0, y + length + length + barLength);
    ctx.lineTo(0, y + length + barLength);
    ctx.lineTo(x, y + length);
    ctx.lineTo(x + width, y + length);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

function drawBarFromBottom(x, y, width, length, barLength, fillColor, strokeColor) {

    ctx.save();
    ctx.lineWidth = "4";
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