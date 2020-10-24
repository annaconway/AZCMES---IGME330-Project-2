
let audioCtx;                                               //public
let element, sourceNode, analyserNode, gainNode, delayNode; //private
//temp
let merger, splitter;

const DEFAULTS = Object.freeze({
    gain: .5,
});

const K_SampleSpecs = Object.freeze({
    numSamples: 256,
    delayTime: .5,
    samplesPerSecond: 60
});

// ARRAY FOR AUDIO FREQUENCY DATA
let height = K_SampleSpecs.delayTime * K_SampleSpecs.samplesPerSecond;
let width = K_SampleSpecs.numSamples / 2;
let arrLength = width * height;
let writeLocation = 0;
let yOffset = 0;
let audioData = new Uint8Array(arrLength);
let tempArr = new Uint8Array(width);
let biquadFilter;
let lowShelfBiquadFilter;
let distortionFilter;

function getBarHeight(x, y) {
    return audioData[(x + (y + yOffset) * width) % arrLength];
}

function sample() {
    analyserNode.getByteFrequencyData(tempArr);
    for (let i = writeLocation; i < writeLocation + width; i++) {
        audioData[i] = tempArr[i - writeLocation];
    }
    yOffset += 1;
    yOffset = yOffset >= height ? 0 : yOffset;
    writeLocation = yOffset * width;
}



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

    // Biquad Filter nodes
    biquadFilter = audioCtx.createBiquadFilter();
    biquadFilter.type = "highshelf";
    lowShelfBiquadFilter = audioCtx.createBiquadFilter();
    lowShelfBiquadFilter.type = "lowshelf";

    // Distortion Filter node
    distortionFilter = audioCtx.createWaveShaper();

    analyserNode.fftSize = K_SampleSpecs.numSamples;

    // Volume node
    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;

    // Delay Node
    delayNode = audioCtx.createDelay(10.0);
    delayNode.delayTime.value = K_SampleSpecs.delayTime;

    // Connect nodes
    //sourceNode.connect(analyserNode);
    //analyserNode.connect(gainNode);
    //gainNode.connect(delayNode);
    //delayNode.connect(audioCtx.destination);

    sourceNode.connect(distortionFilter);
    distortionFilter.connect(biquadFilter);
    biquadFilter.connect(lowShelfBiquadFilter);
    lowShelfBiquadFilter.connect(analyserNode);
    analyserNode.connect(gainNode);
    gainNode.connect(delayNode);
    delayNode.connect(audioCtx.destination);
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

function toggleHighshelf(params={}) {
    if (params.highshelf) {
        biquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime); // we created the `biquadFilter` (i.e. "treble") node last time
        biquadFilter.gain.setValueAtTime(25, audioCtx.currentTime);
    } else {
        biquadFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}

function toggleLowshelf(params={}) {
    if (params.lowshelf) {
        lowShelfBiquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
        lowShelfBiquadFilter.gain.setValueAtTime(15, audioCtx.currentTime);
    } else {
        lowShelfBiquadFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}

function toggleDistortion(params={}) {
    if (params.distortion) {
        distortionFilter.curve = null; 
        distortionFilter.curve = makeDistortionCurve(distortionAmount);
    } else {
        distortionFilter.curve = null;
    }
}

function makeDistortionCurve(amount = 20) {
    let n_samples = 256, curve = new Float32Array(n_samples);
    for (let i = 0; i < n_samples; ++i) {
        let x = i * 2 / n_samples - 1;
        curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
    }
    return curve;
}

export { audioCtx, toggleHighshelf, makeDistortionCurve, toggleLowshelf, toggleDistortion, setupWebaudio, playCurrentSound, pauseCurrentSound, loadSoundFile, setVolume, getBarHeight, sample, K_SampleSpecs };