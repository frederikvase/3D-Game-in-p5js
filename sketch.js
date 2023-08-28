let radius = 75;

function setup() 
{
  createCanvas(400, 400, WEBGL);
  angleMode(degrees);
}

function draw() 
{
  background(40);
  
  // Customize objects
  noStroke();
  lights();

  // Draw sphere
  sphere(radius);
}