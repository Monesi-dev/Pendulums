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
    let pendulumData;

    // 1 => Single Pendulum
    if (typeOfPendulum == 1) {
        pendulumData = {
            count: Number(document.getElementById("myRange1").value),            // Number of Pendulums Rendered
            mass1: 10 * Number(document.getElementById("myRange2").value),      // Value of the First Mass
            length1: Number(document.getElementById("myRanged3").value)          // Length of the First Rod
        };   
    }

    // 2 => Double Pendulum
    else if (typeOfPendulum == 2) {
        pendulumData = {
            count: Number(document.getElementById("myRange1").value),             // Number of Pendulums Rendered
            mass1: 10 * Number(document.getElementById("myRange2").value),       // Value of the First Mass
            length1: Number(document.getElementById("myRange3").value),          // Length of the First Rod
            mass2: 10 * Number(document.getElementById("myRange4").value),       // Value of the Second Mass
            length2: Number(document.getElementById("myRange5").value)           // Length of the Second Rod
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
     *  SinglePendulum => { count, mass1, length1 }
     *  DoublePendulum => { count, mass1, length1, mass2, length2 }
     */  

    // Removing Form and Creating Canvas
    document.getElementById("main").removeChild(document.getElementById("form"));
    const canvas = document.createElement('canvas');
    canvas.id = "canvas";
    document.body.appendChild(canvas);

    // Setting the width and height of the canvas, so that it fills the screen
    const canvasW = document.body.clientWidth;
    const canvasH = 2 * document.body.clientHeight;
    canvas.width = canvasW;
    canvas.height = canvasH ;


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
    const angle1 = getRandomAngle();                        // Angle of the First Rod (Y-axis)
    const angle2 = getRandomAngle();                        // Angle of the Second Rod (Y-axis)
    const gravity = 10;                                     // Value of Gravity
    const dt = 0.04;                                        // Time Step

    // Creating Canvas to Plot Data
    const plot = document.createElement('canvas');
    plot.id = "plot";
    document.body.appendChild(plot);

    // Setting the width and height of the Plot
    const plotW = canvasW; //document.body.clientWidth;
    const plotH = canvasH; //document.body.clientHeight;
    plot.width = plotW;
    plot.height = plotH ;
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
                
                // Tiny changes of the beginning angle of the second pendulum to stimulate CHAOS!
                angle2: angle2 + i * 0.001,

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
                color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16)

            })

            // Adding Pendulum
            pendulums.push(pendulum);
        }
    }

    // Updates the State of the Pendulum and Displays the Pendulum
    setInterval(() => {

      // Clearing Canvas
      ctx.fillStyle = 'black';
      ctx.fillRect(-canvas.width / 2, canvas.height / 2, canvas.width, -canvas.height);

      // Calculating the coordinates and drawing the double pendulums
      pendulums.forEach(pendulum => {
        pendulum.calculate();
        pendulum.draw();
      })
      pendulums[0].plot();

    }, 1000 / framesPerSecond); // Computing Period in Milliseconds

}


var state=0;
function formModifyer(){
    var pendulum = document.getElementById('subject').value;
    var form = document.getElementById('form');
    if(state==0){
        //number of pendulums
        addSlider("Number of pendulums:  ", '1', '1', "20", "15");
         //mass 1
        addSlider("Mass 1 (kg):", "2", "1", "30", "20");
        //length 1
        addSlider("Length 1 (cm): ", "3", "1", "500", "100");
        state = pendulum;
        if(pendulum==2){
          //mass 2
          addSlider("Mass 2 (kg):", "4", "1", "30", "20");
          //length 2
          addSlider("Length 2 (cm): ", "5", "1", "500", "100");
          addButton();
          }
          else{
            addButton();
          }
    }
    else if(state==1){
      removeButton();
      //mass 2
      addSlider("Mass 2 (kg):", "4", "1", "30", "20");
      //length 2
      addSlider("Length 2 (cm): ", "5", "1", "500", "100");
      addButton();
      state = pendulum;
    }
    else {
      //mass 2
      var br1e = document.getElementById("br1-4");
      var bre = document.getElementById("br-4");
      var br2e = document.getElementById("br2-4");
      var label1e = document.getElementById("label-4");
      var div1e = document.getElementById("div1-4");
      form.removeChild(bre);
      form.removeChild(br1e);
      form.removeChild(br2e);
      form.removeChild(label1e);
      form.removeChild(div1e);
      //length 2
      var br1f = document.getElementById("br1-5");
      var brf = document.getElementById("br-5");
      var br2f = document.getElementById("br2-5");
      var label1f = document.getElementById("label-5");
      var div1f = document.getElementById("div1-5");
      form.removeChild(brf);
      form.removeChild(br1f);
      form.removeChild(br2f);
      form.removeChild(label1f);
      form.removeChild(div1f);
      state = pendulum;
  }
}

 // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
function updateData(e) {
  string = e.currentTarget.string;
  var slider = document.getElementById("myRange"+string);
  var demo = document.getElementById("demo"+string);
  demo.innerHTML = slider.value;
} 

function addButton(){
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
function removeButton(){
  var form = document.getElementById('form');
  var br1g = document.getElementById("br1g");
  var br2g = document.getElementById("br2g");
  var center = document.getElementById("center");
  form.removeChild(br1g);
  form.removeChild(br2g);
  form.removeChild(center);
}

function addSlider(label, id, min, max, value ){
        var br = document.createElement('br');
        br.id = "br-"+id;
        var br1 = document.createElement('br');
        br1.id = "br1-"+id;
        var br2= document.createElement('br');
        br2.id = "br2-"+id;
        var newlabel = document.createElement('label');
        newlabel.id = "label-"+id;
        newlabel.appendChild(document.createTextNode(label));
        newlabel.for = "number"+id;
        var input = document.createElement('input');
        input.type = 'range';
        input.id = 'myRange'+id;
        input.name = 'number'+id;
        input.min = min;
        input.max = max;
        input.value = value;
        input.classList.add('slider');
        var div1 = document.createElement('div');
        div1.id = "div1-"+id;
        div1.classList.add("slidecontainer");
        var div2 = document.createElement('b');
        div2.id = "demo"+id;
        newlabel.appendChild(div2);
        div1.appendChild(input);
        form.appendChild(br);
        form.appendChild(br1);
        form.appendChild(br2);
        form.appendChild(newlabel);
        form.appendChild(div1);
        div2.innerHTML = input.value;
        input.string = id;
        input.addEventListener('input', updateData);
}
