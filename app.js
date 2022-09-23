window.AudioContext = window.AudioContext || webkit.AudioContext;

let ctx = new AudioContext();

const startButton = document.querySelector(".start");
const oscillators = {};

startButton.addEventListener("click", () => {
  ctx = new AudioContext();
  console.log(ctx);
});



function midiToFreq(number) {
  const a = 440;
  return (a / 32) * (2 ** ((number - 9) / 12));
}

 
if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess().then(success, failure);
}
function success(midiAccess) {
  // midiAccess.onstatechange = updateDevices; FUNCTIONS SAME AS .addEventListener
  midiAccess.addEventListener("statechange", updateDevices);
  const inputs = midiAccess.inputs;
  console.log(inputs);

  inputs.forEach((input) => {
    console.log(input);
    // input.onmidimessage = handleInput;
    input.addEventListener("midimessage", handleInput);
  });
}

function handleInput(input) {
  // console.log(input);
  const command = input.data[0];
  const note = input.data[1];
  const velocity = input.data[2];

  // console.log(command, "Command")

  switch (command) {
    case 144: // note on
      if (velocity > 0) {
        // console.log('note is on')
        noteOn(note, velocity);
      } else {
        noteOff(note);
      }
      break;
      case 128:
      noteOff(note);
      break;
  }
}

function noteOn(note, velocity) {
  const oscillator = ctx.createOscillator();
  const oscDelay = ctx.createDelay()
  oscDelay.delayTime.value = 0.5;
  console.log(oscDelay);


  const feedback = ctx.createGain();
  feedback.gain.value = 0.3;  
  
  // console.logo(oscillators);

  const oscGain = ctx.createGain();
  oscGain.gain.value = '0.33 ';
  
  const velocityGainAmount = (1/127) * velocity;
  const velocityGain = ctx.createGain();
  velocityGain.gain.value = velocityGainAmount;

  oscillator.type = "triangle";
  oscillator.frequency.value = midiToFreq(note);
  
  oscillator.connect(oscGain); 

  oscGain.connect(velocityGain);
  oscGain.connect(oscDelay);
  oscDelay.connect(velocityGain);
  // oscDelay.connect(feedback);
  // feedback.connect(oscDelay);
  velocityGain.connect(ctx.destination);

  // setting up to fade note on release
  oscillator.gain = oscGain;

  oscillators[note.toString()] = oscillator;
  oscillator.start();

}

function noteOff(note, velocity) {
  const oscillator = oscillators[note.toString()];
  const oscGain = oscillator.gain; 

  oscGain.gain.setValueAtTime(oscGain.gain.value, ctx.currentTime);
  oscGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

  setTimeout(() => {
    oscillator.stop();
    oscillator.disconnect();
  }, 20)

  delete oscillators[note.toString()];

  // console.log('Oscillators', oscillators)

}
function updateDevices(event) {
  // console.log(event);
  // console.log(`Name: ${event.port.name}, Brand: ${event.port.manufacturer}, State: ${event.port.state }, Type: ${event.port.type}`)
}

function failure() {
  console.log(`Could not connect MIDI`);
}
