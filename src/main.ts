import './reset.css'
import './styles.css'

//audio 2 tells the difference between audio 1 and 2, audio 3 tells the difference between audio 2 and 3, and audio 4 tells the difference between audio 3 and 4
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
//the audio context is shared across all instances of the audio
//manager (or sandbox) or context in which the audio operations are happening 

//listener and panner node require a z coordinate but we could have hard coded them as 0 

// GainNode changes the volume (which we grab from our slider)
const gainNode = audioContext.createGain() //makes the object that controls the slider to go back and forth

gainNode.gain.value = parseFloat(mainVolumeSlider.value) //the gain is the specific audio property we are adjusting (in this case we are adjusting
//the main volume slider to start at the beginning) and we set its value
//gamenode.gain is read only so we set the value property
//this sets the slider initially at the beginning of the slider
//so gain is only used for volume usually and we change its value for where the volume slider starts at for gain

// We don't know what the duration is yet - not until we are playing!
// mainSeekSlider.max = tenorAudio.duration.toString()
// So we'll set a known bad value, and update it later!
//the duration is only if we build our own progress bar but if we use our html element controls that gives us a progress bar for free 
//and we can go back and fourth specific points (we had a lot of controls defined in our CSS so how do we know which ones make the progress bar)
//(audio controls) in the HTML give us the progress bar for the audio
//type range makes input looks like a slider
let duration = -1;

// These Sources are attached to the audioContext from the HTML
const tenorSource = audioContext.createMediaElementSource(tenorAudio) //create the audio from the above elements that were defined 
const leadSource = audioContext.createMediaElementSource(leadAudio)
const baritoneSource = audioContext.createMediaElementSource(baritoneAudio)
const bassSource = audioContext.createMediaElementSource(bassAudio) 

// From the slides...
// Audio Context (audioContext) manager or the controller that is working around the other audio objects (source is guitar and
//peadals would be effects and the
//amp would be destination and the whole system is the audio context)
//(how the audio communicates with each other)
//   has
// Sources (each of the voice sources) (the audios themselves)
//   which pass through zero or many
// Effects (the gainNode to control volume) (things we add to enhance audio or make it worse like compression, etc.)
//   on the way to
// Outputs (audioContext.destination ... the computer speakers) (where we wanna output it like our left or right ear only or speaker only)(left or
//right ear only input is a mix of outputs and effects)
tenorSource.connect(gainNode).connect(audioContext.destination) //we adjust the volume for these elements all at one time and we can go anywhere
//anything flowing through gainnode will be affected with by the gainnode on its way to the destination (gainode lets us move from source to destination)
//gainnode prevents us from starting the default at max volume because above we set it as the volume slider value which was 0.5
//and this allows us to actually move around the volume sliders individually for each element
//from the start to the end of the slider(gain node is used for volume)

//since we made the main volume slider the max value which was 0.5 for sound (the whole bar) how does it know 
//to make the maxmimum the same 0.5 for the audios even though they had no value defined for them**

//connect wires up the sources and the gain uses the min max to make sure the volume and the destination is the operating system like speakers or headphones
leadSource.connect(gainNode).connect(audioContext.destination)
baritoneSource.connect(gainNode).connect(audioContext.destination)
bassSource.connect(gainNode).connect(audioContext.destination)
//adds each inidividual volume for each sound

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
    //because even though it reaches the end it would
    //not be null because the audio could start all over again but it would be suspended once it got to the end**
    //and we have to press play again for the restart so its not suspended**
    // (it remains active even though we reach the end because we can restart the audio)
    //so its suspended when we pause or when we reach the end of the audio but when its playing its not suspended**
  }

  //the above contional is if the browser is allowed to play the content at all and it detects if the audio is waiting for user action to play
  //audio context resume has to be on click or touch event

  // MDN : https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
  // element.dataset describes and manages data-* attributes
  // useful for managing state on elements
  // if(playButton.innerText == "play"){ instead of having a dataset for the play button cant we do a conditional based on the innerHTML
                                          //of play button if its playing or paused to play the audio or stop it**

  // }
  if (playButton.dataset.playing === 'false') {
    play();
  } else if (playButton.dataset.playing === 'true') {
    pause();
  }
  //how does it know to alternate if we are not setting the values
  //to true or false after we click the button (play and pause change the dataset values for us)

})

// MDN : https://developer.mozilla.org/en-US/docs/Web/API/GainNode
// Setting gainNode.gain.value changes the volume of an AudioContext
mainVolumeSlider.addEventListener('input', () => {
  gainNode!.gain.value = parseFloat(mainVolumeSlider.value); //input is when we physically move the slider for the volume 
  //then we drag the value to the value we dragged it to 
  //gain expects a numeric value and the volume slider is a string so we convert it to a float (lets us have a fractional decimal component to it)

  //the !. a typescript thing 
})

