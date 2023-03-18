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
            count: Number(document.getElementById("myRange").value),            // Number of Pendulums Rendered
            mass1: 10 * Number(document.getElementById("myRangec").value),      // Value of the First Mass
            length1: Number(document.getElementById("myRanged").value)          // Length of the First Rod
        };   
    }

    // 2 => Double Pendulum
    else if (typeOfPendulum == 2) {
        pendulumData = {
            count: Number(document.getElementById("myRange").value),             // Number of Pendulums Rendered
            mass1: 10 * Number(document.getElementById("myRangec").value),       // Value of the First Mass
            length1: Number(document.getElementById("myRanged").value),          // Length of the First Rod
            mass2: 10 * Number(document.getElementById("myRangee").value),       // Value of the Second Mass
            length2: Number(document.getElementById("myRangef").value)           // Length of the Second Rod
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
    console.log(canvasH);


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

    }, 1000 / framesPerSecond); // Computing Period in Milliseconds

}


var state=0;
function formModifyer(){
    var pendulum = document.getElementById('subject').value;
    var form = document.getElementById('form');
    if(state==0){
        //number of pendulums
        var br = document.createElement('br');
        var br1 = document.createElement('br');
        var br2= document.createElement('br');
        var label1 = document.createElement('label');
        label1.appendChild(document.createTextNode("Number of pendulums:    "));
        label1.for = "number";
        var input1 = document.createElement('input');
        input1.type = 'range';
        input1.id = 'myRange';
        input1.name = 'number';
        input1.min = '1';
        input1.max = '20';
        input1.value = '15';
        input1.classList.add('slider');
        var div1 = document.createElement('div');
        div1.classList.add("slidecontainer");
        var div2 = document.createElement('b');
        div2.id = "demo";
        label1.appendChild(div2);
        div1.appendChild(input1);
        form.appendChild(br);
        form.appendChild(br1);
        form.appendChild(br2);
        form.appendChild(label1);
        form.appendChild(div1);
        div2.innerHTML = input1.value;
        input1.addEventListener('input', updateData);

        /* frame rate
         * var bra = document.createElement('br');
         * var br1a = document.createElement('br');
         * var br2a= document.createElement('br');
         * var label1a = document.createElement('label');
         * label1a.appendChild(document.createTextNode("Framerate: "));
         * label1a.for = "numbera";
         * var input1a = document.createElement('input');
         * input1a.type = 'range';
         * input1a.id = 'myRangea';
         * input1a.name = 'numbera';
         * input1a.min = '70';
         * input1a.max = '140';
         * input1a.value = '120';
         * input1a.classList.add('slider');
         * var div1a = document.createElement('div');
         * div1a.classList.add("slidecontainer");
         * var div2a = document.createElement('b');
         * div2a.id = "demoa";
         * label1a.appendChild(div2a);
         * div1a.appendChild(input1a);
         * form.appendChild(bra);
         * form.appendChild(br1a);
         * form.appendChild(br2a);
         * form.appendChild(label1a);
         * form.appendChild(div1a);
         * div2a.innerHTML = input1a.value;
         * input1a.addEventListener('input', updateDataa);
         */

        /* timestep
         * var brb = document.createElement('br');
         * var br1b = document.createElement('br');
         * var br2b= document.createElement('br');
         * var label1b = document.createElement('label');
         * label1b.appendChild(document.createTextNode("Timestep (ms): "));
         * label1b.for = "numberb";
         * var input1b = document.createElement('input');
         * input1b.type = 'range';
         * input1b.id = 'myRangeb';
         * input1b.name = 'numberb';
         * input1b.min = '10';
         * input1b.max = '500';
         * input1b.value = '40';
         * input1b.classList.add('slider');
         * var div1b = document.createElement('div');
         * div1b.classList.add("slidecontainer");
         * var div2b = document.createElement('b');
         * div2b.id = "demob";
         * label1b.appendChild(div2b);
         * div1b.appendChild(input1b);
         * form.appendChild(brb);
         * form.appendChild(br1b);
         * form.appendChild(br2b);
         * form.appendChild(label1b);
         * form.appendChild(div1b);
         * div2b.innerHTML = input1b.value;
         * input1b.addEventListener('input', updateDatab);
         */

         //mass 1
        var brc = document.createElement('br');
        var br1c = document.createElement('br');
        var br2c= document.createElement('br');
        var label1c = document.createElement('label');
        label1c.appendChild(document.createTextNode("Mass 1 (kg): "));
        label1c.for = "numberc";
        var input1c = document.createElement('input');
        input1c.type = 'range';
        input1c.id = 'myRangec';
        input1c.name = 'numberc';
        input1c.min = '1';
        input1c.max = '30';
        input1c.value = '10';
        input1c.classList.add('slider');
        var div1c = document.createElement('div');
        div1c.classList.add("slidecontainer");
        var div2c = document.createElement('b');
        div2c.id = "democ";
        label1c.appendChild(div2c);
        div1c.appendChild(input1c);
        form.appendChild(brc);
        form.appendChild(br1c);
        form.appendChild(br2c);
        form.appendChild(label1c);
        form.appendChild(div1c);
        div2c.innerHTML = input1c.value;
        input1c.addEventListener('input', updateDatac);
        //length 1
        var brd = document.createElement('br');
        var br1d = document.createElement('br');
        var br2d= document.createElement('br');
        var label1d = document.createElement('label');
        label1d.appendChild(document.createTextNode("Length 1 (cm): "));
        label1d.for = "numberd";
        var input1d = document.createElement('input');
        input1d.type = 'range';
        input1d.id = 'myRanged';
        input1d.name = 'numberd';
        input1d.min = '50';
        input1d.max = '150';
        input1d.value = '100';
        input1d.classList.add('slider');
        var div1d = document.createElement('div');
        div1d.classList.add("slidecontainer");
        var div2d = document.createElement('b');
        div2d.id = "demod";
        label1d.appendChild(div2d);
        div1d.appendChild(input1d);
        form.appendChild(brd);
        form.appendChild(br1d);
        form.appendChild(br2d);
        form.appendChild(label1d);
        form.appendChild(div1d);
        div2d.innerHTML = input1d.value;
        input1d.addEventListener('input', updateDatad);
        state = pendulum;
        if(pendulum==2){
          var bre = document.createElement('br');
          bre.id = "bre";
          var br1e = document.createElement('br');
          br1e.id = "br1e";
          var br2e= document.createElement('br');
          br2e.id = "br2e";
          var label1e = document.createElement('label');
          label1e.id = "label1e";
          label1e.appendChild(document.createTextNode("Mass 2 (kg): "));
          label1e.for = "numbere";
          var input1e = document.createElement('input');
          input1e.type = 'range';
          input1e.id = 'myRangee';
          input1e.name = 'numbere';
          input1e.min = '1';
          input1e.max = '30';
          input1e.value = '10';
          input1e.classList.add('slider');
          var div1e = document.createElement('div');
          div1e.id = "div1e";
          div1e.classList.add("slidecontainer");
          var div2e = document.createElement('b');
          div2e.id = "demoe";
          label1e.appendChild(div2e);
          div1e.appendChild(input1e);
          form.appendChild(bre);
          form.appendChild(br1e);
          form.appendChild(br2e);
          form.appendChild(label1e);
          form.appendChild(div1e);
          div2e.innerHTML = input1e.value;
          input1e.addEventListener('input', updateDatae);
          //length 2
          var brf = document.createElement('br');
          brf.id = 'brf';
          var br1f = document.createElement('br');
          br1f.id = 'br1f';
          var br2f= document.createElement('br');
          br2f.id = 'br2f';
          var label1f = document.createElement('label');
          label1f.id = 'label1f';
          label1f.appendChild(document.createTextNode("Length 2 (cm): "));
          label1f.for = "numberf";
          var input1f = document.createElement('input');
          input1f.type = 'range';
          input1f.id = 'myRangef';
          input1f.name = 'numberf';
          input1f.min = '50';
          input1f.max = '150';
          input1f.value = '100';
          input1f.classList.add('slider');
          var div1f = document.createElement('div');
          div1f.id = 'div1f';
          div1f.classList.add("slidecontainer");
          var div2f = document.createElement('b');
          div2f.id = "demof";
          label1f.appendChild(div2f);
          div1f.appendChild(input1f);
          form.appendChild(brf);
          form.appendChild(br1f);
          form.appendChild(br2f);
          form.appendChild(label1f);
          form.appendChild(div1f);
          div2f.innerHTML = input1f.value;
          input1f.addEventListener('input', updateDataf);
          addButton();
          }
          else{
            addButton();
          }
    }
    else if(state==1){
      //mass 2
      var bre = document.createElement('br');
      bre.id = "bre";
      var br1e = document.createElement('br');
      br1e.id = "br1e";
      var br2e= document.createElement('br');
      br2e.id = "br2e";
      var label1e = document.createElement('label');
      label1e.id = "label1e";
      label1e.appendChild(document.createTextNode("Mass 2 (kg): "));
      label1e.for = "numbere";
      var input1e = document.createElement('input');
      input1e.type = 'range';
      input1e.id = 'myRangee';
      input1e.name = 'numbere';
      input1e.min = '1';
      input1e.max = '30';
      input1e.value = '10';
      input1e.classList.add('slider');
      var div1e = document.createElement('div');
      div1e.id = "div1e";
      div1e.classList.add("slidecontainer");
      var div2e = document.createElement('b');
      div2e.id = "demoe";
      removeButton();
      label1e.appendChild(div2e);
      div1e.appendChild(input1e);
      form.appendChild(bre);
      form.appendChild(br1e);
      form.appendChild(br2e);
      form.appendChild(label1e);
      form.appendChild(div1e);
      div2e.innerHTML = input1e.value;
      input1e.addEventListener('input', updateDatae);
      //length 2
      var brf = document.createElement('br');
      brf.id = 'brf';
      var br1f = document.createElement('br');
      br1f.id = 'br1f';
      var br2f= document.createElement('br');
      br2f.id = 'br2f';
      var label1f = document.createElement('label');
      label1f.id = 'label1f';
      label1f.appendChild(document.createTextNode("Length 2 (cm): "));
      label1f.for = "numberf";
      var input1f = document.createElement('input');
      input1f.type = 'range';
      input1f.id = 'myRangef';
      input1f.name = 'numberf';
      input1f.min = '50';
      input1f.max = '150';
      input1f.value = '100';
      input1f.classList.add('slider');
      var div1f = document.createElement('div');
      div1f.id = 'div1f';
      div1f.classList.add("slidecontainer");
      var div2f = document.createElement('b');
      div2f.id = "demof";
      label1f.appendChild(div2f);
      div1f.appendChild(input1f);
      form.appendChild(brf);
      form.appendChild(br1f);
      form.appendChild(br2f);
      form.appendChild(label1f);
      form.appendChild(div1f);
      div2f.innerHTML = input1f.value;
      input1f.addEventListener('input', updateDataf);
      addButton();
      state = pendulum;
    }
    else {
      //mass 2
      var br1e = document.getElementById("br1e");
      var bre = document.getElementById("bre");
      var br2e = document.getElementById("br2e");
      //var input1e = document.getElementById("input1e");
      var label1e = document.getElementById("label1e");
      var div1e = document.getElementById("div1e");
      //var div2e = document.getElementById("demoe");
      form.removeChild(bre);
      form.removeChild(br1e);
      form.removeChild(br2e);
      form.removeChild(label1e);
      form.removeChild(div1e);
      //length 2
      var br1f = document.getElementById("br1f");
      var brf = document.getElementById("brf");
      var br2f = document.getElementById("br2f");
      //var input1e = document.getElementById("input1e");
      var label1f = document.getElementById("label1f");
      var div1f = document.getElementById("div1f");
      //var div2e = document.getElementById("demoe");
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
function updateData() {
  var slider = document.getElementById("myRange");
  var demo = document.getElementById("demo");
  demo.innerHTML = slider.value;
} 
function updateDataa() {
  var slider = document.getElementById("myRangea");
  var demo = document.getElementById("demoa");
  demo.innerHTML = slider.value;
} 
function updateDatab() {
  var slider = document.getElementById("myRangeb");
  var demo = document.getElementById("demob");
  demo.innerHTML = slider.value;
} 
function updateDatac() {
  var slider = document.getElementById("myRangec");
  var demo = document.getElementById("democ");
  demo.innerHTML = slider.value;
} 
function updateDatad() {
  var slider = document.getElementById("myRanged");
  var demo = document.getElementById("demod");
  demo.innerHTML = slider.value;
} 
function updateDatae() {
  var slider = document.getElementById("myRangee");
  var demo = document.getElementById("demoe");
  demo.innerHTML = slider.value;
} 
function updateDataf() {
  var slider = document.getElementById("myRangef");
  var demo = document.getElementById("demof");
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
