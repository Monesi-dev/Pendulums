function screenshotPage() {
    var wrapper = document.getElementById('canvas');
    html2canvas(wrapper, {
        onrendered: function(canvas) {
            canvas.toBlob(function(blob) {
                saveAs(blob, 'Traiettoria.png');
            });
        }
    });
}


class SinglePendulum extends Pendulum {

    constructor({ fixedPointX, fixedPointY, length, mass, angle, gravity, dt, ctx, ctxPlot, color, trajectory, isFirst }) {

        // Invoking the Constructor of the Base Class
        super();

        // Sets X and Y of the Point of Suspension
        this.fixedPointX = fixedPointX;
        this.fixedPointY = fixedPointY;

        // Sets the remaining Variables
        this.length = length;             // Length of the Pendulum
        this.mass = mass;                 // Mass attached to the end of the Pendulum
        this.angle = angle;               // Initial Angle of the Pendulum with respect to the Y-axis
        this.angularVelocity = 0;         // Initial Angular Velocity
        this.angularAcceleration = 0;     // Initial Angular Acceleration
        this.gravity = gravity;           // Value of Gravitational Acceleration
        this.dt = dt;                     // The Time Step used for Integration
        this.ctx = ctx;                   // Something needed to draw the Pendulum
        this.ctxPlot = ctxPlot;           // Something needed to plot the Angle
        this.currentTime = 0;             // Something needed to plot the Angle
        this.color = color;               // The Color of the Pendulum
        this.drawTrajectory = trajectory; // Boolean Value that determines whether the Trajectory of the Mass has to be drawn 
        this.maxTrajectorySize = 200;     // Max Number of Positions Stored to draw the Trajectory  
        this.trajectoryPoints = [];       // Array containing Positions of the Mass
        this.finalTrajectoryPoints = [];  // Array containing every Position of the Mass
        this.drawFinalTrajectory = false; // Boolean Values that determines whether the Complete Trajectory has to be drawn (ending Animation)
        this.maxTime = 140;               // Time after which the Animation will be stopped and the Complete Trajectory will be drawn
        this.isFirst = isFirst                    // If this is the first spawned pendulum then it has to store certain values to plot some data
        this.csvDownloaded = false                // It's true if csv files have been downloaded, it is useful to stop storing data once the files have been downloaded by the user
        this.angles = ['theta1,t']                // Array that stores Angles against Time used to create a csv file
        this.energyCsv = ['Energy,t']             // Array that stores Energy against Time used to create a csv file

    }

    // This Function calculates given a tiny variation of time the new angle, velocity and acceleration
    calculate() {

        // Gets some Variable so that code is more readable
        const { sin, cos, abs, round, PI } = Math;
        const { isFirst, csvDownloaded, mass, angle, gravity, length, dt, numApprox, fixedPointX, fixedPointY } = this;

        // Updates Values used to Plot the Angle

        // Updates values used to create csv files
        this.currentTime += dt;
        if (isFirst && csvDownloaded == false) {
            const potentialEnergy = length * mass * gravity * (1 - cos(angle));
            const kineticEnergy = 1 / 2 * mass * (length * this.angularVelocity) ** 2;
            const totalEnergy = potentialEnergy + kineticEnergy
            this.energyCsv.push(totalEnergy + ',' + round(this.currentTime * 100) / 100)
            this.angles.push(angle + ',' + round(this.currentTime * 100) / 100)
        }

        // Computes Acceleration, Velocity and Angular Position
        this.oldAngle = this.angle;
        this.angularAcceleration = -1 / 2 * (3 * sin(angle) - sin(this.oldAngle)) * gravity / length;
        this.angularVelocity += this.angularAcceleration * dt;
        this.angle += this.angularVelocity * dt;

        /* Debug
         * const potentialEnergy = length * mass * gravity * (1 - cos(angle));
         * const kineticEnergy = 1 / 2 * mass * (length * this.angularVelocity) ** 2;
         * console.log("Mechanical Energy: " + (kineticEnergy + potentialEnergy) );
         */

        // Computes X and Y Coordinates of the End of the Pendulum
        this.endPendulumX = fixedPointX + length * Math.sin(this.angle);
        this.endPendulumY = fixedPointY - length * Math.cos(this.angle);

        // Stores Variables used to Draw the Trajectory of the Second Mass
        this.trajectoryPoints.push({x: this.endPendulumX, y: this.endPendulumY});
        this.finalTrajectoryPoints.push({x: this.endPendulumX, y: this.endPendulumY});
        if (this.trajectoryPoints.length > this.maxTrajectorySize) this.trajectoryPoints.shift();

    }

