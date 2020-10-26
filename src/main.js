
import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

// Color Options
const customize = {

    colorWater: false,
    colorPetal: false,
    colorAurora: false,
    colorPicnic: false,
    colorGraphPaper: true
};

// Button Options
const features = {
    useWaveForm: false,
    showLines: true,
    showNoise: false,
    showInvert: false,
    highshelf: false,
    lowshelf: false,
    distortion: false,
    distortionAmount: 20
};


const DEFAULTS = Object.freeze({
    sound1: "media/Howl's Theme.mp3"
});

// Main Init
function init() {    
    let audioControls = document.querySelector("#mainAudio");
    let canvasElement = document.querySelector("canvas");
    canvas.setupCanvas(canvasElement);
    setupUI(canvasElement);

    audio.setupWebaudio(DEFAULTS.sound1,audioControls);

    loop();
}

// Animation data
let sampleTimer = 0;
let frameTimer = 0;
let frameCount = 0;
var lastUpdate = Date.now();

function loop() {

    // Count Frames
    frameCount += 1;

    var now = Date.now();
    var dt = now - lastUpdate;

    lastUpdate = now;
    sampleTimer += dt;
    frameTimer += dt;
    if (sampleTimer >= 1000 / audio.K_SampleSpecs.samplesPerSecond) {
        audio.sample(features.useWaveForm);
        sampleTimer -= 1000 / audio.K_SampleSpecs.samplesPerSecond;
    }
    if (frameTimer > 1000) {
        frameTimer = 0;
        console.log(frameCount);
        frameCount = 0;
    }

    // Draw bars
    canvas.draw(customize, features, dt);

    // Recall loop
    requestAnimationFrame(loop);
}


function setupUI(canvasElement) {
    // FULLSCREEN BUTTON
    const fsButton = document.querySelector("#fsButton");
    fsButton.onclick = e => {
        utils.goFullscreen(canvasElement);
    };

    // TRACK SELECT
    let trackSelect = document.querySelector("#trackSelect");
    trackSelect.onchange = e => {
        audio.loadSoundFile(e.target.value);

        // pause the current track
        if (playButton.dataset.playing = "yes") {
            playButton.dispatchEvent(new MouseEvent("click"));
        }
    }

    // LINES SELECT
    document.querySelector("#linesCB").checked = features.showLines;
    document.querySelector("#linesCB").onchange = e => {
        features.showLines = e.target.checked;
    };

    // NOISE SELECT
    document.querySelector("#noiseCB").checked = features.showNoise;
    document.querySelector("#noiseCB").onchange = e => {
        features.showNoise = e.target.checked;
    };

    // INVERT SELECT
    document.querySelector("#invertCB").checked = features.showInvert;
    document.querySelector("#invertCB").onchange = e => {
        features.showInvert = e.target.checked;
    };

    // COLOR SELECT
    let colorSelect = document.querySelector("#colorSelect");
    colorSelect.onchange = e => {
        // store type
        let type = e.target.value;

        customize.colorWater = false;
        customize.colorPetal = false;
        customize.colorAurora = false;
        customize.colorPicnic = false;
        customize.colorGraphPaper = false;

        // set selected true
        if (type == "colorWater") {
            customize.colorWater = true;
        }
        if (type == "colorAurora") {
            customize.colorAurora = true;
        }
        if (type == "colorPetal") {
            customize.colorPetal = true;
        }
        if(type == "colorPicnic") {
            customize.colorPicnic = true;
        }
        if(type == "colorGraphPaper"){
            customize.colorGraphPaper = true;
        }
    }

    document.querySelector("#useWaveForm").onchange = e => {
        features.useWaveForm = e.bubbles;
    }

    document.querySelector("#useFrequency").onchange = e => {
        features.useWaveForm = !e.bubbles;
    }

    // COLOR SELECT
    document.querySelector('#highshelfCB').checked = features.highshelf;
    document.querySelector('#highshelfCB').onchange = e => {
        features.highshelf = e.target.checked;
        audio.toggleHighshelf(features);
    };

    // COLOR SELECT
    document.querySelector('#distortionSlider').value = features.distortionAmount;
    document.querySelector('#distortionSlider').onchange = e => {
        features.distortionAmount = Number(e.target.value/10);
        audio.toggleDistortion(features);
    };

    // COLOR SELECT
    document.querySelector("#distortionCB").checked = features.distortion;
    document.querySelector("#distortionCB").onchange = e => {
        features.distortion = e.target.checked;
        audio.toggleDistortion(features);
    };

    // COLOR SELECT
    document.querySelector("#lowshelfCB").checked = features.lowshelf;
    document.querySelector("#lowshelfCB").onchange = e => {
        features.lowshelf = e.target.checked;
        audio.toggleLowshelf(features);
    };

    document.querySelector('#mainAudio').onplay = _ => {
        audio.playCurrentSound();
        audio.toggleDistortion(features);
        audio.toggleLowshelf(features);
        audio.toggleDistortion(features);
    }

} // end setupUI

export { init };