/**
 * Setup the canvas element
 */
function setup()
{
  gamestate = 0;
  baseCellSize = 0;
  controlIconSize = 0;
  zoomLevel = 1.0;
  minZoom = 0.3;
  maxZoom = 1.6;
  gridWidth = 250;  
  gridHeight = 250;

  // Device type detection using user agent with enhanced pattern
  const isMobile = /Mobile|Android|iPhone|iPad|iPod|iOS/i.test(navigator.userAgent);
  
  // Log detailed device information for troubleshooting
  console.log("User Agent:", navigator.userAgent);
  console.log("Is mobile device:", isMobile);

  // Adjust grid size for mobile devices to prevent canvas size warnings
  if (isMobile) {
    // Conservative grid size reduction to ensure safety
    gridWidth = 80;   // Further reduced for iPhone 16's screen
    gridHeight = 80;
    
    // Conservative cell size and zoom settings
    zoomLevel = 1.0;  // Further reduced base zoom
    maxZoom = 1.6;    // Limited zoom capability
    minZoom = 0.2;
  }
  
  viewportX = 0;
  viewportY = 0;

  baseCellSize = 40;
  controlIconSize = 40;
  
  // Calculate effective cell size
  cellsize = baseCellSize * zoomLevel;
  interval = 100;

  document.getElementById('play').addEventListener('click',play)
  document.getElementById('play').style.height = controlIconSize + 'px';
  document.getElementById('pause').addEventListener('click',pause);
  document.getElementById('pause').style.height = controlIconSize + 'px';
  document.getElementById('step').addEventListener('click',step);
  document.getElementById('step').style.height = controlIconSize + 'px';
  document.getElementById('ffwd').addEventListener('click',ffwd);
  document.getElementById('ffwd').style.height = controlIconSize + 'px';
  document.getElementById('restart').addEventListener('click',restart);
  document.getElementById('restart').style.height = controlIconSize + 'px';
  document.getElementById('help').addEventListener('click',help);
  document.getElementById('help').style.height = cellsize+'px';
  document.getElementById('zoomIn').style.height = cellsize+'px';
  document.getElementById('zoomOut').style.height = cellsize+'px';
  document.getElementById('resetZoom').style.height = cellsize+'px';
  
  document.getElementById('zoomIn').addEventListener('click', zoomIn);
  document.getElementById('zoomOut').addEventListener('click', zoomOut);
  document.getElementById('resetZoom').addEventListener('click', resetZoom);
  
  emptyCell = new Image();
  emptyCell.src = 'img/empty.png';
  cell = new Image();
  cell.src = 'img/cell.png';



  var canvas_wrapper = document.getElementById('canvas-wrapper');
  // Use dynamic grid size and account for viewport
  canvas_wrapper.innerHTML = '<canvas id="board" width= "' + gridWidth*cellsize + '" height="'+ gridHeight*cellsize +'"></canvas>';
  var canvas = document.getElementById('board');
  canvas.addEventListener("mousedown",function(e){
    handleClick(canvas,e);
  })

	c = canvas.getContext('2d');
  
  renderer = setTimeout(function draw()
  {
    render();

    renderer = setTimeout(draw,interval);
  }, interval);

}


var render = function()
{
  if (gamestate) {
    console.time('render');
  }
  // Clear main canvas
  c.clearRect(0, 0, c.canvas.width, c.canvas.height);
  
  // Calculate visible area based on viewport
  const startX = Math.max(0, Math.floor(viewportX / cellsize));
  const startY = Math.max(0, Math.floor(viewportY / cellsize));
  const endX = Math.min(grid.gridXsize, startX + Math.ceil(c.canvas.width / cellsize) + 1);
  const endY = Math.min(grid.gridYsize, startY + Math.ceil(c.canvas.height / cellsize) + 1);
  
  // Clear canvas
  c.clearRect(0, 0, c.canvas.width, c.canvas.height);
  // Fill background with white
  c.fillStyle = '#ffffff';
  c.fillRect(0, 0, c.canvas.width, c.canvas.height);
  
  // Draw gridlines
  c.strokeStyle = '#c2c2c2';
  c.lineWidth = 4 * (cellsize / 20); 
  c.beginPath();
  
  // Vertical lines 
  for (let x = 0; x <= gridWidth * cellsize; x += cellsize) {
    c.moveTo(x + 0.5, 0);
    c.lineTo(x + 0.5, gridHeight * cellsize);
  }
  
  // Horizontal lines 
  for (let y = 0; y <= gridHeight * cellsize; y += cellsize) {
    c.moveTo(0, y + 0.5);
    c.lineTo(gridWidth * cellsize, y + 0.5);
  }
  
  c.stroke();
  
  // Draw visible live cells
  for (const liveCell of grid.currentState) {
    const [x, y] = liveCell.split(',').map(Number);
    if (x >= startX && x < endX && y >= startY && y < endY) {
      const drawX = x * cellsize - viewportX;
      const drawY = y * cellsize - viewportY;
      c.drawImage(cell, drawX, drawY, cellsize, cellsize);
    }
  }

  if (gamestate){
    console.time('nextStep');
    grid.nextStep();
    console.timeEnd('nextStep');
    
  }
  if (gamestate) {
    console.timeEnd('render');
  }
}

