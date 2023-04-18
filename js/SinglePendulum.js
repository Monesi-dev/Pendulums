class SinglePendulum extends Pendulum {

    constructor({ fixedPointX, fixedPointY, length, mass, angle, gravity, dt, ctx, ctxPlot, color, trajectory }) {

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

    }

    // This Function calculates given a tiny variation of time the new angle, velocity and acceleration
    calculate() {

        // Gets some Variable so that code is more readable
        const { sin, cos, abs, PI } = Math;
        const { mass, angle, gravity, length, dt, numApprox, fixedPointX, fixedPointY } = this;

        // Updates Values used to Plot the Angle
        this.oldAngle = this.angle;
        this.currentTime += dt;

        // Computes Acceleration, Velocity and Angular Position
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
            if (this.currentTime > maxTime) this.drawFinalTrajectory = true;
            
        }

        return 0;

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
