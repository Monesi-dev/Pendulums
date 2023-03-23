class DoublePendulum extends Pendulum {

    constructor({ mass1, length1, angle1, mass2, length2, angle2, gravity, dt, ctx, ctxPlot, color, trajectory }) {

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

    }

    // This Function computes the new angles and velocities
    calculate() {

        // Shortcuts to make the Math look cleaner without many "this." or "Math."
        const { sin, cos } = Math;
        const { mass1, length1, angle1, angleVel1, mass2, length2, angle2, angleVel2, dt, gravity } = this;

        // This will be useful when Plotting the Angles against Time
        this.oldAngle1 = this.angle1;
        this.oldAngle2 = this.angle2;
        this.currentTime += dt;

        // Computes the Angular Accelerations of the First Rod
        const chunk1 = -sin(angle1 - angle2) * mass2 * length2 * angleVel2 ** 2;
        const chunk2 = -(mass1 + mass2) * gravity * sin(angle1);
        const chunk3 = length1 * (mass1 + mass2) + mass2 * length1 * cos(angle1 - angle2) ** 2;
        this.angleAccel1 = (chunk1 + chunk2) / chunk3;

        // Computes the Angular Accelerations of the First Rod
        const chunk4 = length1 * sin(angle1 - angle2) * (mass1 + mass2) * angleVel1 ** 2;
        const chunk5 = -gravity * sin(angle2) * (mass1 + mass2);
        const chunk6 = length2 * (mass1 + mass2) - mass2 * length2 * cos(angle1 - angle2) ** 2;
        this.angleAccel2 = (chunk4 + chunk5) / chunk6;

        // Computes Velocities and Angles of both Rods
        this.angleVel1 += this.angleAccel1 * dt;
        this.angle1 += this.angleVel1 * dt;
        this.angleVel2 += this.angleAccel2 * dt;
        this.angle2 += this.angleVel2 * dt;

        // Computes X and Y of the two Masses
        this.x1 = length1 * sin(this.angle1);
        this.y1 = - length1 * cos(this.angle1);
        this.x2 = this.x1 + length2 * sin(this.angle2);
        this.y2 = this.y1 - length2 * cos(this.angle2);

        // Stores Variables used to Draw the Trajectory of the Second Mass
        this.trajectoryPoints.push({x: this.x2, y: this.y2});
        this.finalTrajectoryPoints.push({x: this.x2, y: this.y2});
        if (this.trajectoryPoints.length > this.maxTrajectorySize) this.trajectoryPoints.shift();

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


}

