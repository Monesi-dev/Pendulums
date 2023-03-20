class SinglePendulum extends Pendulum {

    constructor({ fixedPointX, fixedPointY, length, mass, angle, gravity, dt, ctx, ctxPlot, color }) {

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

    }

    // This Function calculates given a tiny variation of time the new angle, velocity and acceleration
    calculate() {

        // Updates Values used to Plot the Angle
        this.oldAngle = this.angle;
        this.currentTime += this.dt;

        // Computes Acceleration, Velocity and Angle
        this.angularAcceleration = -Math.sin(this.angle) * this.gravity / this.length;
        this.angularVelocity += this.angularAcceleration * this.dt;
        this.angle += this.angularVelocity * this.dt;

        // Computes X and Y Coordinates of the End of the Pendulum
        this.endPendulumX = this.fixedPointX + this.length * Math.sin(this.angle);
        this.endPendulumY = this.fixedPointY - this.length * Math.cos(this.angle);

    }

    // This Function draws the Pendulum on the Canvas
    draw() {

        // Sets some Variables
        const { PI } = Math;
        const circleRadius = 13;           // Radius of the Mass attached to the end of the Pendulum
        this.ctx.lineWidth = 10;           // Thickness of the Pendulum 
        this.ctx.strokeStyle = this.color; // Color of the Pendulum 
        this.ctx.fillStyle = this.color;   // Color of the Mass attached to the end of the Pendulum 

        // Draws the Fixed Circle in the Suspension Point
        this.ctx.beginPath();
        this.ctx.arc(this.fixedPointX, this.fixedPointY, circleRadius, 0, 2 * PI);
        this.ctx.fill();

        // Draws the Line of the Pendulum
        this.ctx.beginPath();
        this.ctx.moveTo(this.fixedPointX, this.fixedPointY);
        this.ctx.lineTo(this.endPendulumX, this.endPendulumY);
        this.ctx.stroke();

        // Draws the Mass attached to the end of the Pendulum
        this.ctx.beginPath();
        this.ctx.arc(this.endPendulumX, this.endPendulumY, circleRadius, 0, 2 * PI);
        this.ctx.fill();
    }

    // Plots the Angle of the Pendulum
    plot() {

        // Declaring Variables
        const { PI, abs } = Math;
        console.log(PI);
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
