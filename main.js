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
  viewportX = 0;
  viewportY = 0;
  if (window.mobileCheck()) {
    baseCellSize = 80;
    controlIconSize = 50;
  } else {
    baseCellSize = 40;
    controlIconSize = 40;
  }

  
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
// https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
function mobileCheck(){
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};


setup();

window.addEventListener( 'resize', resized );

grid = new Grid(gridWidth, gridHeight);
coords = grid.presets['glider'];
grid.loadGrid(coords);
populateSelect();