    // This Function draws the Pendulum on the Canvas
    draw() {

        // Sets some Variables
        const { PI } = Math;
        const { maxTime, fixedPointX, fixedPointY, endPendulumX, endPendulumY, ctx, color, drawTrajectory, trajectoryPoints} = this;
        const circleRadius = 13;           // Radius of the Mass attached to the end of the Pendulum
        const pointRadius = 4;             // Radius of the Points of the Trajectory
        ctx.lineWidth = 10;                // Thickness of the Pendulum 
        ctx.strokeStyle = color;           // Color of the Pendulum 
        ctx.fillStyle = color;             // Color of the Mass attached to the end of the Pendulum 

        // Draws the Final Trajectory 
        if (this.drawFinalTrajectory) {
            this.finalTrajectoryPoints.forEach( point => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, pointRadius, 0, 2 * PI);
                ctx.fill();
            })
            return 1;   // Ends Animation
        }

        // Draws the Fixed Circle in the Suspension Point
        ctx.beginPath();
        ctx.arc(fixedPointX, fixedPointY, circleRadius, 0, 2 * PI);
        ctx.fill();

        // Draws the Line of the Pendulum
        ctx.beginPath();
        ctx.moveTo(fixedPointX, fixedPointY);
        ctx.lineTo(endPendulumX, endPendulumY);
        ctx.stroke();

        // Draws the Mass attached to the end of the Pendulum
        ctx.beginPath();
        ctx.arc(endPendulumX, endPendulumY, circleRadius, 0, 2 * PI);
        ctx.fill();

        // Draws the Trajectory of the Second Mass
        if (drawTrajectory) {
            trajectoryPoints.forEach( point => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, pointRadius, 0, 2 * PI);
                ctx.fill();
            })

            // Determines Whether Final Trajectory has to be Drawn
            if (this.currentTime > maxTime) {
                this.drawFinalTrajectory = true;
                // Downloads an image of the trajectory. Without 
                //the wait parameter the image would be downloaded while the
                //pendulum is still visible
                const attesa = setTimeout(screenshotPage, 5000);
            }
            
        }

        return 0;

    }

    downloadCsvFiles() {
    
        this.csvDownloaded = true

        // Creating the csv file with theta and time 
        var data = this.angles.join('\n')                     // Creating a string containing the csv file 
        var blob = new Blob([data], { type: 'text/csv' });    // Turning the above string into an actual csv file
        var url = window.URL.createObjectURL(blob)  // Creating an object for the downloading url
        var a = document.createElement('a')         // Creating an anchor for the download

        // Starting the dowload automatically
        a.setAttribute('href', url)                   // Setting the anchor to the url of the csv file
        a.setAttribute('download', 'angles.csv'); 
        a.click();                                    // Downloading with a click 

        // Creating the csv file with Energy and time 
        var data = this.energyCsv.join('\n')                     // Creating a string containing the csv file 
        var blob = new Blob([data], { type: 'text/csv' });    // Turning the above string into an actual csv file
        var url = window.URL.createObjectURL(blob)  // Creating an object for the downloading url
        var a = document.createElement('a')         // Creating an anchor for the download

        // Starting the dowload automatically
        a.setAttribute('href', url)                   // Setting the anchor to the url of the csv file
        a.setAttribute('download', 'energy.csv'); 
        a.click();                                    // Downloading with a click 

        const fakeCanvas = document.createElement('canvas')
        document.getElementById('main').append(fakeCanvas)
        for (let i = 0; i < 20; i++) {
            var br = document.createElement('br')
            document.getElementById('main').append(br)
        }
        // fakeCanvas.style.backgroundColor = "white"

        const timeValues = [];
        const thetaValues = [];
        this.angles.forEach(
            (item, index) => {
                if (index == 0) return;
                const values = item.split(',')
                thetaValues.push(values[0])
                timeValues.push(values[1])
            }
        )

        var myChart = new Chart( 
            fakeCanvas,
            {
          type: "line",
          data: {
            labels: timeValues,
            datasets: [{
                label: "theta",
                lineTension: 1,
              data: thetaValues,
              borderColor: "red",
              fill: false
            }]
          }
        });

        // Creating Fake Canvas to plot Energy
        const energyCanvas = document.createElement('canvas')
        document.getElementById('main').append(energyCanvas)
        for (let i = 0; i < 20; i++) {
            var br = document.createElement('br')
            document.getElementById('main').append(br)
        }
        // fakeCanvas.style.backgroundColor = "white"

        const timeValuesE = [];
        const energyValues = [];
        this.energyCsv.forEach(
            (item, index) => {
                if (index == 0) return;
                const values = item.split(',')
                energyValues.push(values[0])
                timeValuesE.push(values[1])
            }
        )

        var myChart = new Chart( 
            energyCanvas,
            {
          type: "line",
          data: {
            labels: timeValuesE,
            datasets: [{
                label: "energy",
                lineTension: 1,
              data: energyValues,
              borderColor: "blue",
              fill: false
            }]
          }
        });
    }

    // Plots the Angle of the Pendulum
    plot() {

        // Declaring Variables
        const { PI, abs } = Math;
        let { ctxPlot, dt, currentTime, oldAngle, angle } = this;   // Makes the Code Cleaner 
        const prevTime = currentTime - dt;                  // The Instant in which previous Angles were Plotted
        const color = "red";                                // Color for the Angle
        const angleOffset = -280;                           // This is used to center the plot in the Canvas
        const angleMultiplier = 70;                         // This is used to increase the Amplitude while Plotting 
        const timeMultiplier = 10;                          // Drawing on Canvas with small time steps is tricky

        // Adjusting Angles to plot between 0 and 2 * PI
        oldAngle += PI;
        angle += PI;
        while (oldAngle > 2 * PI) oldAngle -= 2 * PI;       // If the angle goes beyond 180 degree it will be plotted from below          
        while (angle > 2 * PI) angle -= 2 * PI;
        while (oldAngle < 0) oldAngle += 2 * PI;            // If the angle goes below -180 degree it will be plotted from above
        while (angle < 0) angle += 2 * PI;

        /*
         * If the new angle goes beyond the threshold and starts from below the line won't be drawn
         * For instance if the old angle is 6.27 and the new angle is 0.139 the line won't be drawn
         */

        // Plotting the Angle if it hasn't changed abruptly
        if (abs(angle - oldAngle) < PI / 2) {
            ctxPlot.strokeStyle = color;
            ctxPlot.beginPath();
            ctxPlot.moveTo(timeMultiplier * prevTime, angleMultiplier * oldAngle + angleOffset);
            ctxPlot.lineTo(timeMultiplier * currentTime, angleMultiplier * angle + angleOffset);
            ctxPlot.stroke();
        }

    }

}
