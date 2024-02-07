import './reset.css'
import './styles.css'

//audio 2 tells the difference between audio 1 and 2, audio 3 tells the difference betwee audio 2 and 3, and audio 4 tells the difference between audio 3 and 4**
// Inputs:
const playButton = document.querySelector('#play-button') as HTMLButtonElement;
const mainVolumeSlider = document.querySelector('#main-volume-slider') as HTMLInputElement;
const mainSeekSlider = document.querySelector('#main-seek-slider') as HTMLInputElement;

// Audio Source Elements:
const tenorAudio = document.querySelector('#tenor-audio') as HTMLAudioElement;
const leadAudio = document.querySelector('#lead-audio') as HTMLAudioElement;
const baritoneAudio = document.querySelector('#baritone-audio') as HTMLAudioElement;
const bassAudio = document.querySelector('#bass-audio') as HTMLAudioElement;

// Create an AudioContext to hook up our flow.
const audioContext = new AudioContext()

// GainNode changes the volume (which we grab from our slider)
const gainNode = audioContext.createGain() //makes the object that controls the slider to go back and forth

gainNode.gain.value = parseFloat(mainVolumeSlider.value) //the gain is the specific audio property we are adjusting (in this case we are adjusting
//the main volume slider to start at the beginning)** and we set its value
//gamenode.gain is read only so we set the value property
//this sets the slider initially at the beginning of the slider

// We don't know what the duration is yet - not until we are playing!
// mainSeekSlider.max = tenorAudio.duration.toString()
// So we'll set a known bad value, and update it later!
//the duration is only if we build our own progress bar but if we use our html element controls that gives us a progress bar for free 
//and we can go back and fourth specific points (we had a lot of controls defined in our CSS so how do we know which ones make the progress bar)**
let duration = -1;

// These Sources are attached to the audioContext from the HTML
const tenorSource = audioContext.createMediaElementSource(tenorAudio) //create the audio from the above elements that were defined 
const leadSource = audioContext.createMediaElementSource(leadAudio)
const baritoneSource = audioContext.createMediaElementSource(baritoneAudio)
const bassSource = audioContext.createMediaElementSource(bassAudio)

// From the slides...
// Audio Context (audioContext) manager or the controller that is working around the other audio objects (how the audio communicates with each other)
//   has
// Sources (each of the voice sources) (the audios themselves)**
//   which pass through zero or many
// Effects (the gainNode to control volume) (things we add to enhance audio like compression, etc.)**
//   on the way to
// Outputs (audioContext.destination ... the computer speakers) (where we wanna output it like our left or right ear only or speaker only)**
tenorSource.connect(gainNode).connect(audioContext.destination) //we adjust the volume for these elements all at one time and we can go anywhere
//anything flowing through gainnode will be affected with by the gainnode on its way to the destination (gainode lets us move from source to destination)
//gainnode prevents us from starting the default at max volume (gain node is used for volume)**
leadSource.connect(gainNode).connect(audioContext.destination)
baritoneSource.connect(gainNode).connect(audioContext.destination)
bassSource.connect(gainNode).connect(audioContext.destination)
//adds each inidividual volume for each sound**

// Helper function to play multiple sources (and update button state).
const play = () => {
  tenorAudio.play(); //this sets up the play and pause for each element 
  leadAudio.play();
  baritoneAudio.play();
  bassAudio.play();
  playButton.dataset.playing = 'true';
  playButton.innerText = 'Pause'
}

// Helper function to pause multiple sources (and update button state).
const pause = () => {
  tenorAudio.pause();
  leadAudio.pause();
  baritoneAudio.pause();
  bassAudio.pause();
  playButton.dataset.playing = 'false';
  playButton.innerText = 'Play';
}

