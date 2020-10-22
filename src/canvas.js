import * as utils from './utils.js';
import * as audio from './audio.js';

let analyserNode, audioData;
const canvasWidth = 1050, canvasHeight = 300;
const barWidth = 8, barHeightMult = .15,gridOffset = 10;
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

    //draw bars
/*     for(let x = audio.K_SampleSpecs.numSamples/2-1; x >= 0 ; x--)
    {
        for(let y = 0; y < audio.K_SampleSpecs.delayTime  * audio.K_SampleSpecs.samplesPerSecond; y++)
        {
            let height = audio.getBarHeight(x,y) * barHeightMult;
            drawBarFromLeft(gridOffset + barWidth * x + height, gridOffset + barWidth * y - height,barWidth,barWidth,height,'khaki','coral');
        }
    } */


    //draw quads
    ctx.save();
    ctx.lineWidth = "2";
    ctx.strokeStyle = 'coral';
    ctx.fillStyle = 'khaki';
    ctx.beginPath();
    for(let x = audio.K_SampleSpecs.numSamples/2-1; x > 0 ; x--)
    {
        for(let y = 1; y < audio.K_SampleSpecs.delayTime  * audio.K_SampleSpecs.samplesPerSecond; y++)
        {
            let height1 = audio.getBarHeight(x,y) * barHeightMult;
            let height2 = audio.getBarHeight(x-1,y) * barHeightMult;
            let height3 = audio.getBarHeight(x-1,y-1) * barHeightMult;
            let height4 = audio.getBarHeight(x,y-1) * barHeightMult;
            
            let x1 = gridOffset + barWidth * x + height1;
            let y1 = gridOffset + barWidth * y + height1;
            let x2 = gridOffset + barWidth * (x-1) + height2;
            let y2 = gridOffset + barWidth * y + height2;
            let x3 = gridOffset + barWidth * (x-1) + height3;
            let y3 = gridOffset + barWidth * (y-1) + height3;
            let x4 = gridOffset + barWidth * x + height4;
            let y4 = gridOffset + barWidth * (y-1) + height4;

            //drawTris(x1,y1,x2,y2,x3,y3,'khaki','coral');
            //drawTris(x1,y1,x4,y4,x3,y3,'khaki','coral');
            
  
            strokeQuad(x1,y1,x2,y2,x3,y3,x4,y4);
        }
    }
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

function drawTris(x1,y1,x2,y2,x3,y3, fillColor, strokeColor)
{
    ctx.save();
    ctx.lineWidth = "2";
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;

    // Draw Lines 
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3,y3);
    ctx.lineTo(x1, y1);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

function strokeQuad(x1,y1,x2,y2,x3,y3,x4,y4)
{
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3,y3);
    ctx.lineTo(x4,y4);
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