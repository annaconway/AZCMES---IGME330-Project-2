
import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

const customize = {

    colorWater: false,
    colorPetal: false,
    colorAurora: true,
    colorPicnic: false
};

const features = {
    showLines: true,
    showNoise: false,
    showInvert: false,
    highshelf: false,
    lowshelf: false,
    distortion: false,
    distortionAmount: 20
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
    sound1: "media/Howl's Theme.mp3"
});

function init() {
    // Pick sound
    audio.setupWebaudio(DEFAULTS.sound1);

    // Hookup <canvas> element
    let canvasElement = document.querySelector("canvas");
    setupUI(canvasElement);
    canvas.setupCanvas(canvasElement, audio.analyserNode);
    loop();
}

let sampleTimer = 0;
let frameTimer = 0;
let frameCount = 0;
var lastUpdate = Date.now();

function loop() {
    frameCount += 1;
    canvas.draw(customize, features);

    var now = Date.now();
    var dt = now - lastUpdate;

    lastUpdate = now;
    sampleTimer += dt;
    frameTimer += dt;
    if (sampleTimer >= 1000 / audio.K_SampleSpecs.samplesPerSecond) {
        audio.sample();
        sampleTimer -= 1000 / audio.K_SampleSpecs.samplesPerSecond;
    }
    if (frameTimer > 1000) {
        frameTimer = 0;
        console.log(frameCount);
        frameCount = 0;
    }
    requestAnimationFrame(loop);
}


function setupUI(canvasElement) {
    // FULLSCREEN BUTTON
    const fsButton = document.querySelector("#fsButton");
    fsButton.onclick = e => {
        utils.goFullscreen(canvasElement);
    };

    // VOLUME SLIDER
    let volumeSlider = document.querySelector("#volumeSlider");
    let volumeLabel = document.querySelector("#volumeLabel");
    volumeSlider.oninput = e => {
        audio.setVolume(e.target.value);
        volumeLabel.innerHTML = Math.round((e.target.value / 2 * 100));
    };
    volumeSlider.dispatchEvent(new Event("input"));

    // PLAY BUTTON
    playButton.onclick = e => {

        if (audio.audioCtx.state == "suspended") {
            audio.audioCtx.resume();
        }

        if (e.target.dataset.playing == "no") {
            audio.playCurrentSound();
            e.target.dataset.playing = "yes";
        } else {
            audio.pauseCurrentSound();
            e.target.value = "Play";
            e.target.dataset.playing = "no";
        }
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

        // set all false
        customize.colorWater = false;
        customize.colorGalaxy = false;
        customize.colorPetal = false;
        customize.colorPicnic = false;

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
    }

    // COLOR SELECT
    document.querySelector('#highshelfCB').checked = features.highshelf;
    document.querySelector('#highshelfCB').onchange = e => {
        features.highshelf = e.target.checked;
        audio.toggleHighshelf(features);
    };
    audio.toggleHighshelf(features);

    // COLOR SELECT
    document.querySelector('#distortionSlider').value = features.distortionAmount;
    document.querySelector('#distortionSlider').onchange = e => {
        features.distortionAmount = Number(e.target.value);
        audio.toggleDistortion(features);
    };

    // COLOR SELECT
    document.querySelector("#distortionCB").checked = features.distortion;
    document.querySelector("#distortionCB").onchange = e => {
        features.distortion = e.target.checked;
        audio.toggleDistortion(features);
    };
    audio.toggleDistortion();

    // COLOR SELECT
    document.querySelector("#lowshelfCB").checked = features.lowshelf;
    document.querySelector("#lowshelfCB").onchange = e => {
        features.lowshelf = e.target.checked;
        audio.toggleLowshelf(features);
    };

} // end setupUI

export { init };