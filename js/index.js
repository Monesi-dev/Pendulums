/*
 *  Aggiungi Check RK4
 * 
 * 
 */



var previousPendulumsNumber = 15;
// This is useful to determine when to download the csv files 
// When the simulation has lasted for at least 20s the files will be downloaded
var simulationStartTime     // This will be set when the simulation starts
const maxTime = 60000;      // Milliseconds
var downloaded = false;     // This ensures that the files are only downloaded once

// Utility Function
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
};

function getRandomAngle() {
  return 2 * Math.PI * getRandomNumber(0.135, 0.65);
};

function getDataFromForm() {

  // Gets the type of Pendulum that will be simulated (1 => Single) (2 => Double)
  const typeOfPendulum = document.getElementById("subject").value;
  const degree2radian = Math.PI / 180;
  let pendulumData;

  // 1 => Single Pendulum
  if (typeOfPendulum == 1) {
    pendulumData = {
      count: Number(document.getElementById("myRange1").value),                  // Number of Pendulums Rendered
      dt: 0.001 * Number(document.getElementById("myRange8").value),             // Time Step
      mass1: 10 * Number(document.getElementById("myRange2").value),             // Value of the First Mass
      length1: Number(document.getElementById("myRange3").value),                // Length of the First Rod
      angle1: degree2radian * Number(document.getElementById("myRange6").value), // Angle of the First Rod
      trajectory: document.getElementById("switch").checked                      // Shows the Trajectory of the Second Mass         
    };
  }

  // 2 => Double Pendulum
  else if (typeOfPendulum == 2) {

    pendulumData = {
      count: Number(document.getElementById("myRange1").value),                  // Number of Pendulums Rendered
      dt: 0.001  *Number(document.getElementById("myRange8").value),             // Time step
      mass1: 10 * Number(document.getElementById("myRange2").value),             // Value of the First Mass
      length1: Number(document.getElementById("myRange3").value),                // Length of the First Rod
      mass2: 10 * Number(document.getElementById("myRange4").value),             // Value of the Second Mass
      length2: Number(document.getElementById("myRange5").value),                // Length of the Second Rod
      angle1: degree2radian * Number(document.getElementById("myRange6").value), // Angle of the First Rod
      angle2: degree2radian * Number(document.getElementById("myRange7").value), // Angle of the Second Rod
      trajectory: document.getElementById("switch").checked,                     // Shows the Trajectory of the Second Mass         
      numericalApprox: "RK" + document.getElementById("myRange9").value          // Determines the Type of Numerical Integration Used               
    };
  }

  // Starts Pendulum Simulation
  start(typeOfPendulum, pendulumData);
}

