// Utility Function
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
};

function getRandomAngle() {
    return 2 * Math.PI * getRandomNumber(0.135, 0.65);
};


function start(pend) {

    // Setting the width and height of the canvas, so that it fills the screen
    const canvas = document.getElementById('canvas');
    const canvasW = document.body.clientWidth;
    const canvasH = document.body.clientHeight;
    canvas.width = canvasW;
    canvas.height = canvasH;


    // transforming the canvas, so that the y axis goes from bottom to top and centering the origin
    const ctx = canvas.getContext('2d');
    ctx.transform(1, 0, 0, -1, canvasW / 2, canvasH / 2);

    // Setting the number of pendulums and randomly choosing an initial condition
    const doublePendulums = [];                             // Array that contains the Pendulums
    const doublePendulumsCount = 15;                        // Number of Pendulums Spawned
    const framesPerSecond = 120;                             // Framerate
    const mass1 = 10;                                       // Value of the First Mass
    const length1 = (window.innerWidth < 700) ? 80 : 150;   // Length of the First Rod
    const mass2 = 10;                                       // Value of the Second Mass
    const length2 = (window.innerWidth < 700) ? 80 : 150;   // Length of the Second Rod
    const angle1 = getRandomAngle();                        // Angle of the First Rod (Y-axis)
    const angle2 = getRandomAngle();                        // Angle of the Second Rod (Y-axis)
    const gravity = 10;                                     // Value of Gravity
    const dt = 0.04;                                        // Time Step

    /*
    // Generating Color Gradient using a Library
    const rainbow = new Rainbow(); 
    rainbow.setNumberRange(1, doublePendulumsCount);
    rainbow.setSpectrum('red', 'green');
    let colors = [];
    for (let i = 1; i <= doublePendulumsCount; i++) {
        let hexColor = '#' + rainbow.colourAt(i);
        colors.push(hexColor);
    }
    */

    // Creating Double Pendulums with Slight Variations
    for (let i = 0; i < doublePendulumsCount; i++) {

        if (pend == 2) {

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
                // color: colors[i],
                color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16),
                
                // Tiny changes of the beginning angle of the second pendulum to stimulate CHAOS!
                angle2: angle2 + i * 0.02,

            });

            // Adding Pendulum
            doublePendulums.push(doublePendulum);
        }

        else if (pend == 1) {

            const pendulum = new SinglePendulum({

                // Fixed Initial Conditions
                fixedPointX: 0,
                fixedPointY: 0,
                length: length1,
                mass: 1,
                angle: angle1 + i * 0.002,
                gravity: gravity,
                dt: dt,
                ctx: ctx, 
                color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16)

            })

            // Adding Pendulum
            doublePendulums.push(pendulum);
        }
    }

    // Updates the State of the Pendulum and Displays the Pendulum
    setInterval(() => {

      // Clearing Canvas
      ctx.fillStyle = 'black';
      ctx.fillRect(-canvas.width / 2, canvas.height / 2, canvas.width, -canvas.height);

      // Calculating the coordinates and drawing the double pendulums
      doublePendulums.forEach(doublePendulum => {
        doublePendulum.calculate();
        doublePendulum.draw();
      })

    }, 1000 / framesPerSecond); // Computing Period in Milliseconds

}

window.onload = start(2);
