
let audioCtx;                                               //public
let element, sourceNode, analyserNode, gainNode;            //private

const DEFAULTS = Object.freeze({
    gain: .5,
    numSamples: 256
});

// ARRAY FOR AUDIO FREQUENCY DATA
let audioData = new Uint8Array(DEFAULTS.numSamples / 2);

// PUBLIC FUNCTION THAT SETS UP AUDIO NODES
function setupWebaudio(filePath) {

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    // Creates <audio> element
    element = new Audio();

    // Grab sound file
    loadSoundFile(filePath);

    // Source and Analyser nodes
    sourceNode = audioCtx.createMediaElementSource(element);
    analyserNode = audioCtx.createAnalyser(); 

    analyserNode.fftSize = DEFAULTS.numSamples;

    // Volume node
    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;

    // Connect nodes
    sourceNode.connect(analyserNode);
    analyserNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
}

// PUBLIC FUNCTION THAT LOADS SOUND FILE
function loadSoundFile(filePath) {
    element.src = filePath;
}

// PUBLIC FUNCTION THAT PLAYS CURRENT SOUND
function playCurrentSound() {
    element.play();
}

// PUBLIC FUNCTION THAT PAUSES CURRENT SOUND
function pauseCurrentSound() {
    element.pause();
}

// PUBLIC FUNCTION THAT SETS VOLUME
function setVolume(value) {
    value = Number(value);
    gainNode.gain.value = value;
}

export { audioCtx, setupWebaudio, playCurrentSound, pauseCurrentSound, loadSoundFile, setVolume, analyserNode };