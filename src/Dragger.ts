import { Coordinates } from "./Part"

export class Dragger {
  // Display elements
  element: HTMLElement
  labelElement: HTMLParagraphElement;
  // more display elements for the face with the lower and upper part of face and
  //the brows
  lower: HTMLDivElement;
  upper: HTMLDivElement;
  lbrow: HTMLDivElement;
  rbrow: HTMLDivElement;

  coordinates: Coordinates

  dragging: boolean = false
  offset: {x: number, y: number} = {x: 0, y: 0}

  //position callback is registered on onnewcoorindates from the callback so thats how it gets 
  //used in the onnewcoordinates in parts
  //2 variables that reference the same method (technically 3 methods because 
  //we can talk to a,b,and position callback)
  positionCallback: ((x: Coordinates) => void) | null = null

  constructor(element: HTMLElement, coordinates: Coordinates) {
    this.element = element
    this.labelElement = document.createElement('p')

    // add a whole bunch of HTML nodes to make the character
    // see here and in styles.css
    //makes a div for the top and bottom of face and as well as the label appends it to the 
    //element and appends the eyes and brows to the top div
    this.lower = document.createElement('div')
    this.lower.className = 'lower'
    this.upper = document.createElement('div')
    this.upper.className = 'upper'
    this.element.appendChild(this.labelElement)
    this.element.appendChild(this.lower)
    this.element.appendChild(this.upper)
    const eyes = document.createElement('div')
    eyes.className = 'eyes'
    this.lbrow = document.createElement('div')
    this.lbrow.className = 'lbrow'
    this.rbrow = document.createElement('div')
    this.rbrow.className = 'rbrow'
    this.upper.appendChild(eyes)
    this.upper.appendChild(this.lbrow)
    this.upper.appendChild(this.rbrow)

    this.coordinates = coordinates;
    this.applyCoordinates(coordinates.x, coordinates.y)

    element.addEventListener('mousedown', (event) => {
      this.dragging = true
      this.offset.x = event.offsetX
      this.offset.y = event.offsetY
    })

    window.addEventListener('mousemove', (event) => {
      if(this.dragging){
        this.applyCoordinates(event.clientX - this.offset.x, event.clientY - this.offset.y)
      }
    })

    element.addEventListener('mouseup', (event) => {
      this.applyCoordinates(event.clientX - this.offset.x, event.clientY - this.offset.y)
      this.dragging = false
    })
  }

  updateLabel(label: string) {
    this.labelElement.innerText = label
  }

  // ordinarily I don't condone scattering class fields throughout the file
  // but these are only used in sing(), so ... meh (why do we declare varibales without the this.)
  //these are class fields so they dont need this. infront of them because its defined in the class because if
  //we defined it in a method it would need the this. but if we are outside we dont need it 
  rotation = 0
  lastPercent = 0
  sing(percent: number) : void {
    if (Math.abs(percent - this.lastPercent) > 0.05) {
      // when the percent changes by a lot in one frame, pick a random rotation
      //if the frequency is high we change (difference in frequency)
      this.rotation = Math.random()*30 - 15;
    }
    
    if (this.lastPercent === 0 && percent > 0) {
      // when starting to sing from zero, pick a random rotation 
      //we used to be quiet now we are making noise
      this.rotation = Math.random()*30 - 15;
    }
    if (percent === 0) {
      // if it's silent, set the rotation to 0
      this.rotation = 0
    }
    // change the eyebrow position when the rotation changes
    const brow = Math.abs(this.rotation/15) //the brow moves up or down based on far rotated things are 
    //if not roated its low otherwise if it is then its high then it gets higher 
    this.lbrow.style.translate = `0 ${brow*5}px`
    this.rbrow.style.translate = `0 ${brow*3}px`

    // rotate and translate the singer's head
    this.upper.style.transform = `rotate(${this.rotation}deg) translateY(${-15 - percent*20}px)`;
  
    // keep track of the last value for next frame
    // previous percent is the current percent 
    // we get a new percent value from the analyser node so the next frame part recalculates spectrum and sends it 
    //to dragger sing and dragger sing reacts to it (per frame we have a new percent compared to last percent)
    this.lastPercent = percent
  }

  registerUpdate(callback: (x: Coordinates) => void): void {
    this.positionCallback = callback
    this.positionCallback(this.coordinates)
  }

  applyCoordinates(x: number, y: number): void {
    this.coordinates.x = x;
    this.coordinates.y = y;
    this.element.style.left = `${x}px`
    this.element.style.top = `${y}px`

    if (this.positionCallback) {
      this.positionCallback(this.coordinates)
    }
  }
}