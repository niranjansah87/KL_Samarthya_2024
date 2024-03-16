let gIsDrugging = false;

function onClick() {
  if (!gIsDrugging) {
    document.querySelector(".carousel").classList.add("off");
     document.querySelector("main").classList.add("off");
  } else {
    document.querySelector(".carousel").classList.remove("off");
     document.querySelector("main").classList.remove("off");
  }
  gIsDrugging = !gIsDrugging;
}

function onMouseMove(ev) {
  ev.preventDefault();
  if (!gIsDrugging) return;
  console.log("mouse move");
  const elCarousel = document.querySelector(".carousel");
  const { movementX } = ev;
  const nextPosition =
    +getValue("--rotatez").replace("deg", "") + movementX / 4 || 0;
  setValue("--rotatez", nextPosition + "deg");
}

function getValue(varName) {
  const elBox = document.querySelector(":root");
  var boxStyle = getComputedStyle(elBox);
  return boxStyle.getPropertyValue(varName);
}

function setValue(varName, value) {
  const elBox = document.querySelector(":root");
  elBox.style.setProperty(varName, value);
}