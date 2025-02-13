
class Vector2{
  constructor(x, y){
    this.x = x
    this.y = y
    this.drawingVectors = []
  }
}
class Function{
  constructor({equation}){
    this.name = getNextFunctionName()
    this.equation = equation
    this.drawingVectors = []
    this.strokeColor = randomColor()
  }
  evaluateExpression(x){
    return math.evaluate(this.equation, {x: x})
  }
}
class Graph {
  constructor({spanX, spanY, zeroPos, functions=[], evaluationIncrements=50,bgColor = '#CEF0EE', axisStrokeWeight = 2, funcStrokeWeight = 3}) {
    this.spanX = spanX
    this.spanY = spanY
    this.zeroPos = zeroPos
    this.functions = functions
    this.evaluationIncrements = evaluationIncrements
    this.bgColor = bgColor
    this.incrementSizeX = this.getIncrement(spanX)
    this.incrementSizeY = this.getIncrement(spanY)
    this.axisStrokeWeight = axisStrokeWeight
    this.funcStrokeWeight = funcStrokeWeight
    
    this.isDragging = false
  }
  
  update(){
    this.draw()
  }
  draw(){
    background(this.bgColor)
    if(this.isDragging === false){
      this.drawFunctions()
    }
    this.drawAxisLines()
  }
  drawFunctions(){
    // for(var func of this.functions){
    //   stroke(func.strokeColor)
    //   strokeWeight(this.funcStrokeWeight)
    //   fill(this.bgColor)
    //   beginShape()
    //   let firstVector = func.drawingVectors[0]
    //   let lastVector = func.drawingVectors[func.drawingVectors.length-1]
    //   curveVertex(firstVector.x, firstVector.y)
    //   for(let i = 0; i < func.drawingVectors.length; i++){
    //     let vector = func.drawingVectors[i]
    //     curveVertex(vector.x, vector.y)
    //     //line(firstVector.x, firstVector.y, nextVector.x, nextVector.y)
    //   }
    //   curveVertex(lastVector.x, lastVector.y)
    //   endShape()
    //   fill('black')
    // }
    for(var func of this.functions){
      stroke(func.strokeColor)
      strokeWeight(this.funcStrokeWeight)
      for(let i = 0; i < func.drawingVectors.length - 1; i++){
        let firstVector = func.drawingVectors[i]
        let nextVector = func.drawingVectors[i+1]
        line(firstVector.x, firstVector.y, nextVector.x, nextVector.y)
      }
    }
  }
  drawAxisLines(){
    strokeWeight(this.axisStrokeWeight)
    stroke('black');
    line(0, this.zeroPos.y, canvasX, this.zeroPos.y) // X axis
    line(this.zeroPos.x, 0, this.zeroPos.x, canvasY) // Y axis
    noStroke()
    textSize(10)
    textAlign(RIGHT);
    text('0', this.zeroPos.x - 5, this.zeroPos.y + 10)
    stroke('gray');
    strokeWeight(1);
    // Draw Vertical Lines positive side
    let zeroXOffset = this.canvasToCoordinateX(this.zeroPos.x)
    let zeroYOffset = this.canvasToCoordinateY(this.zeroPos.y)
    for(let i = 0; i <= this.spanX/2 - zeroXOffset; i += this.incrementSizeX){
      if(i === 0){
        continue
      }
      strokeWeight(1);
      stroke('gray');
      let xCoordinate = this.coordinateXToCanvas(i)
      line(xCoordinate, 0, xCoordinate, canvasY)
      noStroke()
      text(i, xCoordinate - 5, this.zeroPos.y + 10)

    }
    // Draw Vertical Lines negative side
    for(let i = 0; i >= -(this.spanX/2)-zeroXOffset; i -= this.incrementSizeX){
      if(i === 0){
        continue
      }
      strokeWeight(1);
      stroke('gray');
      let xCoordinate = this.coordinateXToCanvas(i)
      line(xCoordinate, 0, xCoordinate, canvasY)
      noStroke()
      text(i, xCoordinate - 5, this.zeroPos.y + 10)

    }
    // Draw Horizontal Lines positive side
    for(let i = 0; i <= this.spanY/2 - zeroYOffset; i += this.incrementSizeY){
      if(i === 0){
        continue
      }
      strokeWeight(1);
      stroke('gray');
      let yCoordinate = this.coordinateYToCanvas(i)
      line(0, yCoordinate, canvasX, yCoordinate)
      noStroke()
      text(i, this.zeroPos.x - 5, yCoordinate + 10)

    }
    // Draw Horizontal Lines negative side
    for(let i = 0; i >= -(this.spanY/2)-zeroYOffset; i -= this.incrementSizeY){
      if(i === 0){
        continue
      }
      strokeWeight(1);
      stroke('gray');
      let yCoordinate = this.coordinateYToCanvas(i)
      line(0, yCoordinate, canvasX, yCoordinate)
      noStroke()
      text(i, this.zeroPos.x - 5, yCoordinate + 10)

    }
  }
  getIncrement(span) {
    // Calculate the base increment dynamically
    let exponent = Math.floor(Math.log10(span)) - 1;
    let baseIncrement = Math.pow(10, exponent);
    
    // Adjust the increment to fit the pattern 1, 2, 5, 10, 20, 50, etc.
    let possibleIncrements = [1, 2, 5];
    
    for (let inc of possibleIncrements) {
        if (span / (baseIncrement * inc) <= 20) {
            return baseIncrement * inc;
        }
    }
    
    return baseIncrement * 10;
  }
  coordinateXToCanvas(x) {
    return (x / this.spanX) * canvasX + this.zeroPos.x;
  }
  coordinateYToCanvas(y){
    return ((y / this.spanY) * -canvasY + this.zeroPos.y);
  }
  canvasToCoordinateX(x) {
    return ((x - canvasX/2) / canvasX) * this.spanX;
  }
    
