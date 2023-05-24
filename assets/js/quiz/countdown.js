var defaults = {}
  , one_second = 1000
  , one_minute = one_second * 60
  , one_hour = one_minute * 60
  , countdownSeconds = 5  // Specify the countdown duration in seconds
  , startDate = new Date()
  , face = document.getElementById('lazy');

var requestAnimationFrame = (function() {
  return window.requestAnimationFrame       || 
         window.webkitRequestAnimationFrame || 
         window.mozRequestAnimationFrame    || 
         window.oRequestAnimationFrame      || 
         window.msRequestAnimationFrame     || 
         function(callback) {
           window.setTimeout(callback, 1000 / 60);
         };
}());

tick();

function tick() {
  var now = new Date()
    , elapsed = countdownSeconds * 1000 - (now - startDate)  // Calculate the remaining time in milliseconds
    , parts = [];

  if (elapsed < 0) {
    face.innerText = '00:00:00';  // Timer has reached zero
    return;
  }

  parts[0] = '' + Math.floor(elapsed / one_hour);
  parts[1] = '' + Math.floor((elapsed % one_hour) / one_minute);
  parts[2] = '' + Math.floor(((elapsed % one_hour) % one_minute) / one_second);

  parts[0] = (parts[0].length == 1) ? '0' + parts[0] : parts[0];
  parts[1] = (parts[1].length == 1) ? '0' + parts[1] : parts[1];
  parts[2] = (parts[2].length == 1) ? '0' + parts[2] : parts[2];

  face.innerText = parts.join(':');

  requestAnimationFrame(tick);
}