// Starts the Simulation
function start(typeOfPendulum, pendulumData) {

  /*
   *  typeOfPendulum specifies which type of pendulum you want to simulate
   *  1 => Single Pendulum     2 => Double Pendulum
   *
   *  pendulumData is an object containing the information required to simulate the pendulum
   *  SinglePendulum => { count, dt, mass1, length1 }
   *  DoublePendulum => { count, dt, mass1, length1, mass2, length2, angle1, angle2, trajectory, numericalApprox }
   */

  // Removing Form and Creating Canvas
  document.getElementById("main").removeChild(document.getElementById("form"));
  const canvas = document.createElement('canvas');
  canvas.id = "canvas";
  document.getElementById('main').append(canvas)
  // document.body.appendChild(canvas);

  // Setting the width and height of the canvas, so that it fills the screen
  const canvasW = document.body.clientWidth;
  const canvasH = 2 * document.body.clientHeight;
  canvas.width = canvasW;
  canvas.height = canvasH;

  // Transforming the canvas, so that the y axis goes from bottom to top and centering the origin
  const ctx = canvas.getContext('2d');
  ctx.transform(1, 0, 0, -1, canvasW / 2, canvasH / 2);

  // Setting the number of pendulums and randomly choosing an initial condition
  const pendulums = [];                                   // Array that contains the Pendulums
  const pendulumsCount = pendulumData.count;              // Number of Pendulums Spawned
  const framesPerSecond = 120;                            // Framerate
  const mass1 = pendulumData.mass1;                       // Value of the First Mass
  const length1 = pendulumData.length1;                   // Length of the First Rod
  const mass2 = pendulumData.mass2;                       // Value of the Second Mass
  const length2 = pendulumData.length2;                   // Length of the Second Rod
  const angle1 = pendulumData.angle1;                     // Angle of the First Rod (Y-axis)
  const angle2 = pendulumData.angle2;                     // Angle of the Second Rod (Y-axis)
  const drawTrajectory = pendulumData.trajectory;         // Draws Trajectory
  const numericalApprox = pendulumData.numericalApprox;   // Determines the Type of Numerical Integration
  const gravity = 10;                                     // Value of Gravity
  const dt = pendulumData.dt;                             // Time Step

  /*
   * With dt = 0.04 is faster but it is not very accurate, energy is not "constant"
   * With dt = 0.004 is way slower but the energy is more "constant" even for greater initial angles
   */

  // Creating Canvas to Plot Data
  const plot = document.createElement('canvas');
  plot.id = "plot";
  // document.body.appendChild(plot);

  // Setting the width and height of the Plot
  const plotW = canvasW; //document.body.clientWidth;
  const plotH = canvasH; //document.body.clientHeight;
  plot.width = plotW;
  plot.height = plotH;
  const ctxPlot = plot.getContext('2d');
  ctxPlot.transform(1, 0, 0, 1, 0, plotH / 2);

  // Creating Double Pendulums with Slight Variations
  for (let i = 0; i < pendulumsCount; i++) {

    // Creating a Double Pendulum
    if (typeOfPendulum == 2) {

      const doublePendulum = new DoublePendulum({

        // Fixed Initial Conditions
        mass1: mass1,
        length1: length1,
        angle1: angle1,
        mass2: mass2,
        length2: length2,
        angle2: angle2,
        gravity: gravity,
        dt: dt,
        ctx: ctx,
        ctxPlot: ctxPlot,
        color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16),
        trajectory: drawTrajectory,
        numericalApprox: numericalApprox,
        isFirst: i == 0,                    // It's true if this is the first pendulum to be spawned

        // Tiny changes of the beginning angle of the second pendulum to stimulate CHAOS!
        angle2: angle2 + i * 0.002,


      });

      // Adding Pendulum
      pendulums.push(doublePendulum);
    }

    // Creatiing a Single Pendulum
    else if (typeOfPendulum == 1) {

      const pendulum = new SinglePendulum({

        // Fixed Initial Conditions
        fixedPointX: 0,
        fixedPointY: 0,
        length: length1,
        mass: 1,
        angle: angle1 + i * 0.001,
        gravity: gravity,
        dt: dt,
        ctx: ctx,
        ctxPlot: ctxPlot,
        trajectory: drawTrajectory,
        isFirst: i == 0,                    // It's true if this is the first pendulum to be spawned
        color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16)

      })

      // Adding Pendulum
      pendulums.push(pendulum);
    }
  }

  // Function Used for the Animation
  function step(timestamp) {

    // This is used to keep track of the time elapsed since the function was invoked
    let start = Date.now();

    // Updates the counter of iterations and when this counter has reached a set 
    // amount then the download of the csv files will begin automatically
    if (downloaded == false && start - simulationStartTime > maxTime) {
      pendulums[0].downloadCsvFiles()
      downloaded = true
    }
    
    // Clearing Canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(-canvas.width / 2, canvas.height / 2, canvas.width, -canvas.height);
    let loopEnded = false;

    // Calculating the coordinates and drawing the double pendulums
    pendulums.forEach(pendulum => {
      pendulum.calculate();
      let res = pendulum.draw();
      if (res == 1) loopEnded = true;
    })
    // pendulums[0].plot();
    
    // The next animation will begin when a sufficient amount of time has elapsed
    while (Date.now() - start < dt);

    // If the final trajectory has been drawn the animation has to stop
    if (!loopEnded) {
      requestAnimationFrame(step);
    }

    // If the animation has stopped but the csv files have not been downloaded then
    // the download will begin automatically
    else if (!downloaded) {
      pendulums[0].downloadCsvFiles()
    }
  }
  
  simulationStartTime = Date.now()  
  window.requestAnimationFrame(step);

}