  canvasToCoordinateY(y) {
    return ((y - canvasY/2) / -canvasY) * this.spanY;
  }
  calculateDrawingVectors(func){
    // Create Coordinates where the function should be drawn
    let incrementSize = this.spanX / this.evaluationIncrements
    let startValue = -this.spanX/2 - this.canvasToCoordinateX(this.zeroPos.x)
    let xIteration = startValue
    let drawingVectors = []
    for(let i = 0; i <= this.evaluationIncrements; i++){
      let yIteration = func.evaluateExpression(xIteration)
      let drawingVector = new Vector2(this.coordinateXToCanvas(xIteration), this.coordinateYToCanvas(yIteration))
                                      
      drawingVectors.push(drawingVector)
      xIteration += incrementSize
    }
    func.drawingVectors = drawingVectors
  }
  addFunction(func){
    this.calculateDrawingVectors(func)
    this.functions.push(func)
  }
  recalculateAllFunctions(){
    for(var func of this.functions){
      this.calculateDrawingVectors(func)
    }
  }
    
}

let canvasX = 500
let canvasY = 500
let graphArgs = {
  spanX: 20,
  spanY: 20,
  zeroPos: new Vector2(250, 250),
  evaluationIncrements: 200
}
let graph = new Graph(graphArgs)

function setup() {
  let canvas  = createCanvas(canvasX, canvasY);
  canvas.parent("canvas-container"); // Attach canvas to container
}

function draw() {
  graph.update()
}
// Code for moving graph
let startZeroPosX = graph.zeroPos.x
let startZeroPosY = graph.zeroPos.y
let startPosX = 0
let startPosY = 0
function mouseDragged(){
  if(graph.isDragging === false){
    startPosX = mouseX
    startPosY = mouseY
  }
  graph.isDragging = true
  graph.zeroPos.x = startZeroPosX - (startPosX - mouseX)
  graph.zeroPos.y = startZeroPosY - (startPosY - mouseY)
}
function mouseReleased() {
  graph.isDragging = false
  graph.recalculateAllFunctions()
  startZeroPosX = graph.zeroPos.x
  startZeroPosY = graph.zeroPos.y
}
// This function gets called from the input bar
function evaluateInput(value){
  // Check if input is a function
  if(!value.includes(":")){
    if(hasOnlyXOrNoVariables(value)){
      let func = new Function({equation: value})
      addFunctionElement(func)
      graph.addFunction(func)
    }
    else {
      alert("Something is wrong with the input: " + value)
    }
    
  }
}


