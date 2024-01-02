class Ball {
    constructor(x, y, radius, color, label) {
      // Define the properties of the Ball
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
  
      // Create the ball as a Matter.js body
      this.body = Bodies.circle(x, y, radius, {
        restitution: 0.9, // High restitution makes the ball bouncy
        friction: 0.005, // Low friction to slide easily
        density: 0.05, // Density can affect the mass of the ball
        label: label || 'ball', // Label helps with collision filtering
      });
  
      // Add the ball to the world
      World.add(world, this.body);
    }
  
    show() {

      const pos = this.body.position;
      const angle = this.body.angle;

      push();
      translate(pos.x, pos.y); // Translate to the position of the ball
      rotate(angle); // Rotate to the angle of the ball

      // Drawing the ball
      stroke(0); // Black stroke for the contour line
      strokeWeight(1);
      fill(this.color);
      ellipse(0, 0, this.radius * 2); // Draw the ball

      // Adding light reflection
      let reflectionSize = this.radius / 4;
      fill(255, 255, 255, 128); // Semi-transparent white
      noStroke(); // No stroke for the reflection
      ellipse(this.radius / 2, -this.radius / 2, reflectionSize, reflectionSize);

      pop();
    }
  }