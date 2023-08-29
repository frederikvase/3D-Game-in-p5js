// Variables for the Camera
let dir = [1, 0, 0,  // z-direction
           0, 1, 0,  // y-direction
           0, 0, 1]; // x-direction

let cam = [0, 0, 0]; // Camera position

// Variables for movement
let moveSpeed = 4; 
let xMove = 0;
let yMove = 0;
let zMove = 0;

// Variables for rotation
let xRot = 0;
let yRot = 0;
let rotSpeed = 6;
let rotVec = [1, 0];

// Variable for enemies
let enemySpeed = 2;
let enemyRadius = 30;
let enemySpawnDistance = 500;

let enemyCount = 20;
let enemyPos = Array(enemyCount * 3).fill(1000);
let enemyVel = Array(enemyCount * 3).fill(0);

// Textures
let foxMan;

// Other variables
let size = 900; // Size of box

function preload()
{
  foxMan = loadImage("textures/foxman.png");
}

function setup() 
{
  createCanvas(500, 500, WEBGL);
  angleMode(DEGREES);

  // Calculate the 2D rotation vector so you don't 
  // have to calculate cos(rotSpeed) every frame
  rotVec = [cos(rotSpeed), sin(rotSpeed)];
}

function draw() 
{
  background(40);

  // Handle camera movement
  cameraMovement();

  // Customize objects
  noStroke();
  lights();

  // Handle collisions with box
  handleBoxCollisions();

  // Update enemies
  for (let i = 0; i < enemyCount; i++)
  {
    // Enemy movement
    enemyPos[i * 3] += enemyVel[i * 3];
    enemyPos[i * 3 + 1] += enemyVel[i * 3 + 1];
    enemyPos[i * 3 + 2] += enemyVel[i * 3 + 2];

    // Respawn enemy if it is out of bounds
    if (abs(enemyPos[i * 3]) > 500 || 
        abs(enemyPos[i * 3 + 1]) > 500 || 
        abs(enemyPos[i * 3 + 2]) > 500)
      initEnemies(i);

    // Check for enemy / player collision
    if (pow(enemyPos[i * 3] - cam[0], 2) + 
        pow(enemyPos[i * 3 + 1] - cam[1], 2) + 
        pow(enemyPos[i * 3 + 2] - cam[2], 2) < pow(enemyRadius + 40, 2))
    {
      // A collision has occoured!
      restartScene();
      return;
    }

    // Draw enemies
    push();
    translate(enemyPos[i * 3], enemyPos[i * 3 + 1], enemyPos[i * 3 + 2]);
    sphere(enemyRadius);
    pop();
  }

  // Create a box with size
  addPlane(0, 0,  size/2, size, foxMan,  0, 0);
  addPlane(0, 0, -size/2, size, foxMan,  0, 0);
  addPlane(0,  size/2, 0, size, foxMan, 90, 0);
  addPlane(0, -size/2, 0, size, foxMan, 90, 0);
  addPlane( size/2, 0, 0, size, foxMan, 0, 90);  
  addPlane(-size/2, 0, 0, size, foxMan, 0, 90);
}

function addPlane(x, y, z, size, img, rotX, rotY)
{
  push();

  translate(x, y, z);
  rotateX(rotX);
  rotateY(rotY);
  
  texture(img);
  plane(size, size);

  pop();
}

