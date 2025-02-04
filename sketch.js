
class Vector2{
  constructor(x, y){
    this.x = x
    this.y = y
    this.drawingVectors = []
  }
}
class Function{
  constructor({equation}){
    this.equation = equation
    this.drawingVectors = []
    this.strokeColor = color(random(255), random(255), random(255))
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
    for(var func of this.functions){
      stroke(func.strokeColor)
      strokeWeight(this.funcStrokeWeight)
      fill('red')
      beginShape()
      let firstVector = func.drawingVectors[0]
      let lastVector = func.drawingVectors[func.drawingVectors.length-1]
      curveVertex(firstVector.x, firstVector.y)
      for(let i = 0; i < func.drawingVectors.length; i++){
        let vector = func.drawingVectors[i]
        curveVertex(vector.x, vector.y)
        //line(firstVector.x, firstVector.y, nextVector.x, nextVector.y)
      }
      curveVertex(lastVector.x, lastVector.y)
      endShape()
      fill('black')
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
  zeroPos: new Vector2(250, 250)
}
let graph = new Graph(graphArgs)

function setup() {
  createCanvas(canvasX, canvasY);
  let sineFunc = new Function({equation: 'x^2'})
  let linearFunc = new Function({equation: 'x+10'})
  graph.addFunction(linearFunc)
  graph.addFunction(sineFunc)
  
  
  
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