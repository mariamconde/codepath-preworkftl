// global constants
//const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
var clueHoldTime = 1000;
//Global Variables
//var pattern = [2, 2, 4, 3, 2, 1, 2, 4, 3, 5, 2, 6];
var pattern = []; //Random pattern optional feature
var clueLength = 10;
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0;
var lostStrikes = 0;
var restart = false;


function startGame(){ 
progress = 0;
pattern = []; // reset so array doesn't get longer then 5 if we restart game
for (var i =0; i < clueLength; i ++) {
  pattern.push(getRandomInt(6));
} 
console.log('pattern: ' + pattern);
  
progress = 0;
gamePlaying = true;
document.getElementById("startBtn").classList.add("hidden");
document.getElementById("stopBtn").classList.remove("hidden");

playClueSequence();
}

function stopGame(){
gamePlaying = false;
document.getElementById("startBtn").classList.remove("hidden");
document.getElementById("stopBtn").classList.add("hidden");
restart = true;
}


function getRandomInt(max) {
 return Math.floor(Math.random() * Math.floor(max) + 1); // + 1 so we don't get 0
}

// Sound Synthesis Functions
const freqMap = {
  1: 220,
  2: 246.94,
  3: 261.63,
  4: 293.66,
  5: 329.63,
  6: 349.23

}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}
function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}
function playClueSequence(){
  
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
    context.resume()
  }
}

function loseGame(){
  stopGame();
  alert("Game Over. You Lost.");
}
function winGame(){
  stopGame();
  alert("Game Over. You Won!");
}
function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  // game logic 
 if(pattern[guessCounter] == btn){
    if(guessCounter == progress){
      if(progress == pattern.length-1){
        winGame();
        restart = true;
      }else{
        progress++;
        playClueSequence();
      }
    }else{
      guessCounter++;
    }
 }else{
  lostStrikes++;
    if (lostStrikes == 3) {
      loseGame();
      restart = true;
    } else {
      //Increment errors
      alert("Incorrect! Attempts Remaining: " + (3 - lostStrikes));
    }
  }
}