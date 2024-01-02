// All global variables are declared in this file

// matter.js aliases for easy reference
let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;

let engine;
let world;
let balls = [];
let cushions = [];

// Flag to check if the game has started
let modeSelected = false; // Flag to check if a mode has been selected
let cueBallPlaced = false; // Flag to check if the cue ball has been placed
let cueBallPocketed = false; // Cueball pocketed
// Global variable for the cue ball
let cueBall; 
// Variables to track the drag start and end points
let dragStart = null;
let dragging = false;

// Define constants for the table and balls
const pixelsPerFoot = 800 / 12; // Since the tableWidth is 800 pixels and the table length is 12 feet
const tableWidth = 12 * pixelsPerFoot; // This would now be the total canvas width
const tableHeight = tableWidth / 2; // This would now be the total canvas height, as the table is 6 feet in width
const borderWidth = pixelsPerFoot / 5; // Assuming a 6-inch border for the table
const ballDiameter = tableHeight / 36; // Diameter of a snooker ball
const pocketDiameter = ballDiameter * 2.7; // Diameter of the pockets
// Define the pocket cover size and corner radius
const pocketCoverSize = pocketDiameter/1.5; // The size can be the same as the pocket diameter
const xMiddlePocket = tableWidth / 2 - pocketCoverSize / 2;

const cushionDepth = 8; // How far the cushion extends onto the table
const halfTable = tableHeight/2;
// Baulk line, 1/5th from the left side of the table
const baulkLineX = tableWidth / 5;
// The D-line, a semi-circle on the baulk line
const dLineDiameter = tableHeight / 3; // The diameter is one third of the table height
const dLineRadius = dLineDiameter / 2; // Radius is half the diameter
const dLineCenterX = tableWidth / 5; // The center of the D is 1/5th into the table's width
const dLineCenterY = tableHeight / 2; // The center of the D is at half the table's height


// Define a maximum power level for the shot
const MAX_LINE_LENGTH = tableWidth / 5; // The maximum length of the aiming line
const MAX_POWER = 10; // Adjust this value as needed for the maximum power
// Constants for maximum force
const MAX_FORCE_VALUE = 0.2; // Adjust as necessary to prevent tunneling

// Pocket positions
const pockets = [
    { x: borderWidth, y: borderWidth }, // Top-left pocket
    { x: tableWidth - borderWidth, y: borderWidth }, // Top-right pocket
    { x: borderWidth, y: tableHeight - borderWidth }, // Bottom-left pocket
    { x: tableWidth - borderWidth, y: tableHeight - borderWidth }, // Bottom-right pocket
    { x: tableWidth / 2, y: borderWidth }, // Top-middle pocket
    { x: tableWidth / 2, y: tableHeight - borderWidth }, // Bottom-middle pocket
  ];

// Calculate positions based on table proportions for coloured balls
dLineY = tableHeight/3

// Default positions for the colored balls
const coloredBallPositions = {
    yellow: { x: tableWidth / 5, y: dLineY*2 },
    green: { x: tableWidth / 5, y: dLineY },
    brown: { x: tableWidth / 5, y: halfTable },
    blue: { x: tableWidth / 2, y: halfTable },
    pink: { x: (((tableWidth / 5) * 4)-(ballDiameter * 4) - 2) - ballDiameter -1, y: halfTable },
    black: { x: tableWidth - (tableWidth / 11), y: halfTable }
  };

// Keep track of colorballs pocketed variable
let consecutiveColoredBallsPotted = 0;
let displayFaultMessage = false;

let extremeModeFlag = false;

let ballLostMessage = false;
let faultMessageStart = 0;
let faultMessageDuration = 2000; // Duration to display the message in milliseconds

let nextHoleTime = 0;
let holeInterval = 5000; // New hole every 5 seconds

// Global variable to track if Extreme Mode instructions should be displayed
let showExtremeModeInstructions = false;

let collisionMessage = "";
let collisionMessageTime = 0;
const collisionMessageDuration = 2000; // 2 seconds to display message