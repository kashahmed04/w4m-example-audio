import { Part } from './Part';
import './reset.css'
import './styles.css'

const playButton = document.querySelector('#play-button') as HTMLButtonElement;
const mainVolumeSlider = document.querySelector('#main-volume-slider') as HTMLInputElement;
const mainSeekSlider = document.querySelector('#main-seek-slider') as HTMLInputElement;

// Parent element of all Part.markup elements
const partsMarkup = document.querySelector('#parts') as HTMLElement;
//this holds all the audios and in the HTML we made a class controls for each audio so
//each audio will have a play bar (the children of a class get the elements the class has
//like the controls right)

const audioContext = new AudioContext()

// Make Part instances for each vocal part
const parts: Part[] = [
  new Part('Tenor', '#tenor-audio', audioContext), //this makes the main communicator between each audio and makes them audios for the
  //browser themselevs**
  new Part('Lead', '#lead-audio', audioContext),
  new Part('Baritone', '#baritone-audio', audioContext),
  new Part('Bass', '#bass-audio', audioContext),
];

// When we want to do timeupdate and ended events, we only need to talk about one Part.
// (And apply that value to the others.)
// We'll select the first one and call it mainAudioElement.
const mainAudioElement = parts[0].audioElement; //get the audio element for the tenor (instances from the part class)
//we could have gotten any instance right it doesnt have to be specific(yes)

// We still have a single GainNode for global volume
const gainNode = audioContext.createGain()
gainNode.gain.value = parseFloat(mainVolumeSlider.value)

let duration = -1;

// Connect each Part to the audioContext.destination (speakers)
// AND append its HTML markup to the DOM
parts.forEach((part) => {
  part.patch().connect(gainNode).connect(audioContext.destination) //we get the audio file and we connect it to the source to the desintion
  //gainnode for the volume of each slider to be dragged around and the above is to initially start the volume at 0
  partsMarkup.appendChild(part.markup)  //does this only append the div with the names to the parts section
  //because markup div only contained the h2 (yes)

})


const play = () => {
  // tell each part to play
  parts.forEach((part) => {
    part.play();
  })
  playButton.dataset.playing = 'true';
  playButton.innerText = 'Pause'
}

const pause = () => {
  // tell each part to pause
  parts.forEach((part) => {
    part.pause();
  })
  playButton.dataset.playing = 'false';
  playButton.innerText = 'Play';
}

playButton.addEventListener('click', () => {
  if (audioContext!.state === 'suspended') {
    audioContext!.resume();
  }

  if (playButton.dataset.playing === 'false') {
    play();
  } else if (playButton.dataset.playing === 'true') {
    pause();
  }
})

mainVolumeSlider.addEventListener('input', () => {
  gainNode!.gain.value = parseFloat(mainVolumeSlider.value);
})

mainSeekSlider.addEventListener('input', () => {
  const targetTime = parseFloat(mainSeekSlider.value);
  parts.forEach((part) => {
    part.timeTo(targetTime);
  })
})

mainAudioElement.addEventListener('timeupdate', () => { //timeupdate is for as the audio is playing
  mainSeekSlider.value = mainAudioElement.currentTime.toString()

  const knownDuration = mainAudioElement.duration;
  if (knownDuration !== duration) {
    duration = knownDuration;
    mainSeekSlider.max = knownDuration.toString()
  }
})

mainAudioElement.addEventListener('ended', () => {
  pause();
})
