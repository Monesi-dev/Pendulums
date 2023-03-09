class DoublePendulum extends Pendulum {

    constructor({mass1, length1, angle1, mass2, length2, angle2, gravity, dt, ctx, color }) {
        
        // Invoke the Constructor of Base Class
        super()                         // Constructor of Pendulum Class
        
        // Initialize Variables
        this.mass1 = mass1;             // Mass attached to the end of the First Rod
        this.length1 = length1;         // Length of the First Rod
        this.angle1 = angle1;           // Initial Angle of the First Rod (Y-axis)
        this.angleVel1 = 0              // Initial Angular Velocity of the First Rod
        this.angleAccel1 = 0            // Initial Angular Acceleration of the First Rod
        this.mass2 = mass2;             // Mass attached to the end of the Second Rod
        this.length2 = length2;         // Length of the Second Rod
        this.angle2 = angle2;           // Initial Angle of the Second Rod (Y-axis)
        this.angleVel2 = 0              // Initial Angular Velocity of the Second Rod
        this.angleAccel2 = 0            // Initial Angular Acceleration of the Second Rod
        this.gravity = gravity          // Value of Gravitational Acceleration
        this.dt = dt                    // The Time Step used for Integration
        this.ctx = ctx                  // Something needed to draw the Pendulum
        this.color = color              // The Color of the Pendulum

    }

    // This Function computes the new angles and velocities
    calculate() {

        // Shortcuts to make the Math look cleaner without many "this." or "Math."
        const { sin, cos } = Math; 
        const {mass1, length1, angle1, angleVel1, mass2, length2, angle2, angleVel2, dt, gravity} = this;

        // Computes the Angular Accelerations of the First Rod
        const chunk1 = -sin(angle1 - angle2)*mass2*length2*angleVel2**2;
        const chunk2 = -(mass1 + mass2)*gravity*sin(angle1);
        const chunk3 = length1*(mass1 + mass2) + mass2*length1*cos(angle1 - angle2)**2;
        this.angleAccel1 = (chunk1 + chunk2)/chunk3;

        // Computes the Angular Accelerations of the First Rod
        const chunk4 = length1*sin(angle1 - angle2)*(mass1 + mass2)*angleVel1**2;
        const chunk5 = -gravity*sin(angle2)*(mass1 + mass2);
        const chunk6 = length2*(mass1 + mass2) - mass2*length2*cos(angle1 - angle2)**2;
        this.angleAccel2 = (chunk4 + chunk5)/chunk6;

        // Computes Velocities and Angles of both Rods
        this.angleVel1 += this.angleAccel1*dt;
        this.angle1 += this.angleVel1*dt;
        this.angleVel2 += this.angleAccel2*dt;
        this.angle2 += this.angleVel2*dt;

        // Computes X and Y of the two Masses
        this.x1 = length1 * sin(this.angle1);
        this.y1 = - length1 * cos(this.angle1);
        this.x2 = this.x1 + length2 * sin(this.angle2);
        this.y2 = this.y1 - length2 * cos(this.angle2);

    }

    draw() {

        // Shortcuts to make the following lines cleaner by avoiding repeating "this." or "Math."
        const { PI } = Math;
        const { x1, y1, x2, y2, ctx } = this;
        const suspensionPointX = 0;                 // X of the Point where Pendulum is Hung
        const suspensionPointY = 0;                 // Y of the Point where Pendulum is Hung
        const circleRadius = 13;                    // Radius of the two Masses
        ctx.lineWidth = 10;                         // Thickness of the Rod
        ctx.strokeStyle = this.color;               // Color of the Rod
        ctx.fillStyle = this.color;                 // Color of the Masses


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
        
    }
}

