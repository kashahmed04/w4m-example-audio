export class Part {
  audioContext: AudioContext;
  audioElement: HTMLAudioElement;
  sourceNode: MediaElementAudioSourceNode;

  gainNode: GainNode; // individual part volume control!
  //this has the volume for each instance of the audio (yes)

  markup: HTMLDivElement;
  vocalRange: string;

  constructor(vocalRange: string, audioElementId: string, audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.audioElement = document.querySelector(audioElementId) as HTMLAudioElement;

    this.sourceNode = audioContext.createMediaElementSource(this.audioElement)

    // set up the local GainNode
    //const gainNode = audioContext.createGain() (like audio 1 so let us actually
    //change the volume of the audio)

    // // Create an AudioContext to hook up our flow.
    // const audioContext = new AudioContext() do we not have to setup new 
    //audio context since we made a new instance and it's like decalring a 
    //new audiocontext() already

    // // GainNode changes the volume
    // const gainNode = audioContext.createGain()

    this.gainNode = audioContext.createGain()
    this.gainNode.gain.value = 1 //we say each sources that its 100 percent scaled but in the HTML globally its 0.5
    //and by default we set it to the default for whatever the volume was when we downloaded the file (the JS updates it to
    //a more updated value)

    this.vocalRange = vocalRange;
    this.markup = document.createElement('div');

    this.expandMarkup();
  }

  expandMarkup(): void {
    this.markup.className = 'control part'; //for the css

    const h2 = document.createElement('h2')
    h2.innerText = this.vocalRange;

    // add some more HTML to control it
    const div = document.createElement('div')
    const label = document.createElement('label')
    label.innerText = 'Volume'
    div.appendChild(label)
    //add the volume label

    const input = document.createElement('input')
    input.type = 'range' //range lets it become a slider right (yes)
    //why could we not put this in the audio element itself (do we usually have to make
    //an input for volume sliders then)(we want to make individual copies for each slider so we make it here)
    input.min = '0'
    input.max = '4'
    input.step = '0.01'
    input.value = '1'
    div.appendChild(input)
    //append the input to the div

    // with a dedicated 'input' listener
    input.addEventListener('input', () => {
      this.gainNode.gain.value = parseFloat(input.value);
      //get the volume from the specific slider so we can move it around
      //and it can update (yes))

    })

    this.markup.appendChild(h2)
    this.markup.appendChild(div)
    //append the name of the audio to the markup div 
    //and append the div with all the information we just created (volume slider information) into the markup
    //div (yes)
  }

  patch(): AudioNode { //audio node is a more generic type and mediaaudiosourcenode is specific type and audionode is specific
    //type which is a parent class
    // and connect it as part of the patch chain!
    return this.sourceNode.connect(this.gainNode);
    //part.patch().connect(gainNode).connect(audioContext.destination)
    //the one in the class is the one that only effects the specific voice volume (a single voice)
    //the one in main.ts applies to all voice parts globally
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