var state = 0;
function formModifyer() {

  const pendulum = document.getElementById('subject').value;
  const form = document.getElementById('form');

  if (state == 0) {

    addToggle();                                                            // Adds Checkboxs
    addSlider("Time Step(ms):  ", '8', '10', "300", "40");                  // Adds Slider for Time Step
    addSlider("Number of pendulums:  ", '1', '1', "20", "15");              // Adds Slider to select the Number of Pendulums
    addSlider("Mass 1 (kg): ", "2", "1", "30", "20");                       // Adds Slider to select the Value of the First Mass
    addSlider("Length 1 (cm): ", "3", "40", "120", "100");                  // Adds Slider to select the Length of the First Rod
    addSlider("Initial angle 1 (degrees): ", "6", "-180", "180", "-60");    // Adds Slider to select the Value of the First Angle
    state = pendulum;

    if (pendulum == 2) {

      addSlider("Mass 2 (kg): ", "4", "1", "30", "20");                     // Adds Slider to select the Value of the Second Mass
      addSlider("Length 2 (cm): ", "5", "40", "120", "100");                // Adds Slider to select the Length of the Second Rod
      addSlider("Initial angle 2 (degrees): ", "7", "-180", "180", "-60");  // Adds Slider to select the Value of the Second Angle
      addSlider("RK: ", "9", "1", "4", "1");                                // Adds Slider to select the Method for Numerical Approximation

    }

    addButton();
  }
  else if (state == 1) {

    removeButton();
    addSlider("Mass 2 (kg):", "4", "1", "30", "20");                      // Adds Slider to select the Value of the Second Mass
    addSlider("Length 2 (cm): ", "5", "40", "120", "100");                // Adds Slider to select the Length of the Second Rod
    addSlider("Initial angle 2 (degrees): ", "7", "-180", "180", "-60");  // Adds Slider to select the Value of the Second Angle
    addSlider("RK: ", "9", "1", "4", "1");                                // Adds Slider to select the Method for Numerical Approximation
    addButton();
    state = pendulum;

  }
  else {

    removeSlider("4");            // Removes Slider to select the Value of the Second Mass
    removeSlider("5");            // Removes Slider to select the Length of the Second Rod
    removeSlider("7");            // Removes Slider to select the Value od the Second Angle
    removeSlider("9");            // Removes Slider to select the Method for Numerical Approximation
    state = pendulum;

  }
}

// Display the default slider value

// Update the current slider value (each time you drag the slider handle)
function updateData(e) {
  string = e.currentTarget.string;
  var slider = document.getElementById("myRange" + string);
  var demo = document.getElementById("demo" + string);
  demo.innerHTML = slider.value;
}

function addButton() {
  var form = document.getElementById('form');
  var br1g = document.createElement("br");
  br1g.id = "br1g";
  var br2g = document.createElement("br");
  br2g.id = "br2g";
  var button = document.createElement("button");
  button.id = "button";
  var bold = document.createElement("b");
  bold.id = "bold";
  bold.innerHTML = "Submit";
  var center = document.createElement("center");
  center.id = "center";
  button.addEventListener('click', getDataFromForm);
  center.appendChild(button);
  button.appendChild(bold);
  form.appendChild(br1g);
  form.appendChild(br2g);
  form.appendChild(center);
}
function removeButton() {
  var form = document.getElementById('form');
  var br1g = document.getElementById("br1g");
  var br2g = document.getElementById("br2g");
  var center = document.getElementById("center");
  form.removeChild(br1g);
  form.removeChild(br2g);
  form.removeChild(center);
}