function cameraMovement()
{
  // Handle movement inputs
  yMove = keyIsDown(SHIFT) - keyIsDown(32);
  xMove = keyIsDown(68)    - keyIsDown(65);
  zMove = keyIsDown(87)    - keyIsDown(83);

  // Handle rotation inputs
  xRot = keyIsDown(UP_ARROW)    - keyIsDown(DOWN_ARROW);
  yRot = keyIsDown(RIGHT_ARROW) - keyIsDown(LEFT_ARROW);

  // Update camera position
  cam = [cam[0] + moveSpeed * (zMove * dir[0] + yMove * dir[3] + xMove * dir[6]),
         cam[1] + moveSpeed * (zMove * dir[1] + yMove * dir[4] + xMove * dir[7]),
         cam[2] + moveSpeed * (zMove * dir[2] + yMove * dir[5] + xMove * dir[8])];

  // Update rotation
  if (xRot != 0) // Rotation around X-axis
  {
    dir = [(dir[0]*rotVec[0] - xRot * dir[3]*rotVec[1]), // X-axis
           (dir[1]*rotVec[0] - xRot * dir[4]*rotVec[1]), 
           (dir[2]*rotVec[0] - xRot * dir[5]*rotVec[1]),
           (dir[3]*rotVec[0] + xRot * dir[0]*rotVec[1]), // Y-axis
           (dir[4]*rotVec[0] + xRot * dir[1]*rotVec[1]), 
           (dir[5]*rotVec[0] + xRot * dir[2]*rotVec[1]),
           (dir[6]),                                     // Z-axis
           (dir[7]),
           (dir[8])];
  }
  if (yRot != 0) // Rotation around Y-axis
  {
    dir = [(dir[0]*rotVec[0] + yRot * dir[6]*rotVec[1]), // X-axis
           (dir[1]*rotVec[0] + yRot * dir[7]*rotVec[1]), 
           (dir[2]*rotVec[0] + yRot * dir[8]*rotVec[1]),
           (dir[3]),                                     // Y-axis
           (dir[4]), 
           (dir[5]),
           (dir[6]*rotVec[0] - yRot * dir[0]*rotVec[1]), // Z-axis
           (dir[7]*rotVec[0] - yRot * dir[1]*rotVec[1]),
           (dir[8]*rotVec[0] - yRot * dir[2]*rotVec[1])];
  }

  // Update camera
  camera(cam[0],          cam[1],          cam[2], 
         cam[0] + dir[0], cam[1] + dir[1], cam[2] + dir[2], 
         dir[3],          dir[4],          dir[5]);
}

function handleBoxCollisions()
{
  // Check for collisions with the box along all three axies
  for (let i = 0; i < 3; i++)
  {
    if (cam[i] > size / 2 - 60)
      cam[i] = size / 2 - 60;
    else if (cam[i] < -size / 2 + 60)
      cam[i] = -size / 2 + 60;
  }
}

function restartScene()
{
  cam = [0, 0, 0];
  dir = [1, 0, 0,
         0, 1, 0,
         0, 0, 1];
  // Set enemies to new positions
  for (let i = 0; i < enemyCount; i++)
    initEnemies(i);
}

function initEnemies(i)
{
  // Initialize enemy positions and velocities
  let axis = random([0, 1, 2]);
  if (axis == 0) // X-axis
  {
    enemyPos[i * 3] = 500 * random([1, -1]);
    enemyPos[i * 3 + 1] = random(-500, 500);
    enemyPos[i * 3 + 2] = random(-500, 500);

    enemyVel[i * 3] = -enemyPos[i * 3] / 500 * enemySpeed;
    enemyVel[i * 3 + 1] = random(-enemySpeed * 0.5, enemySpeed * 0.5);
    enemyVel[i * 3 + 2] = random(-enemySpeed * 0.5, enemySpeed * 0.5);
  }
  else if (axis == 1) // Y-axis
  {
    enemyPos[i * 3] = random(-500, 500);
    enemyPos[i * 3 + 1] = 500 * random([1, -1]);
    enemyPos[i * 3 + 2] = random(-500, 500);

    enemyVel[i * 3] = random(-enemySpeed * 0.5, enemySpeed * 0.5);
    enemyVel[i * 3 + 1] = -enemyPos[i * 3] / 500 * enemySpeed;
    enemyVel[i * 3 + 2] = random(-enemySpeed * 0.5, enemySpeed * 0.5);

  }
  else // Z-axis
  {
    enemyPos[i * 3] = random(-500, 500);
    enemyPos[i * 3 + 1] = random(-500, 500);
    enemyPos[i * 3 + 2] = 500 * random([1, -1]);

    enemyVel[i * 3] = random(-enemySpeed * 0.5, enemySpeed * 0.5);
    enemyVel[i * 3 + 1] = random(-enemySpeed * 0.5, enemySpeed * 0.5);
    enemyVel[i * 3 + 2]= -enemyPos[i * 3 + 2] / 500 * enemySpeed;
  }
}