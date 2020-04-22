// cell object
function Cell(){
  this.state = 0;
  this.neighbours = [];

  this.addNeighbour = function(neighbour){
    this.neighbours.push(neighbour);
  }

  this.countActiveNeighbours = function(){
    var c = 0;
    for (var i = 0; i<this.neighbours.length; i++){
      c += this.neighbours[i].state;
    }
    return c;
  }

  this.getNextState = function(){
    var nextState = this.state;
    var activeNeighbours = this.countActiveNeighbours();


    // underpopulation
    if (this.state && activeNeighbours < 2){
      nextState = 0;
    }

    // overcrowding
    if (this.state && activeNeighbours > 3){
      nextState = 0;
    }

    // reproduction 
    if ((!this.state) && activeNeighbours == 3){
      nextState = 1;
    }

    return nextState;
  }
}

// grid object
function Grid(x,y){
  this.gridXsize = x;
  this.gridYsize = y;
  this.positions = [];
  this.nextPositions = [];

  var i=0;
  var j=0;

  for (i = 0; i < this.gridXsize; i++){
    var col = [];
    for (j = 0; j < this.gridYsize; j++){
      var cell = new Cell();
      col.push(cell);
    }
    this.positions.push(col);
  }
  this.nextPositions = clone(this.positions);


  // set up neighbours
  var k=0;
  var l=0;
  var m=0;
  var n=0;

  for (m=0; m<this.gridXsize; m++){
    for (n = 0; n<this.gridYsize; n++){
      for (k = -1; k < 2; k++){
        for (l = -1; l < 2; l++){

          var nX = m+k;
          if (nX > (this.gridXsize -1)){
            nX = 0;
          }
          if (nX < 0){
            nX =(this.gridXsize -1);
          }

          var nY = n+l;
          if (nY > (this.gridYsize -1)){
            nY = 0;
          }
          if ((nY) < 0){
            nY=(this.gridYsize -1);
          }

          if (!(k==0 && l==0)){
            this.positions[m][n].addNeighbour(this.positions[nX][nY]);
            this.nextPositions[m][n].addNeighbour(this.nextPositions[nX][nY]);
          }
        }
      }

    }
  }


  this.showPositions = function(next = 0){
    var i=0;
    var j=0;

    for (j = 0; j < this.gridYsize; j++){
      var o = ''; 
      for (i = 0; i < this.gridXsize; i++){
        if (next){
          o = o + (this.nextPositions[i][j].state?'*':'.');
        }else{
          o - o + (this.positions[i][j].state?'*':'.');
        }
      }
      console.log(o);
    }
  }

  this.nextStep = function(){
    var i=0;
    var j=0;

    for (i = 0; i<this.gridXsize; i++){
      for (j = 0; j<this.gridYsize; j++){

        var cell = this.nextPositions[i][j];
        cell.state = this.positions[i][j].getNextState();
      }
    }

    for (i = 0; i<this.gridXsize; i++){
      for (j = 0; j<this.gridYsize; j++){
        currentCell = this.positions[i][j];
        nextCell = this.nextPositions[i][j];

        currentCell.state = nextCell.state;
      }
    }
  }

  this.zeroGrid = function(){
    var i = 0;
    var j = 0;

    for (i = 0; i<this.gridXsize; i++){
      for (j = 0; j < this.gridYsize; j++){
        this.positions[i][j].state = 0;
        this.nextPositions[i][j].state = 0;
      }
    }
  }

  this.loadGrid = function(coords){

    this.zeroGrid();
    var i = 0;

    for (i = 0; i<coords.length; i++){
      this.positions[coords[i][0]][coords[i][1]].state = 1;
      this.nextPositions[coords[i][0]][coords[i][1]].state = 1;
    }

  }

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
      ["11","8"
      ]],
      "clock":[
      ["9","8"],
      ["10","6"],
      ["10","8"],
      ["11","7"],
      ["11","9"],
      ["12","7"]
      ],
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
      ["14","13"]
      ],
      "f-pentomino":[
      ["10","7"],
      ["10","6"],
      ["11","7"],
      ["11","8"],
      ["12","7"]
      ],
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
      ["36","5"]
      ],
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
      ["15","8"]
      ],
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
      ["14","8"]
      ],
      "spaceship":[
      ["7","3"],
      ["7","6"],
      ["8","7"],
      ["9","3"],
      ["9","7"],
      ["10","4"],
      ["10","5"],
      ["10","6"],
      ["10","7"]
      ],
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
      ["13","10"]]};

}



function clone(obj){
  if(obj == null || typeof(obj) != 'object')
    return obj;

  var temp = new obj.constructor(); 
  for(var key in obj)
    temp[key] = clone(obj[key]);

  return temp;
}
