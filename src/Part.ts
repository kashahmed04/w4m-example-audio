export class Part {
  audioContext: AudioContext;
  audioElement: HTMLAudioElement;
  sourceNode: MediaElementAudioSourceNode;

  gainNode: GainNode; // individual part volume control!
  //this has the volume for each instance of the audio**

  markup: HTMLDivElement;
  vocalRange: string;

  constructor(vocalRange: string, audioElementId: string, audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.audioElement = document.querySelector(audioElementId) as HTMLAudioElement;

    this.sourceNode = audioContext.createMediaElementSource(this.audioElement)

    // set up the local GainNode
    //const gainNode = audioContext.createGain() (like audio 1 so let us actually
    //change the volume of the audio)**
    this.gainNode = audioContext.createGain()
    this.gainNode.gain.value = 1 //why do we make it one for the value to start at**
    //and also in our index.html the max is 0.5 so how can it go to one and still not reach
    //the end of the volume bar**

    this.vocalRange = vocalRange;
    this.markup = document.createElement('div');

    this.expandMarkup();
  }

  expandMarkup(): void {
    this.markup.className = 'control part'; //whats the difference between control part
    //and control from audio 3 being control and audio 4 being control part and audio
    //1 and 2 also being control part but only in the HTML**

    const h2 = document.createElement('h2')
    h2.innerText = this.vocalRange;

    // add some more HTML to control it
    const div = document.createElement('div')
    const label = document.createElement('label')
    label.innerText = 'Volume'
    div.appendChild(label)
    //add the volume label

    const input = document.createElement('input')
    input.type = 'range' //range lets is become a slider right**
    //why could we not put this in the audio element itself (do we usually have to make
    //an input for volume sliders then)**
    //what creates the slider for the audios to go back and fourth then individually**
    input.min = '0'
    input.max = '4'
    input.step = '0.01'
    input.value = '1'
    div.appendChild(input)
    //append the input to the div

    // with a dedicated 'input' listener
    input.addEventListener('input', () => {
      this.gainNode.gain.value = parseFloat(input.value);
      //get the volume from the specific slider 
    })

    this.markup.appendChild(h2)
    this.markup.appendChild(div)
    //append the name of the audio to the h2
    //and append the div with all the information we just created into the markup
    //div**
  }

  patch(): AudioNode { //why does it take in audio node now**
    // and connect it as part of the patch chain!
    return this.sourceNode.connect(this.gainNode);
    //part.patch().connect(gainNode).connect(audioContext.destination)
    //what is the difference between this statement in the main JS and the class**
  }
  
  play(): void {
    this.audioElement.play()
  }
  
  pause(): void {
    this.audioElement.pause()
  }

  timeTo(timeInSeconds: number): void {
    this.audioElement.currentTime = timeInSeconds;
  }
}