// MDN : https://developer.mozilla.org/en-US/docs/Web/API/Element/input_event
// Fires when target's value changes ::as a direct result of user input:: (input fires as a direct result of user input and 
//the seek slider changes the tenor audio for timeudpdate so if that input reacted for any time to change it would cause the input to
//run the current time and there would be too many inputs)(call each other back and fourth and block up the system)
mainSeekSlider.addEventListener('input', () => {
  const targetTime = parseFloat(mainSeekSlider.value); //the seek slider is set to be from 0 to the duratino and getting that value as a number
  //and set the 4 tracks to go to that position in their audio files when we drag the main seek slider and below is when its actually playing (yes)
  tenorAudio.currentTime = targetTime
  leadAudio.currentTime = targetTime
  baritoneAudio.currentTime = targetTime
  bassAudio.currentTime = targetTime
  //this takes the value of seek slider and updates all audio files to go to that time 

  //if this is main input of seek slider how does the other audio change as time goes on because this only takes the input
  //of when we move the slider**
})

// NOTICE - the interaction between input and timeupdate!
// We can change mainSeekSlider.value (in response to timeupdate)
// WITHOUT causing the mainSeekSlider to fire an input event
// BECAUSE input only fires as a direct result of user input.
// (otherwise, we'd be in danger of an infinite loop of updates) 

