class Grid extends Phaser.GameObjects.Grid {
    constructor(scene, x, y, width, height, dimension){
        super(scene, x, y, width, height, width/dimension, height/dimension, 0xaa11aa, 0.1, 0xffffff, 0.5);
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
        let key = this.getKey(x, y);
        let randomWater = Math.floor(Math.random()*10-3); //-3-6
        let randomSunlight = Math.floor(Math.random()*10); // 0-9
        if (this.gridCells[key]) {
            // modify the water level in a range of -3 to 7 (i think) i think its 6 ngl but idk
            this.gridCells[key].addWaterLevel(randomWater);
            this.gridCells[key].setSunlightLevel(randomSunlight);
            return;
        }
        this.gridCells[key] = new Cell(randomWater,randomSunlight);
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
        let key = this.getKey(plant.gridX, plant.gridY);
        this.gridCells[key].addPlant(plant);
    }

    removePlant(x,y){
        let key = this.getKey(x, y);
        return this.gridCells[key].removePlant();
    }

    getCellInfo(x, y) {
        let key = this.getKey(x, y);
        let cell = this.gridCells[key];
        let sunlight = cell.sunlightLevel;
        let water = cell.waterLevel;
        if (cell.plant) {
            return "Level " + cell.plant.growthLevel + " " + cell.plant + " has " + sunlight + " sunlight and " + water + " water";
        }
        return "empty plot has " + sunlight + " sunlight and " + water + " water";
  }
  
    getNearCells(x, y) {
        let nearCells = [];
        const nearCellKeys = this.getNearCellKeys(x, y);
        nearCellKeys.forEach(key => {
            nearCells.push(this.gridCells[key]);
        })
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

    getKey(x, y) {
        return x + "," + y;
    }

    getNearCellKeys(x, y) {
        const points = [{x: x, y: y}, {x: x, y: y - 1}, {x: x, y: y + 1}, {x: x - 1, y: y}, {x: x + 1, y: y}];
        const keys = [];
        points.forEach(point => {
            keys.push(this.getKey(point.x, point.y));
        })
        return keys;
    }

    pointInBounds(x, y) {
        return x >= 0 && x < this.dimension && y >= 0 && y < this.dimension;
    }

    update(){

    }
}