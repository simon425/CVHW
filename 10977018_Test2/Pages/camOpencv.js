
const video = document.querySelector('#webcam');
const enableWebcamButton = document.querySelector('#enableWebcamButton');
const disableWebcamButton = document.querySelector('#disableWebcamButton');

const INPUT = document.querySelector('#INPUT');
const canvas = document.querySelector('#outputCanvas');
const canvas2 = document.querySelector('#outputCanvas2');
const canvas3 = document.querySelector('#outputCanvas3');

var userInput1 = document.getElementById('inputINT1').value;
var userInput2 = document.getElementById('inputINT2').value;
var TH1 = parseInt(userInput1);
var TH2 = parseInt(userInput2);
function onOpenCvReady() {
  document.querySelector('#status').innerHTML = 'opencv.js is ready.';
  /* enable the button */
  enableWebcamButton.disabled = false;
  
}

/* Check if webcam access is supported. */
function getUserMediaSupported() {
  /* Check if both methods exists.*/
  return !!(navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia);
    
    /* alternative approach 
    return ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices);
    */
}
  
  /* 
   * If webcam is supported, add event listener to button for when user
   * wants to activate it to call enableCam function which we will 
   * define in the next step.
   */

if (getUserMediaSupported()) {
  enableWebcamButton.addEventListener('click', enableCam);
  INPUT.addEventListener('click', getUserInput);
  disableWebcamButton.addEventListener('click', disableCam);
} else {
  console.warn('getUserMedia() is not supported by your browser');
}

function getUserInput() {
  userInput1 = document.getElementById('inputINT1').value;
  userInput2 = document.getElementById('inputINT2').value;
  TH1 = parseInt(userInput1);
  TH2 = parseInt(userInput2);
}


function enableCam(event) {
  /* disable this button once clicked.*/
  event.target.disabled = true;
    
  /* show the disable webcam button once clicked.*/
  disableWebcamButton.disabled = false;

  /* show the video and canvas elements */
  document.querySelector("#liveView").style.display = "block";

  // getUsermedia parameters to force video but not audio.
  const constraints = {
    video: true
  };

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
    video.srcObject = stream;
    video.addEventListener('loadeddata', processVid);
	video.addEventListener('loadeddata', processVid2);
    video.addEventListener('loadeddata', processVid1); //!!!
  })
  .catch(function(err){
    console.error('Error accessing media devices.', error);
  });
};

function disableCam(event) {
    event.target.disabled = true;
    enableWebcamButton.disabled = false;

    /* stop streaming */
    video.srcObject.getTracks().forEach(track => {
      track.stop();
    })
  
    /* clean up. some of these statements should be placed in processVid() */
    video.srcObject = null;
    video.removeEventListener('loadeddata', processVid);
	video.removeEventListener('loadeddata', processVid2);
	video.removeEventListener('loadeddata', processVid1);
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    document.querySelector("#liveView").style.display = "none";
}


function processVid() {

    if (video.srcObject == null) {
      return;
    }

    let cap = new cv.VideoCapture(video);
    /* 8UC4 means 8-bit unsigned int, 4 channels */
    let frame = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    cap.read(frame);
    processFrame(frame);
}

function processFrame(src) {
    let dst = new cv.Mat();
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    cv.Canny(src, dst, 100, 200);
    cv.imshow('outputCanvas', dst);
    src.delete();
    dst.delete();

    /* Call this function again to keep processing when the browser is ready. */
    window.requestAnimationFrame(processVid);
}

function processVid2() {

    if (video.srcObject == null) {
      return;
    }

    let cap = new cv.VideoCapture(video);
    /* 8UC4 means 8-bit unsigned int, 4 channels */
    let frame = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    cap.read(frame);
    processFrame2(frame,TH1,TH2);
}

function processFrame2(src,TH1,TH2) {
    let dst = new cv.Mat();
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    cv.Canny(src, dst, TH1, TH2);
    cv.imshow('outputCanvas2', dst);
    src.delete();
    dst.delete();

    /* Call this function again to keep processing when the browser is ready. */
    window.requestAnimationFrame(processVid2);
}



function processVid1() {

    if (video.srcObject == null) {
      return;
    }

    let cap = new cv.VideoCapture(video);
    /* 8UC4 means 8-bit unsigned int, 4 channels */
    let frame = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    cap.read(frame);
    processFrame1(frame);
}

function processFrame1(src) {
    let dst = new cv.Mat();
	let img1 = new cv.Mat();
	let img2 = new cv.Mat();
	let img3 = new cv.Mat();
    let ksize = new cv.Size(9,9);
    // You can try more different parameters
    

	
    cv.cvtColor(src, img1, cv.COLOR_RGBA2GRAY);
	cv.bitwise_not(img1, img2 );
	cv.GaussianBlur( img2, img3, ksize, 0, 0, cv.BORDER_DEFAULT);
	cv.bitwise_not( img3, img2 );
	cv.divide(img1,img2, dst,254,-1)
	
	//cv.GaussianBlur(img2,dst,5)
	/*
	
	*/
    
    cv.imshow('outputCanvas3', dst);
    src.delete();
    dst.delete();

    /* Call this function again to keep processing when the browser is ready. */
    window.requestAnimationFrame(processVid1);
}