// MDN : https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event
// Fires when target media's currentTime has been updated.
//why do we use tenorAudio here initially
//we have to listen to one of the audio channels because the timeupdate is coming from the audio we are listening to 
//and the main seek slider is already with another timeupdate event (we use any of the 4 audio tracks)(since all 4 are playing at the same time
//we play any one of them)
//timeupdate is on an HTML media element like an audio or video and it fires off anytime during playback and the media element advances to a new time
//seek slider does not have a time it represents a time (its not an HTML element for main seek slider so we use an individual audio element)
//seek slider is not an audio itself so we use one audio to detect for the time
tenorAudio.addEventListener('timeupdate', () => { //we listen to the tenoraudio track and it gives time updates for its current time as it plays
  //and we respond to that and have the main seek slider knob travel along with the tenor audio as it plays
  //sliders take inputs as strings
  mainSeekSlider.value = tenorAudio.currentTime.toString() //this updates the slider according to the time 

  //this is the tenor audio telling seek slider where to go and as the seek slider goes the other values also go from the above method 
  // we also check if the audio knows its duration
  // and update the seekSlider to match
  const knownDuration = tenorAudio.duration; //total time for the audio file (duration is -1 from the starting value)
  //we update our known duration then make the seekslider max to be the knownduration as a string 
  if (knownDuration !== duration) {
    duration = knownDuration;
    mainSeekSlider.max = knownDuration.toString() //how long the bar has to be that plays the audio (updating the bar with the duration once
    //we know what it is)

    //this method specifically runs the whole time we are on the browser even when the audio is not playing
    //to fix the durations of the audio or just leave the knob at the beginning of the slider right and the rest of the methods
    //only run when it detects that event on the screen or are they also running constantly in the background**

    //how to know what is constantly playing in the background and what is not in general**

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




/** 
 * SLIDES:
 * 
 * Context has sources which pass through zero-many effects on the way to outputs. 
 * so basically this means that the sources like a file or a microphone we use in real time could have 0 or multiple effects
 * on its way to output the file or what we said into the micrphone and where to output it (left or right ear or speaker)
 * 
 * is the sources like a gutiar peadeal board to connect all the audios together or is it the whole process (sources, effects, and output also known
 * as audio context)**
 * 
 * for the last slide is it saying that each individual volume slider (since its gain and gain only involves volume)
 * its conected to the global volume slider so as we adjust the global one for all cases it will also adjust
 * the local volumes and that leads to the destination which is the output for us to hear**
 * 
 * or are the volumes seperate for all cases and the global volume does not effect the other audios
 * or the other audios dont effect the global volume**
 * 
 * 
*/




/*
  NEW NOTES:

  we are going to look at 3 different audios today 

  AUDIO 4B:

  we go to current branch tab to change bracnhes 
  theres a scroll bar the same as audio 4 but we add the visualization for the tone of voice
  we have 4 divs and each of tem have 1024 spans with 100 pixels wide and tall**
  and we change each span based on the audio we get back**

  part has new class properties and its call a pass through since it inspects the audio and does not change it**
  we also have a uint 8 array and its an unsigned integer 8 bit and its different from typical JS array because its a fixed size and we cant 
  add or remove from it**
  since its a fixed size its easier to add new frames since there will be no data changed**

  we have pur array of span element (bars)** 

  and we have markup array which is parent of the bars**

  audio context to set the analyzer (it stands out for FFT) and FFT is an algorithm for taking wave form signal and making audios into frequencies**
  we also use the transform property to scale a picture as a percetange (usually use percentqge with transform)(fast because its a compisition element)**

  we have the fftsize which is the 1024 samples but we always put double for the fftsize to get it out (has to be powers of 2 numbers though no odd nubers)**

  frequency bin count does**

  make the div and set the height then we expand visualize and it generates a bar and puts it in bars array
  for the fft array and appends it to visualziermarkup and we do request animtation frame to**

  anyimte we pass a function as an event handler its going to forget the this argument for the function and we use an arrow function to bind the this.
  to the fucntion without saying this. while making a function**

  analyzernode has the fft arra and it automatically**

  iterate through array and calulate amplitude and the data is going to range from 0-255 but we change it from 0-100 because**

  then we update stlye stranfrom for that bars for the scaleY to be**

  requestanimation frame to update per frame for this loop**

  TIME DOMAIN DATA (us this a differnet example):

  more of the raw wave form rather than frequency distribution like previous exmaple

  in styles we have a bar and all of our spans have a bar**

  we set it as inline block and have it line up next to its neighbor and have tranform origin be where we make the origin to rotate it at the bottom
  left so it roates on the bottom left**

  AUDIO 5 (POSITIONAL AUDIO):

  we have a dragger JS file and we have the circle and the label and the coorindates with an x,y,z attached to it and we have a boolean for dragging state
  and we have an offset which**

  we have a position callback which takes in coordinates and returns nothing and we call it to update parts of the app as we move on**

  we make the elements and set the coorindates and apply them and we have mousedoen element and set the dragging to true and the x and y offset based on our mouse**

  we have a mousemove event and if its dragging we update its coordinates and it takes our mouse coorindates and subtracts it from our offset so we get back
  to the same point we clicked on**

  there is a register update function that lets something else specify the callback and we call the position callback and when we apply coorindates we update
  the coorindates and the**

  in the main javascript file we have starting coorindates for our obkects and make a new dragger for all the drags in the document

  in index.html we have 5 divs for our audios and our ears**

  we do query selector to get**

  we are going to query selector all to get a div element for our element (returns a div)**

  we push it into our draggers array and if we give the foreach a second argument then**

  we give the draggers to the part objects and we have a listener and it has a position and a forward value**

  0,0 is in the upper left y is positve on the bottom and x is positive right and z is positive into the screen and negative outside of screen**

  listenders forward value is straight up and the up value is pointing outside of the screen**

  we update the label to the ears and every time it updates its position it takes coorindates and applies it to position of the listener**

  for the part class we have the coorindates and we have a panner node and the dragger and we update the label and when we make 
  panner node it has 14 different properties and we make it an object when we declare our new apnner node instance**

  panning model is**

  the diatnce model is the decay and we use linear**

  we have the position for the audio source in the scene and the orientation which is what direction its facing**

  we have ref distance which is how we make the scale of our scene and models and we leave it as one because**

  we have max distance is the units we have before we stop hearing something and the rollofffactor is how fast it cuts off while we get further away**

  the cone inner angle is**

  the cone outer gain is everything outside of the cone and**

  for the patch we have our source node and our gain node and we connect the panner node so we get spatial effects as well**

  whatever audio we click on the compare it compres the file to the previous one we had seen**

  AUDIO 6 (ANIMATION):

  we took the wave output from the 4B and apply it to the transform to the upper half of the character and since the roatation is first then**

  most of the changes are in dragger and we has to lower (chin) and upper is the head and eyebrows and the eyes are in the style sheet**

  in the upper we have eyes and we have peusdeo selector and it lets us specify**

  we say the content is display block with width and height with**

  eyes before and eyes after have specifial conditons set to it**

  in dragger we have making the character in a lot of elements we create in divs**

  we have a sing function and we put the rotation and last percent within the file but we should put it at the top of the class file for properties and vairbales**

  we get a percent and the first conditon says take a look at current percent and compare it to last percent and change the orientation of the character

  and the second condtional is when we start from 0 and get a higher percent (quiet and started singing again) so set roation

  the last constional is when we are silent close the mouth (roation)**

  the position of the eyes brows are tied to roation and we have the roatin (-15 to 15 then get divide by 15 then take absolute value
  then we apply it as a translate onto the eyebrow and multiply by 3 and 5 for one eyebrow to have them slightly offset)**

  when we deal with transform the order of operations matter (translate.vs rotate and rotate.vs. translte)

  we save the percent so then we are ready for the next frame for audio calculations**

  we use transform because its compsoitioning and its better for the browser to handle**

  in part we create analyzer and use fft size of 32 beause we are not visualizing whole frequency and the resulting data arry then has 
  16 elements in it**

  panner things are still the same as file 5 and measure audio is called with request animation frame 

  we take the data at postiion 8 at divide it by 255 to make it since (we chose smaple 8 because it looked the most interesting when it played)**




*/