
import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';


// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
    sound1: "media/Peanuts Theme.mp3"
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
var lastUpdate = Date.now();
function loop() {
    canvas.draw();

    var now = Date.now();
    var dt = now - lastUpdate;

    lastUpdate = now;
    sampleTimer += dt;
    if(sampleTimer >= 1/audio.K_SampleSpecs.samplesPerSecond)
    {
        audio.sample();
        sampleTimer -= 1/audio.K_SampleSpecs.samplesPerSecond;
        console.log("sampled");
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

} // end setupUI

export { init };