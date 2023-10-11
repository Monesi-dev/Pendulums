// Make a switch statement

class DoublePendulum extends Pendulum {

    constructor({ mass1, length1, angle1, mass2, length2, angle2, gravity, dt, ctx, ctxPlot, color, trajectory, numericalApprox, isFirst }) {

        // Invoke the Constructor of Base Class
        super()                         // Constructor of Pendulum Class

        // Initialize Variables
        this.mass1 = mass1;               // Mass attached to the end of the First Rod
        this.length1 = length1;           // Length of the First Rod
        this.angle1 = angle1;             // Initial Angle of the First Rod (Y-axis)
        this.angleVel1 = 0                // Initial Angular Velocity of the First Rod
        this.angleAccel1 = 0              // Initial Angular Acceleration of the First Rod
        this.mass2 = mass2;               // Mass attached to the end of the Second Rod
        this.length2 = length2;           // Length of the Second Rod
        this.angle2 = angle2;             // Initial Angle of the Second Rod (Y-axis)
        this.angleVel2 = 0                // Initial Angular Velocity of the Second Rod
        this.angleAccel2 = 0              // Initial Angular Acceleration of the Second Rod
        this.gravity = gravity            // Value of Gravitational Acceleration
        this.dt = dt                      // The Time Step used for Integration
        this.currentTime = 0              // This will be useful when Plotting the Angles
        this.ctx = ctx                    // Something needed to draw the Pendulum
        this.ctxPlot = ctxPlot            // Something needed to draw the Pendulum
        this.color = color                // The Color of the Pendulum
        this.drawTrajectory = trajectory; // Boolean Values that determines whether the Trajectory has to be drawn
        this.maxTrajectorySize = 400;     // Max Number of Positions Stored to draw the Trajectory  
        this.trajectoryPoints = [];       // Array containing Positions of the Second Mass
        this.finalTrajectoryPoints = [];  // Array containing every Position of the Mass
        this.drawFinalTrajectory = false; // Boolean Values that determines whether the Complete Trajectory has to be drawn (ending Animation)
        this.maxTime = 140;               // Time after which the Animation will be stopped and the Complete Trajectory will be drawn
        this.numericalApprox = numericalApprox;   // Determines the Method used for Numerical Approximation
        this.isFirst = isFirst                    // If this is the first spawned pendulum then it has to store certain values to plot some data
        this.csvDownloaded = false                // It's true if csv files have been downloaded, it is useful to stop storing data once the files have been downloaded by the user
        this.angles = ['theta1,theta2,t']         // Array that stores Angles against Time used to create a csv file
        this.energyCsv = ['Energy,t']             // Array that stores Energy against Time used to create a csv file
        this.dotq1q1 = ['dotq1,q1']                  // Array that stores the values of q1 and its derivative with respect to time, used to plot the state space 
        this.dotq2q2 = ['dotq2,q2']                  // Array that stores the values of q2 and its derivative with respect to time, used to plot the state space 
        this.x1 = length1 * Math.sin(this.angle1);
        this.y1 = - length1 * Math.cos(this.angle1);
        this.x2 = this.x1 + length2 * Math.sin(this.angle2);
        this.y2 = this.y1 - length2 * Math.cos(this.angle2);

    }

    // This is a Utility Function used when Integrating with the RK4 Method
    #getAccelerations(angle1, angle2, angleVel1, angleVel2) {

        // Shortcuts to make the Math look cleaner without many "this." or "Math."
        const { sin, cos } = Math;
        const { mass1, length1, mass2, length2, gravity } = this;

        // Computes the Angular Accelerations of the First Rod
        const chunk1 = - gravity * (2 * mass1 + mass2) * sin(angle1) - mass2 * gravity * sin(angle1 - 2 * angle2);
        const chunk2 = - 2 * sin(angle1 - angle2) * mass2 * (length2 * angleVel2 ** 2 + cos(angle1 - angle2) * length1 * angleVel1 ** 2);
        const chunk3 = length1 * (2 * mass1 + mass2 - mass2 * cos(2 * angle1 - 2 * angle2))
        const angleAccel1 = (chunk1 + chunk2) / chunk3;

