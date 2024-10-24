let videoPlayer = null;
let adSkipButton = null;
let pulseCircle = null;

const addPulseStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    .pulse-circle {
      position: fixed;
	  text-align:center;
	  line-height:20px; 
      top: 50px;
      right: 50px;
      width: 20px;
      height: 20px;
	  background: red;
      border-radius: 50%;
      animation: pulse 1s ease-out;
      z-index: 3000; /* Ensure it's on top of other elements */
    }

    @keyframes pulse {
      0% {
        transform: scale(0.5);
        opacity: 0.7;
      }
      50% {
        transform: scale(1.5);
        opacity: 0.4;
      }
      100% {
        transform: scale(1);
        opacity: 0.1;
      }
    }
	
	.altpulse {
      position: fixed;
	  text-align:center;
	  line-height:20px; 
      top: 50px;
      right: 50px;
      width: 20px;
      height: 20px;
	  background: red;
      border-radius: 50%;
      animation: pulse2 1s ease-out;
      z-index: 3000; /* Ensure it's on top of other elements */
    }

    @keyframes pulse2 {
      0% {
        transform: scale(0.5);
        opacity: 0.7;
      }
      50% {
        transform: scale(1.5);
        opacity: 0.4;
      }
      100% {
        transform: scale(1);
        opacity: 0.1;
      }
    }
  `;
  document.head.appendChild(style);
};

const createPulseCircle = () => {
  pulseCircle = document.createElement('div');
  pulseCircle.className = 'pulse-circle';
  document.body.appendChild(pulseCircle);
};

const showPulseCircle = (color, txt) => {
  if (!pulseCircle) createPulseCircle();
  pulseCircle.style.backgroundColor = color;
  pulseCircle.innerText = txt;
  pulseCircle.classList.toggle('altpulse');
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "speedUpVideo") {
    let rate = parseFloat(request.rate);
    if (!isNaN(rate)) {
      document.getElementsByClassName("video-stream")[0].playbackRate = rate;
      skipAds();
    }
  }
});



const skipAds = () => {
  const videoContainer = document.getElementById("movie_player");
  if (!videoContainer) return; // Exit if video player not found
  const isAd = videoContainer.classList.contains("ad-interrupting") || videoContainer.classList.contains("ad-showing");
  if (isAd) {
    if (!videoPlayer) {
      videoPlayer = document.getElementsByClassName("video-stream")[0];
    }
	showPulseCircle("green", videoPlayer.playbackRate);
    if (videoPlayer.duration && isFinite(videoPlayer.duration)) {
      videoPlayer.currentTime = videoPlayer.duration - 0.1;
    }
	
	const adElements = document.getElementsByClassName("ytp-ad-button-vm ytp-ad-component--clickable ytp-ad-button-vm--style-filled ytp-ad-button-vm--size-default");
	for (let i = 0; i < adElements.length; i++) {
      adElements[i].click();
    }
	document.getElementById("ad-button:9")?.click();
    
	videoPlayer.paused && videoPlayer.play();
    //document.querySelector(".ytp-ad-skip-button")?.click();
    //document.querySelector(".ytp-ad-skip-button-modern")?.click();
    document.querySelector(".ytp-ad-skip-button")?.focus();
    document.querySelector(".ytp-ad-skip-button-modern")?.focus();
  } else {
	if (!videoPlayer) {
      videoPlayer = document.getElementsByClassName("video-stream")[0];
    }
	showPulseCircle("red", videoPlayer.playbackRate);
  }
};

addPulseStyles();
createPulseCircle();
setTimeout(() => {
  setInterval(skipAds, 1000);
}, 2000);