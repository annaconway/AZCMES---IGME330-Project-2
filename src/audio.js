
let audioCtx;                                               //public
let element, sourceNode, analyserNode, gainNode, delayNode; //private
//temp
let merger, splitter;

const DEFAULTS = Object.freeze({
    gain: .5,
});

const K_SampleSpecs = Object.freeze({
    numSamples: 32,
    delayTime: 1,
    samplesPerSecond: 30
});

// ARRAY FOR AUDIO FREQUENCY DATA
let height = K_SampleSpecs.delayTime * K_SampleSpecs.samplesPerSecond;
let width = K_SampleSpecs.numSamples / 2;
let arrLength = width * height;
let writeLocation = 0;
let yOffset = 0;
let audioData = new Uint8Array(arrLength);
let tempArr = new Uint8Array(width);

function getBarHeight(x,y)
{
    return audioData[(x + (y + yOffset) * width)%arrLength];
}

function sample()
{
    analyserNode.getByteFrequencyData(tempArr);
    for(let i = writeLocation; i < writeLocation + width; i++)
    {
        audioData[i]= tempArr[i-writeLocation];
    }
    yOffset += 1;
    yOffset = yOffset >= height ? 0 : yOffset;
    writeLocation = yOffset*width;
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

    analyserNode.fftSize = K_SampleSpecs.numSamples;

    // Volume node
    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;

    delayNode = audioCtx.createDelay(10.0);
    delayNode.delayTime.value = K_SampleSpecs.delayTime;

    // Connect nodes
    sourceNode.connect(analyserNode);
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

export { audioCtx, setupWebaudio, playCurrentSound, pauseCurrentSound, loadSoundFile, setVolume, getBarHeight, sample, K_SampleSpecs };