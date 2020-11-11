
let segmentCount = 8;
let radius =40;
let timeStep = 0;
let currentStep = 0 ;
let centerX, centerY,dist;
let steps = [];
let hlted = false;
let radToDeg;
let countToRad;
let piano = [];
let harpischord = [];
let instrument2 = [0,1,2,3,4,5,6,7];

let socket = io('/instrument1');

socket.on('connect',function(data){
  console.log("Connected");

  
});

function preload() {
  soundFormats('wav');
  for(let i = 0; i<8; i++){
    piano.push(loadSound('data/'+i));
    harpischord.push(loadSound('data/h'+i));
    
  }
 

}


function setup() {

  const myCanvas=createCanvas(1000,600);
  myCanvas.parent("canvas-container");
  noStroke();
  colorMode(HSB, 360,255,255);
  ellipseMode(RADIUS);
  radToDeg = 180.0 / PI;
  countToRad = TWO_PI / float(segmentCount)
 
  let x, y;
   
  centerX = width * 0.5;
  centerY = height * 0.5;
  dist = min(height, width) * 0.3 - radius;
  for(let i = 0; i<segmentCount;i++){
    

    let  angle = i * countToRad;
    x = centerX + cos(angle) * dist;
    y = centerY + sin(angle) * dist;
    

    steps.push(new StepBall(x,y,radius,i,hlted));
  }

  socket.on('data', function(obj) {
    console.log(obj);
    update(obj);
  });

  socket.on('other',function(obj){
    updateOther(obj);
  });



}

function draw() {

  background(360, 0, 0);
 
  
 
  
  for(let i = 0; i<segmentCount;i++){

  
    steps[i].display();
    
    
    //console.log(steps[i].state);
    if(currentStep==i){
      steps[i].hlted = true;
     }else{
       steps[i].hlted = false;
     }
  }

  let timeNow = millis();

  if (timeNow > timeStep) {
   
    timeStep= timeNow + 500;
    
    if(currentStep < segmentCount-1){
      currentStep++;
    }else{

      currentStep = 0;
    }

      piano[steps[currentStep].state].play();
      harpischord[instrument2[currentStep]].play();
  
    
  }
 
  
}

function update(upd){
  steps[upd.step].state = upd.change;
}


function updateOther(upd){

  instrument2[upd.step] = upd.change;
}

function mouseClicked(){
  
  for(let i = 0; i<segmentCount;i++){
   
    let d = distance(mouseX,mouseY,steps[i].x,steps[i].y);
    if(d<radius){
      if(steps[i].state<7){
        steps[i].state ++ ;

      }else{
        steps[i].state = 0;
      }

     let stepChanged = {step: i, change: steps[i].state};
      socket.emit('data',stepChanged);
    }

  }
  
}
function distance(x1,y1,x2,y2){

  let a = x1 - x2;
  let b = y1 - y2;

  let c = Math.sqrt( a*a + b*b );
  return c;
}

class  StepBall {
  constructor(_x,_y,_r,_s,_h) {
    this.x = _x;
    this.y = _y;
    this.diameter = _r;
    this.state = _s;
    this.hlted = _h;
  }


  display() {
    let  angle = this.state * countToRad;
    let hue = angle * radToDeg;
    if(this.hlted){
      fill(hue,255,255);
    }else{
      fill(hue,255,100);  

    }
    
    ellipse(this.x, this.y, this.diameter, this.diameter);
  
   
  }
  

  
}

