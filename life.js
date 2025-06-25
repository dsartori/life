// Life.js (c) 2020 Douglas Sartori

// grid object
function Grid(x,y){
  this.gridXsize = x;
  this.gridYsize = y;
  
  // Use sparse sets to store live cells for better performance
  this.currentState = new Set();
  this.nextState = new Set();
  
  // Store presets
  this.presets = {
    "baker":[
     ["3","3"],
     ["4","2"],
     ["4","3"],
     ["5","3"],
     ["6","4"],
     ["7","5"],
     ["8","6"],
     ["9","7"],
     ["10","8"],
     ["11","9"],
     ["12","10"],
     ["13","11"],
     ["14","12"],
     ["15","13"],
     ["16","14"],
     ["17","15"],
     ["18","14"],
     ["18","15"]],
   "glider":[
     ["6","3"],
     ["7","3"],
     ["8","3"],
     ["8","2"],
     ["7","1"]],
   "bun":[
     ["8","7"],
     ["8","8"],
     ["9","6"],
     ["9","9"],
     ["10","7"],
     ["10","8"],
     ["10","9"],
     ["11","8"],
     ["11","9"]],
   "clock":[
     ["9","8"],
     ["10","6"],
     ["10","8"],
     ["11","7"],
     ["11","9"],
     ["12","7"]],
   "eater":[
     ["3","3"],
     ["4","1"],
     ["4","3"],
     ["5","2"],
     ["5","3"],
     ["8","8"],
     ["9","6"],
     ["9","8"],
     ["10","7"],
     ["10","8"],
     ["11","10"],
     ["11","11"],
     ["12","10"],
     ["12","12"],
     ["13","12"],
     ["14","12"],
     ["14","13"]],
   "f-pentomino":[
     ["10","7"],
     ["10","6"],
     ["11","7"],
     ["11","8"],
     ["12","7"]],
   "glider-gun":[
     ["1","6"],
     ["1","7"],
     ["2","6"],
     ["2","7"],
     ["11","6"],
     ["11","7"],
     ["11","8"],
     ["12","5"],
     ["12","9"],
     ["13","4"],
     ["13","10"],
     ["14","4"],
     ["14","10"],
     ["15","7"],
     ["16","5"],
     ["16","9"],
     ["17","6"],
     ["17","7"],
     ["17","8"],
     ["18","7"],
     ["21","4"],
     ["21","5"],
     ["21","6"],
     ["22","4"],
     ["22","5"],
     ["22","6"],
     ["23","3"],
     ["23","7"],
     ["25","2"],
     ["25","3"],
     ["25","7"],
     ["25","8"],
     ["35","4"],
     ["35","5"],
     ["36","4"],
     ["36","5"]],
   "pentadecathlon":[
     ["6","8"],
     ["7","8"],
     ["8","8"],
     ["9","8"],
     ["10","8"],
     ["11","8"],
     ["12","8"],
     ["13","8"],
     ["14","8"],
     ["15","8"]],
   "phoenix":[
     ["7","7"],
     ["8","7"],
     ["8","9"],
     ["9","5"],
     ["10","10"],
     ["10","11"],
     ["11","4"],
     ["11","5"],
     ["12","10"],
     ["13","6"],
     ["13","8"],
     ["14","8"]],
   "spaceship":[
     ["7","3"],
     ["7","6"],
     ["8","7"],
     ["9","3"],
     ["9","7"],
     ["10","4"],
     ["10","5"],
     ["10","6"],
     ["10","7"]],
   "tumbler":[
     ["9","5"],
     ["9","11"],
     ["10","4"],
     ["10","6"],
     ["10","10"],
     ["10","12"],
     ["11","4"],
     ["11","7"],
     ["11","9"],
     ["11","12"],
     ["12","6"],
     ["12","10"],
     ["13","6"],
     ["13","7"],
     ["13","9"],
     ["13","10"]]
  };
}

Grid.prototype.nextStep = function(){
  const toCheck = new Set();
  
  // Add all live cells and their neighbors to the check set
  for (const cell of this.currentState) {
    const [x, y] = cell.split(',').map(Number);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nx = (x + dx + this.gridXsize) % this.gridXsize;
        const ny = (y + dy + this.gridYsize) % this.gridYsize;
        toCheck.add(`${nx},${ny}`);
      }
    }
  }

  // Process cells that need to be checked
  this.nextState.clear();
  for (const cell of toCheck) {
    const [x, y] = cell.split(',').map(Number);
    const isActive = this.currentState.has(cell);
    const count = this.countActiveNeighbours(x, y);
    
    // Apply Game of Life rules
    if (isActive && count >= 2 && count <= 3) {
      this.nextState.add(cell);
    } else if (!isActive && count === 3) {
      this.nextState.add(cell);
    }
  }
  
  // Swap state arrays
  const temp = this.currentState;
  this.currentState = this.nextState;
  this.nextState = temp;
}

Grid.prototype.countActiveNeighbours = function(x, y){
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      const nx = (x + dx + this.gridXsize) % this.gridXsize;
      const ny = (y + dy + this.gridYsize) % this.gridYsize;
      if (this.currentState.has(`${nx},${ny}`)) {
        count++;
      }
    }
  }
  return count;
}

Grid.prototype.zeroGrid = function(){
  this.currentState.clear();
  this.nextState.clear();
}

Grid.prototype.loadGrid = function(coords){
  this.zeroGrid();
  for (let i = 0; i < coords.length; i++){
    const x = parseInt(coords[i][0]);
    const y = parseInt(coords[i][1]);
    this.currentState.add(`${x},${y}`);
  }
}

function clone(obj){
  if(obj == null || typeof(obj) != 'object')
    return obj;

  var temp = new obj.constructor(); 
  for(var key in obj)
    temp[key] = clone(obj[key]);

  return temp;
}