        // Computes the Angular Accelerations of the First Rod
        const chunk4 = 2 * sin(angle1 - angle2);
        const chunk5 = (mass1 + mass2) * length1 * angleVel1 ** 2 + (mass1 + mass2) * gravity * cos(angle1);
        const chunk6 = cos(angle1 - angle2) * mass2 * length2 * angleVel2 ** 2;
        const chunk7 = length2 * (2 * mass1 + mass2 - mass2 * cos(2 * angle1 - 2 * angle2));
        const angleAccel2 = chunk4 * (chunk5 + chunk6) / chunk7;

        return {
            angleAccel1: angleAccel1, 
            angleAccel2: angleAccel2
        };

    }

    // This Function computes the new angles and velocities
    calculate() {

        // Shortcuts to make the Math look cleaner without many "this." or "Math."
        const { sin, cos, round } = Math;
        const { isFirst, csvDownloaded, mass1, length1, angle1, angleVel1, mass2, length2, angle2, angleVel2, numericalApprox, dt, gravity } = this;

        // Storing Data that will be used to create the csv files 
        if (isFirst && csvDownloaded === false) {

            // Storing Angle values with respect to time 
            this.angles.push(this.angle1 + ',' + this.angle2 + ',' + round(100 * this.currentTime) / 100)

            // Storing q1, dotq1, q2 and dotq2 values 
            this.dotq1q1.push(this.angleVel1 + ',' + this.angle1)
            this.dotq2q2.push(this.angleVel2 + ',' + this.angle2)

            // Computing and then storing energy with respect to time
            const kineticEnergy1 = 1 / 2 * this.mass1 * (this.length1 * this.angleVel1) ** 2;
            const vel2_x = this.length1 * this.angleVel1 * cos(this.angle1) + this.length2 * this.angleVel2 * cos(this.angle2);
            const vel2_y = this.length1 * this.angleVel1 * sin(this.angle1) + this.length2 * this.angleVel2 * sin(this.angle2);
            const kineticEnergy2 = 1 / 2 * this.mass2 * (vel2_x ** 2 + vel2_y ** 2);
            const kineticEnergy = kineticEnergy1 + kineticEnergy2;
            const potentialEnergy1 = this.gravity * this.mass1 * this.y1;
            const potentialEnergy2 = this.gravity * this.mass2 * this.y2;
            const potentialEnergy = potentialEnergy1 + potentialEnergy2;
            const mechanicalEnergy = potentialEnergy + kineticEnergy;
            this.energyCsv.push(mechanicalEnergy + ',' + round(100 * this.currentTime) / 100)
        }
        this.currentTime += dt;

        // Updates angles for plotting
        // this.oldAngle1 = this.angle1;
        // this.oldAngle2 = this.angle2;
        
        // Numerical Approximation for ODE
        switch(this.numericalApprox) {

            // Runge-Kutta 4 Method
            case 'RK4':

                // First Part
                var {angleAccel1, angleAccel2} = this.#getAccelerations(angle1, angle2, angleVel1, angleVel2);
                var angleVel1_k1 = angleAccel1 * dt;
                var angleVel2_k1 = angleAccel2 * dt;

                // Second Part
                var {angleAccel1, angleAccel2} = this.#getAccelerations(angle1, angle2, angleVel1 + angleVel1_k1 / 2, angleVel2 + angleVel2_k1 / 2);
                var angleVel1_k2 = angleAccel1 * dt;
                var angleVel2_k2 = angleAccel2 * dt;

                // Third Part
                var {angleAccel1, angleAccel2} = this.#getAccelerations(angle1, angle2, angleVel1 + angleVel1_k2 / 2, angleVel2 + angleVel2_k2 / 2);
                var angleVel1_k3 = angleAccel1 * dt;
                var angleVel2_k3 = angleAccel2 * dt;

                // Fourth Part
                var {angleAccel1, angleAccel2} = this.#getAccelerations(angle1, angle2, angleVel1 + angleVel1_k3, angleVel2 + angleVel2_k3);
                var angleVel1_k4 = angleAccel1 * dt;
                var angleVel2_k4 = angleAccel2 * dt;

                // Computes Velocities and Angles of both Rods 
                this.angleVel1 += 1 / 6 * angleVel1_k1 + 1 / 3 * angleVel1_k2 + 1 / 3 * angleVel1_k3 + 1 / 6 * angleVel1_k4;
                this.angleVel2 += 1 / 6 * angleVel2_k1 + 1 / 3 * angleVel2_k2 + 1 / 3 * angleVel2_k3 + 1 / 6 * angleVel2_k4;
                this.angle1 += this.angleVel1 * dt;
                this.angle2 += this.angleVel2 * dt;

                break;      // End of Case

            // Runge Kutta 3
            case 'RK3': 

                // First Part
                var {angleAccel1, angleAccel2} = this.#getAccelerations(angle1, angle2, angleVel1, angleVel2);
                var angleVel1_k1 = angleAccel1 * dt;
                var angleVel2_k1 = angleAccel2 * dt;

                // Second Part
                var {angleAccel1, angleAccel2} = this.#getAccelerations(angle1, angle2, angleVel1 + angleVel1_k1 / 2, angleVel2 + angleVel2_k1 / 2);
                var angleVel1_k2 = angleAccel1 * dt;
                var angleVel2_k2 = angleAccel2 * dt;

                // Third Part
                var {angleAccel1, angleAccel2} = this.#getAccelerations(angle1, angle2, angleVel1 + 2 * angleVel1_k2 - angleVel1_k1, angleVel2 + 2 * angleVel2_k2 - angleVel2_k1);
                var angleVel1_k3 = angleAccel1 * dt;
                var angleVel2_k3 = angleAccel2 * dt;

                // Computes Velocities and Angles of both Rods 
                this.angleVel1 += 1 / 6 * angleVel1_k1 + 2 / 3 * angleVel1_k2 + 1 / 6 * angleVel1_k3;
                this.angleVel2 += 1 / 6 * angleVel2_k1 + 2 / 3 * angleVel2_k2 + 1 / 6 * angleVel2_k3;
                this.angle1 += this.angleVel1 * dt;
                this.angle2 += this.angleVel2 * dt;

                break;      // End of Case

            // Runge Kutta 2 O(h^2)
            case 'RK2':

                // First Part
                var {angleAccel1, angleAccel2} = this.#getAccelerations(angle1, angle2, angleVel1, angleVel2);
                var angleVel1_k1 = angleAccel1 * dt;
                var angleVel2_k1 = angleAccel2 * dt;

                // Second Part
                var {angleAccel1, angleAccel2} = this.#getAccelerations(angle1, angle2, angleVel1 + angleVel1_k1, angleVel2 + angleVel2_k1);
                var angleVel1_k2 = angleAccel1 * dt;
                var angleVel2_k2 = angleAccel2 * dt;

                // Computes Velocities and Angles of both Rods 
                this.angleVel1 += 1 / 2 * angleVel1_k1 + 1 / 2 * angleVel1_k2;
                this.angleVel2 += 1 / 2 * angleVel2_k1 + 1 / 2 * angleVel2_k2;
                this.angle1 += this.angleVel1 * dt;
                this.angle2 += this.angleVel2 * dt;

                break;      // End of Case

            // Euler Method
            case 'RK1':    

                // Computes Accelerations, Velocities and Angles of both Rods
                var {angleAccel1, angleAccel2} = this.#getAccelerations(angle1, angle2, angleVel1, angleVel2);
                this.angleVel1 += angleAccel1 * dt;
                this.angleVel2 += angleAccel2 * dt;
                this.angle1 += this.angleVel1 * dt;
                this.angle2 += this.angleVel2 * dt;

                break;      // End of Case 

            // This should never run as a DP should always be instantiated with a valid integration Method
            default:

                console.log('Integration Method Not Found!')
        }

        // Computes X and Y of the two Masses
        this.x1 = length1 * sin(this.angle1);
        this.y1 = - length1 * cos(this.angle1);
        this.x2 = this.x1 + length2 * sin(this.angle2);
        this.y2 = this.y1 - length2 * cos(this.angle2);

        // Stores Variables used to Draw the Trajectory of the Second Mass
        this.trajectoryPoints.push({x: this.x2, y: this.y2});
        this.finalTrajectoryPoints.push({x: this.x2, y: this.y2});
        if (this.trajectoryPoints.length > this.maxTrajectorySize) this.trajectoryPoints.shift();



        /* Debug - Prints Mechanical Energy
           
         * const kineticEnergy1 = 1 / 2 * this.mass1 * (this.length1 * this.angleVel1) ** 2;
         * const vel2_x = this.length1 * this.angleVel1 * cos(this.angle1) + this.length2 * this.angleVel2 * cos(this.angle2);
         * const vel2_y = this.length1 * this.angleVel1 * sin(this.angle1) + this.length2 * this.angleVel2 * sin(this.angle2);
         * const kineticEnergy2 = 1 / 2 * this.mass2 * (vel2_x ** 2 + vel2_y ** 2);
         * const kineticEnergy = kineticEnergy1 + kineticEnergy2;
         *             
         * const potentialEnergy1 = this.gravity * this.mass1 * this.y1;
         * const potentialEnergy2 = this.gravity * this.mass2 * this.y2;
         * const potentialEnergy = potentialEnergy1 + potentialEnergy2;
         * 
         * const mechanicalEnergy = potentialEnergy + kineticEnergy;
         * console.log(mechanicalEnergy);
         */
       
    }

    // This Function draws the Double Pendulum
    draw() {

        // Shortcuts to make the following lines cleaner by avoiding repeating "this." or "Math."
        const { PI } = Math;
        const { maxTime, drawTrajectory, trajectoryPoints, oldX2, oldY2, x1, y1, x2, y2, ctx } = this;
        const suspensionPointX = 0;                 // X of the Point where Pendulum is Hung
        const suspensionPointY = 0;                 // Y of the Point where Pendulum is Hung
        const circleRadius = 13;                    // Radius of the two Masses
        const pointRadius = 2                       // Radius of the Points of the Trajectory
        ctx.lineWidth = 10;                         // Thickness of the Rod
        ctx.strokeStyle = this.color;               // Color of the Rod
        ctx.fillStyle = this.color;                 // Color of the Masses

        // Draws Complete Trajectory
        if (this.drawFinalTrajectory) {
            this.finalTrajectoryPoints.forEach( point => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, pointRadius, 0, 2 * PI);
                ctx.fill();
            })
            return 1; // Ends Animation
        }

        // Draws the Suspension Point 
        ctx.beginPath();
        ctx.arc(suspensionPointX, suspensionPointY, circleRadius, 0, 2 * PI);
        ctx.fill();

        // Draws the First Rod
        ctx.beginPath();
        ctx.moveTo(suspensionPointX, suspensionPointY);
        ctx.lineTo(x1, y1);
        ctx.stroke();

        // Draws the First Mass
        ctx.beginPath();
        ctx.arc(x1, y1, circleRadius, 0, 2 * PI);
        ctx.fill();

        // Draws the Second Rod
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Draws the Second Mass
        ctx.beginPath();
        ctx.arc(x2, y2, circleRadius, 0, 2 * PI);
        ctx.fill();

        // Draws the Trajectory of the Second Mass
        if (drawTrajectory) {
            trajectoryPoints.forEach( point => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, pointRadius, 0, 2 * PI);
                ctx.fill();
            })

            // Determines Whether Final Trajectory has to be Drawn
            if (this.currentTime > maxTime) this.drawFinalTrajectory = true;
            
        }

        return 0;
    }

    // This Function plots the two angles
    plot() {

        // Declaring Variables
        const { PI, abs } = Math;
        let { ctxPlot, dt, currentTime, oldAngle1, oldAngle2, angle1, angle2 } = this;   // Makes the Code Cleaner 
        const prevTime = currentTime - dt;                  // The Instant in which previous Angles were Plotted
        const color1 = "red";                               // Color for the First Angle
        const color2 = "blue";                              // Color for the Second Angle
        const angleOffset = -280;                           // This is used to center the plot in the Canvas
        const angleMultiplier = 70;                         // This is used to increase the Amplitude while Plotting 
        const timeMultiplier = 10;                          // Drawing on Canvas with small time steps is tricky

        // Adjusting Angles to plot between 0 and 2 * PI
        oldAngle1 += PI;
        oldAngle2 += PI;
        angle1 += PI;
        angle2 += PI;
        while (oldAngle1 > 2 * PI) oldAngle1 -= 2 * PI;     // If the angle goes beyond 180 degree it will be plotted from below
        while (oldAngle2 > 2 * PI) oldAngle2 -= 2 * PI;
        while (angle1 > 2 * PI) angle1 -= 2 * PI;
        while (angle2 > 2 * PI) angle2 -= 2 * PI;
        while (oldAngle1 < 0) oldAngle1 += 2 * PI;          // If the angle goes below -180 degree it will be plotted from above
        while (oldAngle2 < 0) oldAngle2 += 2 * PI;
        while (angle1 < 0) angle1 += 2 * PI;
        while (angle2 < 0) angle2 += 2 * PI;

        /*
         * If the new angle goes beyond the threshold and starts from below the line won't be drawn
         * For instance if the old angle is 6.27 and the new angle is 0.139 the line won't be drawn
         */

        // Drawing First Angle if it hasn't changed abruptly
        if (abs(angle1 - oldAngle1) < PI / 2) {
            ctxPlot.strokeStyle = color1;
            ctxPlot.beginPath();
            ctxPlot.moveTo(timeMultiplier * prevTime, angleMultiplier * oldAngle1 + angleOffset);
            ctxPlot.lineTo(timeMultiplier * currentTime, angleMultiplier * angle1 + angleOffset);
            ctxPlot.stroke();
        }

        // Drawing Second Angle if it hasn't changed abruptly
        if (abs(angle2 - oldAngle2) < PI / 2) {
            ctxPlot.strokeStyle = color2;
            ctxPlot.beginPath();
            ctxPlot.moveTo(timeMultiplier * prevTime, angleMultiplier * oldAngle2 + angleOffset);
            ctxPlot.lineTo(timeMultiplier * currentTime, angleMultiplier * angle2 + angleOffset);
            ctxPlot.stroke();
        }

    }

    /*
     * When this function is called a set of csv files will be automatically downloaded
     * More accurately, the downloaded csv files are: 
     * 1) the plot of the two angles against time 
     * 2) the plot of the total energy against time
     * 3) the space of phases
     */
    downloadCsvFiles() {

        /*
         *      Downloading csv file containing:
         *      Theta1, Theta2, time 
         *      Energy, time 
         *      dotq1, q1 
         *      dotq2, q2
         */ 

        // Creating the csv file with theta1, theta2 and time 
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

        // Creating the csv file with q1, dotq1
        var data = this.dotq1q1.join('\n')                     // Creating a string containing the csv file 
        var blob = new Blob([data], { type: 'text/csv' });    // Turning the above string into an actual csv file
        var url = window.URL.createObjectURL(blob)  // Creating an object for the downloading url
        var a = document.createElement('a')         // Creating an anchor for the download

        // Starting the dowload automatically
        a.setAttribute('href', url)                   // Setting the anchor to the url of the csv file
        a.setAttribute('download', 'state_space_1.csv'); 
        a.click();                                    // Downloading with a click 

        // Creating the csv file with q2, dotq2
        var data = this.dotq2q2.join('\n')                     // Creating a string containing the csv file 
        var blob = new Blob([data], { type: 'text/csv' });    // Turning the above string into an actual csv file
        var url = window.URL.createObjectURL(blob)  // Creating an object for the downloading url
        var a = document.createElement('a')         // Creating an anchor for the download

        // Starting the dowload automatically
        a.setAttribute('href', url)                   // Setting the anchor to the url of the csv file
        a.setAttribute('download', 'state_space_2.csv'); 
        a.click();                                    // Downloading with a click 


        /*
         *
         * Plotting Angles1, Angle2, Time 
         *
         */

        // Creating Fake Canvas for Angles
        const fakeCanvas = document.createElement('canvas')
        document.getElementById('main').append(fakeCanvas)
        for (let i = 0; i < 20; i++) {
            var br = document.createElement('br')
            document.getElementById('main').append(br)
        }
        // fakeCanvas.style.backgroundColor = "white"

        const timeValues = [];
        const theta1Values = [];
        const theta2Values = [];
        this.angles.forEach(
            (item, index) => {
                if (index == 0) return;
                const values = item.split(',')
                theta1Values.push(values[0])
                theta2Values.push(values[1])
                timeValues.push(values[2])
            }
        )

        var myChart = new Chart( 
            fakeCanvas,
            {
          type: "line",
          data: {
            labels: timeValues,
            datasets: [{
                label: "theta1",
                lineTension: 1,
              data: theta1Values,
              borderColor: "red",
              fill: false
            },{
              label: "theta2",
              data: theta2Values,
              borderColor: "green",
              fill: false
            }]
          }
        });


        /*
         *
         * Plotting Energy, Time 
         *
         */

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


        /*
         *
         *  Plotting State Space 1:
         *
         *  With lagrangian mechanics the state space is (q, dotq), where
         *  q1 is the angle of the first rod (angle1)
         *  dotq1 is the angular velocity of the first rod (angleVel1) 
         *  
         */

        // Creating Fake Canvas for State Space 1
        const stateSpaceCanvas1 = document.createElement('canvas')
        document.getElementById('main').append(stateSpaceCanvas1)
        for (let i = 0; i < 20; i++) {
            var br = document.createElement('br')
            document.getElementById('main').append(br)
        }

        // Preparing data that will be plotted
        var data = [] 
        this.dotq1q1.forEach( 
            (item, index) => {
                if (index == 0) return;
                const [dotq1, q1] = item.split(',')
                data.push({
                    x: q1,
                    y: dotq1
                })
        });
        const stateSpace1Data = {
            datasets: [{
                label: 'Spazio delle Fasi 1',
                data: data,
                backgroundColor: 'rgb(255, 99, 132)'
            }]
        }

        // Actually plotting data 
        const stateSpaceCanvas1ChartConfig = {
            type: 'scatter',
            data: stateSpace1Data, 
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom'
                    }
                }
            }
        }
        var myChart = new Chart(
            stateSpaceCanvas1, 
            stateSpaceCanvas1ChartConfig
        )


        /*
         *
         *  Plotting State Space 2:
         *
         *  With lagrangian mechanics the state space is (q, dotq), where
         *  q2 is the angle of the first rod (angle2)
         *  dotq2 is the angular velocity of the first rod (angleVel2) 
         *  
         */

        // Creating Fake Canvas for State Space 2
        const stateSpaceCanvas2 = document.createElement('canvas')
        document.getElementById('main').append(stateSpaceCanvas2)
        for (let i = 0; i < 20; i++) {
            var br = document.createElement('br')
            document.getElementById('main').append(br)
        }

        // Preparing data that will be plotted
        var data = [] 
        this.dotq2q2.forEach( 
            (item, index) => {
                if (index == 0) return;
                const [dotq2, q2] = item.split(',')
                data.push({
                    x: q2,
                    y: dotq2
                })
        });
        const stateSpace2Data = {
            datasets: [{
                label: 'Spazio delle Fasi 2',
                data: data,
                backgroundColor: 'rgb(255, 99, 132)'
            }]
        }

        // Actually plotting data 
        const stateSpaceCanvas2ChartConfig = {
            type: 'scatter',
            data: stateSpace2Data, 
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom'
                    }
                }
            }
        }
        var myChart = new Chart(
            stateSpaceCanvas2, 
            stateSpaceCanvas2ChartConfig
        )


    }


}