function populateSelect(){

  var select = document.getElementById("presets");
  var i=0;
  var s=0;
  for (var key in grid.presets){
    var opt = document.createElement("option");
    opt.value = key;
    opt.innerHTML = key;
    presets.appendChild(opt);
    if(key=="glider"){s=i};
    i++;
  }
  select.selectedIndex=s;

  document.getElementById("presets").addEventListener('change', function() {
    if (confirm('Changing the pattern will reset the game. Apply new pattern?')) {
      restart();
    }
  });
}
function handleClick(c,e){
  var rect = c.getBoundingClientRect();
  // Account for viewport and zoom
  const gridX = Math.floor((e.clientX - rect.left + viewportX) / cellsize);
  const gridY = Math.floor((e.clientY - rect.top + viewportY) / cellsize);

  var x = Math.max(0, Math.min(gridX, grid.gridXsize - 1));
  var y = Math.max(0, Math.min(gridY, grid.gridYsize - 1));
  console.log(x,y);
  if (!gamestate){
  const cell = `${x},${y}`;
  if (grid.currentState.has(cell)) {
    grid.currentState.delete(cell);
  } else {
    grid.currentState.add(cell);
  }
  }
}

function resized(){
  clearInterval(renderer);
  setup();
}

function play(){
  interval = 400;
  gamestate = 1;
}

function pause(){

  interval = 100;
  gamestate = 0;
}

function step(){
  if (gamestate == 0){
    grid.nextStep();
  }
}

function ffwd(){
  interval = 100;
  gamestate = 1;
}

function restart(){
  var select = document.getElementById("presets");
  var preset = select.options[select.selectedIndex].value;
  grid.loadGrid(grid.presets[preset]);
  gamestate = 0;
}

function help(){
  if (document.getElementById("overlay").style.display=="block"){
  document.getElementById("overlay").style.display="none";
  }else{
  document.getElementById("overlay").style.display="block";
}
}

// Zoom functions
function zoomIn() {
  zoomLevel = Math.min(zoomLevel * 1.2, maxZoom);
  console.log("Zoom level: " + zoomLevel);
  applyZoom();
}

function zoomOut() {
  zoomLevel = Math.max(zoomLevel / 1.2, minZoom);
  console.log("Zoom level: " + zoomLevel);
  applyZoom();
}

function resetZoom() {
  zoomLevel = 1.0;
  applyZoom();
}

function applyZoom() {
  // Update cell size based on new zoom level
  cellsize = baseCellSize * zoomLevel;
  
  const canvas = document.getElementById('board');
  canvas.width = gridWidth * cellsize;
  canvas.height = gridHeight * cellsize;
  
  const displayWidth = c.canvas.width;
  const displayHeight = c.canvas.height;
  
  const maxViewportX = Math.max(0, canvas.width - displayWidth);
  const maxViewportY = Math.max(0, canvas.height - displayHeight);
  
  viewportX = Math.min(viewportX, maxViewportX);
  viewportY = Math.min(viewportY, maxViewportY);
  
  render();
}

setup();

window.addEventListener( 'resize', resized );

grid = new Grid(gridWidth, gridHeight);
coords = grid.presets['glider'];
grid.loadGrid(coords);
populateSelect();
