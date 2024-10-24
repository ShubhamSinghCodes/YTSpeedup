document.addEventListener('DOMContentLoaded', function() {
  const speedButtons = document.querySelectorAll('.speedButton');
  
  speedButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      const rate = button.getAttribute('data-rate');
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "speedUpVideo", rate: rate});
      });
    });
  });
});