function popupDisplay(className) {
  var popup = document.querySelector(`.${className}`);
  popup.style.transform = "scale(1)";
}

function popupClose(className) {
  var popup = document.querySelector(`.${className}`);
  popup.style.transform = "scale(0)";
}
