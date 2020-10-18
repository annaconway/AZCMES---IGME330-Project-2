const canvasWidth = 700, canvasHeight = 400;
let canvas, ctx;

window.onload = init;

function init() {
    canvas = document.querySelector("#mainCanvas");
    ctx = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
    drawBarFromLeft(500, 10, 50, 50, 150, "blue", "skyblue");
    drawBarFromLeft(100, 100, 50, 50, 75, "red", "coral");    
    drawBarFromBottom(150, 175, 60, 80, 150, "pink", "hotpink");  
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