playButton.addEventListener('click', () => {
  // Check if context is in suspended state (autoplay policy)
  // We can only cause audio to play as a direct result of user input!
  // (meaning, from inside an interaction event handler like 'click')
  if (audioContext!.state === 'suspended') { //if its null ignore it (we know this wont be null so we can keep going as if it were not null)
    //when the page loads any audio context will be in suspended state because browser does not want us to play audio without consent
    //we need to resume audio context and the browser says it can only happen with a click or touch event or user interaction with the page
    //if the user clicks the play button we play the audio and its ok to do it because its inside the click button and the user
    //intends to play the audio
    audioContext!.resume(); //if the audio is not null then play it that would never be the case though for being null
    //right because even though it reaches the end it would
    //not be null because the audio could start all over again**
  }
  //this event listender is responsible for playing all the autios because the codontionals account for all the audios
  //but the above method is for the main play for all the audios associated with the seek slider**

  // MDN : https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
  // element.dataset describes and manages data-* attributes
  // useful for managing state on elements
  if (playButton.dataset.playing === 'false') {
    play();
  } else if (playButton.dataset.playing === 'true') {
    pause();
  }
  //how does it know to alternate if we are not setting the values
  //to true or false after we click the button (play and pause change the dataset values for us)

  //so if we resume the audio if its in a suspended state is that only for intial setup or is that for everytime we press play and pause
  //because if its for every time we press play and pause why would we have it then since its defined above the condtionals 
  //shouldnt it check first before playing same for when we initially want to play the audio**

})

// MDN : https://developer.mozilla.org/en-US/docs/Web/API/GainNode
// Setting gainNode.gain.value changes the volume of an AudioContext
mainVolumeSlider.addEventListener('input', () => {
  gainNode!.gain.value = parseFloat(mainVolumeSlider.value); //input is when we physically move the slider for the volume 
  //then we drag the value to the value we dragged it to 
  //gain expects a numeric value and the volume slider is a string so we convert it to a float (lets us have a fractional decimal component to it)

  //is the !. a typescript thing just incase a value does not exist**
  //is everything except a click event an input event (how to know when to use input events)**
})

// MDN : https://developer.mozilla.org/en-US/docs/Web/API/Element/input_event
// Fires when target's value changes ::as a direct result of user input:: (what does the :: mean)**
mainSeekSlider.addEventListener('input', () => {
  const targetTime = parseFloat(mainSeekSlider.value); //the seek slider is set to be from 0 to the duratino and getting that value as a number
  //and set the 4 tracks to go to that position in their audio files when we drag the main seek slider and below is when its actually playing**
  tenorAudio.currentTime = targetTime
  leadAudio.currentTime = targetTime
  baritoneAudio.currentTime = targetTime
  bassAudio.currentTime = targetTime
  //we add a main slider for the playtime for eahc audio**
})

// NOTICE - the interaction between input and timeupdate!
// We can change mainSeekSlider.value (in response to timeupdate)
// WITHOUT causing the mainSeekSlider to fire an input event
// BECAUSE input only fires as a direct result of user input.
// (otherwise, we'd be in danger of an infinite loop of updates) (go over)**

// MDN : https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event
// Fires when target media's currentTime has been updated.
//why do we use tenorAudio here initially as well as for pause cant we use the main seek slider how does it stop and play the 
//rest of the audios for the timeupdate then**
tenorAudio.addEventListener('timeupdate', () => { //we listen to the tenoraudio track and it gives time updates for its current time as it plays
  //and we respond to that and have the knob travel along with the audio as it plays 
  mainSeekSlider.value = tenorAudio.currentTime.toString()

  // we also check if the audio knows its duration
  // and update the seekSlider to match
  const knownDuration = tenorAudio.duration; //total time for the audio file (duration is -1 from the starting value)
  //we update our known duration then make the seekslider max to be the knownduration as a string 
  if (knownDuration !== duration) {
    duration = knownDuration;
    mainSeekSlider.max = knownDuration.toString() //how long the bar has to be that plays the audio (updating the bar with the duration once
    //we know what it is)

    //so basically whenever the audio is changing as it plays it changes the duration because the knownDuration changes so it goes into the conditional
    //but for the max seek slider that is our current position in the bar of the whole song**
    //how does the slider update for the above method with input if the duration does not change causing the knob to not change**

    //browser still may be loading the audio file so we check and see how long the duration is and implement it this way (dont use time from audio file)
  }
})

// MDN : https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event
// Fires when target media playback has completed.
tenorAudio.addEventListener('ended', () => {
  pause();
})

//once we press play again the browser lets us restart the audio

//what is the difference between audio 2 and audio 1 because in GitHub it says
//This branch isn't all that much different from `audio-01` ... it just displays the controls for the individual parts.**
//I looked at audio 1 and it looks the same with the controls for the individual parts so how are they different then**