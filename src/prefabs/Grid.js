class Grid extends Phaser.GameObjects.Grid {
    constructor(scene, x, y, width, height, dimension){
        super(scene, x, y, width, height, width/dimension, height/dimension, 0x000000, 1, 0xff0000);
        this.dimension = dimension;
        this.gridCells = {};
        this.initializeGrid();
        scene.events.on("newDay", (event) => {
            this.initializeGrid();
            console.log("day " + event.day);
        });
        scene.add.existing(this);
    }

    initializeCell(x,y) {
        let key = x + "," + y;
        let randomWater = Math.floor(Math.random()*10-3); //-3-6
        let randomSunlight = Math.floor(Math.random()*10); // 0-9
        if (this.gridCells[key]) {
            // modify the water level in a range of -3 to 7 (i think) i think its 6 ngl but idk
            this.gridCells[key].addWaterLevel(randomWater);
            this.gridCells[key].setSunlightLevel(randomSunlight);
            return;
        }
        this.gridCells[key] = new Cell(randomWater,randomSunlight);
        // console.log(this.gridCells[key])
    }

    initializeGrid() {
        for (let i = 0; i < this.dimension; i++) {
            for (let j = 0; j < this.dimension; j++) {
                this.initializeCell(i, j);
            }
        }
        this.growCells();
    }

    addPlant(plant){
        let key = plant.gridX + "," + plant.gridY;
        this.gridCells[key].addPlant(plant);
    }

    removePlant(x,y){
        let key = x + "," + y;
        return this.gridCells[key].removePlant();
    }

    getCellInfo(x, y) {
        let key = x + "," + y;
        let sunlight = this.gridCells[key].sunlightLevel;
        let water = this.gridCells[key].waterLevel;
        if (this.gridCells[key].plant) {
            return this.gridCells[key].plant + " has " + sunlight + " sunlight and " + water + " water";
        }
        return "empty plot has " + sunlight + " sunlight and " + water + " water";
  }
  
    getNearCells(x, y) {
        let nearCells = [];
        //refactor later, just makes a list of the current cell and the 4 cells around it
        let nearCellKey = x + "," + y;
        nearCells.push(this.gridCells[nearCellKey]);
        nearCellKey = x + "," + (y - 1);
        nearCells.push(this.gridCells[nearCellKey]);
        nearCellKey = x + "," + (y + 1);
        nearCells.push(this.gridCells[nearCellKey]);
        nearCellKey = x - 1 + "," + y;
        nearCells.push(this.gridCells[nearCellKey]);
        nearCellKey = x + 1 + "," + y;
        nearCells.push(this.gridCells[nearCellKey]);
        return nearCells;
    }

    growCells() { //this function is kinda ugly but we can refactor later
        for(let key in this.gridCells) {
            if (this.gridCells[key].plant) {
                let [plantX, plantY] = key.split(",").map(Number);
                this.gridCells[key].plant.growPlant(this.getNearCells(plantX, plantY));
            }
        }
    }

    getPoint(x, y) {
        // this part at the end "(this.dimension%2==0)*this.cellWidth/2" moves the point to the center of the cell if the dimension is even (if its not there, the point will be on the side of the cell instead)
        let leftMostX = this.x - (this.cellWidth*Math.floor(this.dimension/2)) + (this.dimension%2==0)*this.cellWidth/2;
        let topMostY = this.y - (this.cellHeight*Math.floor(this.dimension/2)) + (this.dimension%2==0)*this.cellHeight/2;
        return [leftMostX + (x * this.cellWidth), topMostY + (y * this.cellHeight)];
    }

    pointInBounds(x, y) {
        return x >= 0 && x < this.dimension && y >= 0 && y < this.dimension;
    }

    update(){

    }
}