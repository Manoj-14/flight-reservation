function popupDisplay(className) {
  var popup = document.querySelector(`.${className}`);
  popup.style.transform = "scale(1)";
}

function popupClose(className) {
  var popup = document.querySelector(`.${className}`);
  popup.style.transform = "scale(0)";
}

function incrementor(className) {
  var counter = document.querySelector(`.${className}`).value;
  var count = parseInt(counter);
  count++;
  counter = count;
  console.log(count);
}

function swipeLeft(preClassName, nextClassName) {
  var swipeCur = document.querySelector(`.${preClassName}`);
  swipeCur.style.transform = "translateX(-200%)";
  swipeCur.style.display = "none";
  var swipeNext = document.querySelector(`.${nextClassName}`);
  swipeNext.style.transform = "translateX(0)";
  swipeNext.style.display = "block";
}

function swipeRight(preClassName, nextClassName) {
  var swipeCur = document.querySelector(`.${preClassName}`);
  swipeCur.style.transform = "translateX(0)";
  swipeCur.style.display = "block";
  var swipeNext = document.querySelector(`.${nextClassName}`);
  swipeNext.style.transform = "translateX(200%)";
  swipeNext.style.display = "none";
}

function createInps(parentCls, inpCls) {
  var numOfInps = document.querySelector(`.${inpCls}`).value;
  numOfInps = parseInt(numOfInps);
  for (let i = 0; i < numOfInps; i++) {
    var inpParent = document.createElement("div");
    inpParent.classList.add("group");
    var inp = document.createElement("input");
    inp.setAttribute("type", "text");
    inp.setAttribute("placeholder", "none");
    inp.setAttribute("required", "");
    inp.setAttribute("name", `name`);
    var span1 = document.createElement("span");
    span1.classList.add("highlight");
    var span2 = document.createElement("span");
    span2.classList.add("bar");
    var label = document.createElement("label");
    label.innerHTML = `Name ${i + 1}`;
    inpParent.appendChild(inp);
    inpParent.appendChild(span1);
    inpParent.appendChild(span2);
    inpParent.appendChild(label);
    inp.setAttribute("type", "text");
    inp.setAttribute("placeholder", "Enter your " + inpCls);
    document.querySelector(`.${parentCls}`).appendChild(inpParent);
  }
  var inpParent1 = document.createElement("div");
  inpParent1.classList.add("group");

  var inp2 = document.createElement("input");

  inp2.setAttribute("onclick", "swipeLeft('second-inps','third-inps');");
  inp2.setAttribute("type", "button");
  inp2.setAttribute("value", "Next");

  inpParent1.appendChild(inp2);
  document.querySelector(`.${parentCls}`).appendChild(inpParent1);
}

function getFlightDets(flightName, code, deptTime, arrTime) {
  // console.log(flightName, code, arrTime, deptTime);
  document.getElementById("flightName").value = flightName;
  document.getElementById("flightCode").value = code;
  document.getElementById("deptTime").value = deptTime;
  document.getElementById("arrTime").value = arrTime;
}
