class SinglePendulum extends Pendulum {

    constructor({fixedPointX, fixedPointY, length, mass, angle, gravity, dt, ctx, color}) {
        
        // Invoking the Constructor of the Base Class
        super()

        // Sets X and Y of the Point of Suspension
        this.fixedPointX = fixedPointX 
        this.fixedPointY = fixedPointY 

        // Sets the remaining Variables
        this.length = length             // Length of the Pendulum
        this.mass = mass                 // Mass attached to the end of the Pendulum
        this.angle = angle               // Initial Angle of the Pendulum with respect to the Y-axis
        this.angularVelocity = 0         // Initial Angular Velocity
        this.angularAcceleration = 0     // Initial Angular Acceleration
        this.gravity = gravity           // Value of Gravitational Acceleration
        this.dt = dt                     // The Time Step used for Integration
        this.ctx = ctx                   // Something needed to draw the Pendulum
        this.color = color               // The Color of the Pendulum

    }

    // This Function calculates given a tiny variation of time the new angle, velocity and acceleration
    calculate() {
        
        // Computes Acceleration, Velocity and Angle
        this.angularAcceleration = -Math.sin(this.angle)*this.gravity/this.length;
        this.angularVelocity += this.angularAcceleration*this.dt;
        this.angle += this.angularVelocity*this.dt;

        // Computes X and Y Coordinates of the End of the Pendulum
        this.endPendulumX = this.fixedPointX + this.length*Math.sin(this.angle);
        this.endPendulumY = this.fixedPointY - this.length*Math.cos(this.angle);

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

}
