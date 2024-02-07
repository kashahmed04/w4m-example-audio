export class Part {
  audioContext: AudioContext;
  audioElement: HTMLAudioElement; // a reference to the <audio> element in index.html
  sourceNode: MediaElementAudioSourceNode; 

  markup: HTMLDivElement; // the parent HTML element, gets appended to section #parts in index.html
  //anything we want to display for this part goes in the markup div and every class instance will have its own version of the div
  //then it goes into the section for each individual div for the audios (slider, volume, etc.)** 
  vocalRange: string;

  //why cant we just say audioContext since we defined it above for constructor**
  constructor(vocalRange: string, audioElementId: string, audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.audioElement = document.querySelector(audioElementId) as HTMLAudioElement; //targets the audio file 

    // const tenorAudio = document.querySelector('#tenor-audio') as HTMLAudioElement;
    // const leadAudio = document.querySelector('#lead-audio') as HTMLAudioElement;
    // const baritoneAudio = document.querySelector('#baritone-audio') as HTMLAudioElement;
    // const bassAudio = document.querySelector('#bass-audio') as HTMLAudioElement;

    this.sourceNode = audioContext.createMediaElementSource(this.audioElement) //lets us play the audio in the browser for each audio**

    // const tenorSource = audioContext.createMediaElementSource(tenorAudio)
    // const leadSource = audioContext.createMediaElementSource(leadAudio)
    // const baritoneSource = audioContext.createMediaElementSource(baritoneAudio)
    // const bassSource = audioContext.createMediaElementSource(bassAudio)

    this.vocalRange = vocalRange;
    this.markup = document.createElement('div'); //creates a div for each audio instance**

    this.expandMarkup(); //when we create a new instance of a part it goes to the constructor then it goes to this method because we 
    //have to call things from the constructor so each instance knows what to do and it does not go from top to bottom for the whole class**
  }

  // creates and appends all children of the Part
  expandMarkup(): void {
    this.markup.className = 'control'; //does it matter if its control or control audio because in
    //audio 2 is was named control audio for each div for the audios**
    //why does each audio have a div**
    //is it each audio slider and the name in one div**
    //could we have also used the ID attached to each audio to move things around as a group or is there a reason for the div**

    // <section class="controls">
    //   <div class="control audio"><label>Tenor</label><audio controls id="tenor-audio" src="./mp3/heart_of_my_heart/tenor.mp3"></audio></div>
    //   <div class="control audio"><label>Lead</label><audio controls id="lead-audio" src="./mp3/heart_of_my_heart/lead.mp3"></audio></div>
    //   <div class="control audio"><label>Baritone</label><audio controls id="baritone-audio" src="./mp3/heart_of_my_heart/baritone.mp3"></audio></div>
    //   <div class="control audio"><label>Bass</label><audio controls id="bass-audio" src="./mp3/heart_of_my_heart/bass.mp3"></audio></div>
    // </section>
    

    const h2 = document.createElement('h2')
    h2.innerText = this.vocalRange;

    this.markup.appendChild(h2) //this is where we see the title show up for the specfic audio**
  }

  // will be used by main.ts to route this Part's output to the audioContext.destination
  // (first, passing it through any global effect nodes)
  patch(): MediaElementAudioSourceNode {
    return this.sourceNode; //returns the source node which is the audio element we want to use 
    //and we define this in the constructor its like how it was in audio 2 shown below**
   

    // const tenorSource = audioContext.createMediaElementSource(tenorAudio)
    // const leadSource = audioContext.createMediaElementSource(leadAudio)
    // const baritoneSource = audioContext.createMediaElementSource(baritoneAudio)
    // const bassSource = audioContext.createMediaElementSource(bassAudio)


    // tenorSource.connect(gainNode).connect(audioContext.destination)
    // leadSource.connect(gainNode).connect(audioContext.destination)
    // baritoneSource.connect(gainNode).connect(audioContext.destination)
    // bassSource.connect(gainNode).connect(audioContext.destination)

    //so when we return this.sourcenode does it just attach it to the line of commands in main.ts**
  }
  
  play(): void {
    this.audioElement.play() //why dont we use source node here because isnt that what makes the audio**

    //just like what we did in audio 2 but we made variables and called the play on them instead
    //but here we can just say for each instance play the audio in the JS then call the audio element
    //to play within the class we made in the constructor**

    //const tenorAudio = document.querySelector('#tenor-audio') as HTMLAudioElement;
    // const leadAudio = document.querySelector('#lead-audio') as HTMLAudioElement;
    // const baritoneAudio = document.querySelector('#baritone-audio') as HTMLAudioElement;
    // const bassAudio = document.querySelector('#bass-audio') as HTMLAudioElement;

    // const play = () => {
    //   tenorAudio.play();
    //   leadAudio.play();
    //   baritoneAudio.play();
    //   bassAudio.play();
    //   playButton.dataset.playing = 'true';
    //   playButton.innerText = 'Pause'
    // }
  }
  
  pause(): void {
    this.audioElement.pause()

    // const pause = () => {
    //   tenorAudio.pause();
    //   leadAudio.pause();
    //   baritoneAudio.pause();
    //   bassAudio.pause();
    //   playButton.dataset.playing = 'false';
    //   playButton.innerText = 'Play';
    // }
  }

  // skips to a particular playback position (in seconds)
  timeTo(timeInSeconds: number): void {
    this.audioElement.currentTime = timeInSeconds; //why not use source node here**

    //for the audio element set the current time to the time we pass in from the main JS
    //and this is for each slider move according to the main slider for the audio playing**
    //we dont have our sliders setup yet so what makes it show up on the brwoser**

    // mainSeekSlider.addEventListener('input', () => {
    //   const targetTime = parseFloat(mainSeekSlider.value);
    //   tenorAudio.currentTime = targetTime
    //   leadAudio.currentTime = targetTime
    //   baritoneAudio.currentTime = targetTime
    //   bassAudio.currentTime = targetTime
    // })
  }
}