function addSlider(label, id, min, max, value) {
  var newlabel = document.createElement('label');
  newlabel.id = "label-" + id;
  newlabel.appendChild(document.createTextNode(label));
  newlabel.htmlFor = "number" + id;
  var input = document.createElement('input');
  input.type = 'range';
  input.id = 'myRange' + id;
  input.name = 'number' + id;
  input.min = min;
  input.max = max;
  input.value = value;
  input.classList.add('slider');
  var div1 = document.createElement('div');
  div1.id = "div1-" + id;
  div1.classList.add("slidecontainer");
  var div2 = document.createElement('b');
  div2.id = "demo" + id;
  newlabel.appendChild(div2);
  div1.appendChild(input);
  if (id != 1) {
    var br = document.createElement('br');
    br.id = "br-" + id;
    var br1 = document.createElement('br');
    br1.id = "br1-" + id;
    var br2 = document.createElement('br');
    br2.id = "br2-" + id;
    form.appendChild(br);
    form.appendChild(br1);
    form.appendChild(br2);
  }
  form.appendChild(newlabel);
  form.appendChild(div1);
  div2.innerHTML = input.value;
  input.string = id;
  input.addEventListener('input', updateData);
}
function removeSlider(id) {
  var form = document.getElementById('form');
  var br1 = document.getElementById("br1-" + id);
  var br = document.getElementById("br-" + id);
  var br2 = document.getElementById("br2-" + id);
  var label = document.getElementById("label-" + id);
  var div = document.getElementById("div1-" + id);
  form.removeChild(br);
  form.removeChild(br1);
  form.removeChild(br2);
  form.removeChild(label);
  form.removeChild(div);
}
function addToggle() {

  // Break Lines
  const br = document.createElement('br');
  br.id = "br-toggle";
  const br1 = document.createElement('br');
  br1.id = "br1-toggle";
  const br2 = document.createElement('br');
  br2.id = "br2-toggle";
  const br3 = document.createElement('br');
  br3.id = "br3-toggle";
  const br4 = document.createElement('br');
  br4.id = "br4-toggle";
  const br5 = document.createElement('br');
  br5.id = "br5-toggle";

  // Pendulum Trajectory CheckBox
  var newlabel = document.createElement('label');
  newlabel.id = "label-toggle";
  newlabel.appendChild(document.createTextNode("Trace pendulum's trajectory: "));
  newlabel.htmlFor = "checkbox";
  var input = document.createElement('input');
  input.type = 'checkbox';
  input.id = 'switch';
  input.classList.add('input');
  input.addEventListener('change', handleCheck);
  var anotherlabel = document.createElement('label');
  anotherlabel.classList.add('label');
  anotherlabel.htmlFor = "switch";

  // Append to Form
  form.appendChild(br);
  form.appendChild(br1);
  form.appendChild(br2);
  form.appendChild(newlabel);
  form.appendChild(input);
  form.appendChild(anotherlabel);
  form.appendChild(br3);
  form.appendChild(br4);
  form.appendChild(br5);
}

function enablePendulumsNumber() {
  var input = document.getElementById("myRange1");
  var div = document.getElementById("div1-1");
  var demo = document.getElementById("demo1");
  input.value = previousPendulumsNumber;
  demo.innerHTML = input.value;
  div.style.visibility = "visible";
}

function disablePendulumsNumber() {
  var input = document.getElementById("myRange1");
  var div = document.getElementById("div1-1");
  var demo = document.getElementById("demo1");
  previousPendulumsNumber = input.value;
  input.value = 1;
  demo.innerHTML = 1;
  div.style.visibility = "hidden";
}
function handleCheck(e) {
  if (e.currentTarget.checked)
    return disablePendulumsNumber();
  return enablePendulumsNumber();
}