function hasOnlyXOrNoVariables(expression) {
// Parse the expression into a tree
const node = math.parse(expression);

// List of recognized math functions
const functions = new Set(Object.keys(math));

// Collect variables from the expression
const variables = new Set();

node.traverse(function (node) {
    if (node.isSymbolNode && !functions.has(node.name)) {
        variables.add(node.name);
    }
});

// Return true if the expression contains 0 or only "x"
return variables.size === 0 || (variables.size === 1 && variables.has("x"));
}
// Get random color with high contrast
function randomColor(){
  let rgbColorArray = [255, 0, random(255)]
  shuffleArray(rgbColorArray)
  return color(rgbColorArray[0], rgbColorArray[1], rgbColorArray[2])
}

function getNextFunctionName() {
  const alphabet = "fghijklmnoqrstuvw"; // Allowed letters
  let existingNames = new Set(graph.functions.map(func => func.name));

  // Function to generate name sequences similar to Excel columns
  function generateNextName(currentName) {
    let nameArray = currentName.split(""); // Convert name to an array
    let i = nameArray.length - 1; // Start from the last character

    while (i >= 0) {
      let nextCharIndex = alphabet.indexOf(nameArray[i]) + 1;

      if (nextCharIndex < alphabet.length) {
        nameArray[i] = alphabet[nextCharIndex]; // Increment the last character
        return nameArray.join("");
      } else {
        nameArray[i] = alphabet[0]; // Reset current character and move to next
        i--;
      }
    }

    // If all characters are 'z', add another letter
    return alphabet[0] + nameArray.join("");
  }

  // Start with 'f'
  let newName = alphabet[0];

  // Find the next available unique name
  while (existingNames.has(newName)) {
    newName = generateNextName(newName);
  }

  return newName;
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */ // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
  for (var i = array.length - 1; i >= 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}

//Function getting called to update span

function updateXSpan(value){
  graph.spanX = value
  graph.incrementSizeX = graph.getIncrement(value)
  graph.recalculateAllFunctions()
}

function updateYSpan(value){
  graph.spanY = value
  graph.incrementSizeY = graph.getIncrement(value)
  graph.recalculateAllFunctions()
}
function deleteFuncFromGraph(funcName){
  print(funcName)
  graph.functions = graph.functions.filter(item => funcName !== item.name)
}

function addFunctionElement(func) {
  // Get the functions list container
  let functionsList = document.getElementById("functions-container");

  // Create the function element
  let functionElement = document.createElement("div");
  functionElement.classList.add("function-element");

  // Create the color box
  let colorBox = document.createElement("div");
  colorBox.classList.add("color-box");
  colorBox.style.backgroundColor = func.strokeColor; // Set color dynamically

  // Create the function text
  let functionText = document.createElement("span");
  functionText.classList.add("function-text");
  functionText.textContent = func.name + "(x) = " + func.equation;

  // Create the 3-dot menu button
  let menuButton = document.createElement("button");
  menuButton.classList.add("menu-button");
  menuButton.innerHTML = "⋮";

  // Create the dropdown menu
  let dropdownMenu = document.createElement("div");
  dropdownMenu.classList.add("dropdown-menu");

  // Create Edit button
  let editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.onclick = function () {
    alert("Edit Function: " + func.equation);
  };

  // Create Delete button
  let deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.onclick = function () {
    deleteFuncFromGraph(func.name)
    functionsList.removeChild(functionElement);
  };

  // Append buttons to dropdown
  dropdownMenu.appendChild(editButton);
  dropdownMenu.appendChild(deleteButton);

  // Append all elements
  functionElement.appendChild(colorBox);
  functionElement.appendChild(functionText);
  functionElement.appendChild(menuButton);
  functionElement.appendChild(dropdownMenu);

  // Append function element to the list
  functionsList.appendChild(functionElement);

  // Add event listener to show/hide dropdown
  menuButton.addEventListener("click", function () {
    dropdownMenu.style.display =
      dropdownMenu.style.display === "block" ? "none" : "block";
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function (event) {
    if (!functionElement.contains(event.target)) {
      dropdownMenu.style.display = "none";
    }
  });
}
