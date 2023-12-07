class Grid extends Phaser.GameObjects.Grid {
    constructor(scene, x, y, width, height, dimension){
        super(scene, x, y, width, height, width/dimension, height/dimension, 0xaa11aa, 0.1, 0xffffff, 0.5);
        this.dimension = dimension;
        //this.gridCells = {};
        const plantGridCells = new ArrayBuffer(5 * 5 * Cell.numBytes);
        for (let i = 1; i < 150; i++) {
            plantGridCells[i] = 0;
            plantGridCells[i] = [0, 0, 0, 0];
        }
        this.dataView = new DataView(plantGridCells);
        this.initializeGrid();
        this.plants = [];
        scene.events.on("newDay", (event) => {
            this.initializeGrid();
            console.log("day " + event.day);
        });
        scene.add.existing(this);
    }

    saveData() {
        return new Uint8Array(this.dataView.buffer);
    }

    loadData(data) { //redo implementation
        for (let i = 0; i < this.dimension; i++) {
            for (let j = 0; j < this.dimension; j++) {
                const index = (i * this.dimension + j) * Cell.numBytes + 2;
                const plantType = this.dataView.getUint8(index);
                const cellData = new DataView(this.dataView.buffer, index - 2, Cell.numBytes);
                const cell = new Cell(cellData);

                if (plantType !== 3) {
                    const loadedPlant = this.createPlant(i, j, plantType);
                    loadedPlant.growthLevel = this.dataView.getUint8(index + 1);
                    this.addPlant(loadedPlant);
                } else if (cell.plant) {
                    this.removePlant(i, j);
                }
            }
        }
    }

    initializeCell(x,y) {
        let randomWater = Math.floor(Math.random()*10-3); //-3-6
        let randomSunlight = Math.floor(Math.random() * 10); // 0-9
        if (this.pointInBounds(x, y)) {
            this.dataView.setUint8((x * this.dimension + y) * Cell.numBytes, randomWater);
            this.dataView.setUint8((x * this.dimension + y) * Cell.numBytes + 1, randomSunlight);
        }
    }

    initializeGrid() {
        for (let i = 0; i < this.dimension; i++) {
            for (let j = 0; j < this.dimension; j++) {
                this.initializeCell(i, j);
            }
        }
        this.growCells();
    }

    createPlant(x, y, plantType) {
        const index = (x * this.dimension + y) * Cell.numBytes + 2;
        switch (plantType) {
            case 0: // Carrot
                return new Plant(this.scene, x, y, this.dataView);
            case 1: // Tomato
                return new Plant(this.scene, x, y, this.dataView);
            case 2: // Potato
                return new Plant(this.scene, x, y, this.dataView);
            default:
                return null;
        }
    }

    addPlant(plant){ //fix this later depending on load data and player update implementation
        const index = (plant.x * this.dimension + plant.y) * Cell.numBytes + 2;
        this.dataView.setUint8(index, plant.type);
        this.dataView.setUint8(index + 3, plant.growthLevel);
        this.dataView.setUint8(index + 1, plant.x);
        this.dataView.setUint8(index + 2, plant.y);
    }

    addPlant(plantType, scene, x, y) {
        // Create a new plant based on the plantType
        let newPlant;
        switch (plantType) {
            case 0:
                newPlant = new Plant(scene, x, y, this.dataView);
                newPlant.plantType = plantType;
                newPlant.growthLevel = 1;
                this.addPlant(newPlant);
                scene.add.existing(newPlant);
                this.plants.push(newPlant);
                break;
            case 1:
                newPlant = new Plant(scene, x, y, this.dataView);
                newPlant.plantType = plantType;
                newPlant.growthLevel = 1;
                this.addPlant(newPlant);
                scene.add.existing(newPlant);
                this.plants.push(newPlant);
                break;
            case 2:
                newPlant = new Plant(scene, x, y, this.dataView);
                newPlant.plantType = plantType;
                newPlant.growthLevel = 1;
                this.addPlant(newPlant);
                scene.add.existing(newPlant);
                this.plants.push(newPlant);
                break;
        }
        /*if (newPlant) {
            newPlant.plantType = plantType;
            this.addPlant(newPlant);
        }*/
    }

    removePlant(x,y){ //fix this later depending on load data and player update implementation
        const index = (x * this.dimension + y) * Cell.numBytes + 2;
        this.dataView.setUint8(index, 3); // Set plantType to 3 (indicating no plant)
        this.dataView.setUint8(index + 1, 0); // Reset x to 0
        this.dataView.setUint8(index + 2, 0); // Reset y  to 0
        this.dataView.setUint8(index + 3, 0); // Reset growth level to 0
    }

    getPlant(x, y) {
        const index = (x * this.dimension + y) * Cell.numBytes + 2;
        const plantType = this.dataView.getUint8(index);
        const growthLevel = this.dataView.getUint8(index + 3);
        const plantX = this.dataView.getUint8(index + 1);
        const plantY = this.dataView.getUint8(index + 2);

        if (plantType !== 3 && growthLevel) {
            console.log("uh oh" + plantType + " " + growthLevel);
            const loadedPlant = this.createPlant(plantX, plantY, plantType);
            loadedPlant.growthLevel = growthLevel;
            return loadedPlant;
        }

        return null; // No plant at the specified location
    }

    getCellInfo(x, y) {
        const index = (x * this.dimension + y) * Cell.numBytes;
        console.log(index);
        const sunlight = this.dataView.getUint8(index + 1);
        console.log(sunlight);
        const water = this.dataView.getUint8(index);
        console.log(water);
        const plantType = this.dataView.getUint8(index + 2);
        console.log(plantType);
        const growthLevel = this.dataView.getUint8(index + 5);
        console.log(growthLevel);
        if (plantType !== 3 && growthLevel !== 0) {
            return "Level " + growthLevel + " " + Plant.names[plantType] + " has " + sunlight + " sunlight and " + water + " water";
        }
        return "empty plot has " + sunlight + " sunlight and " + water + " water";
    }
  
    getNearCells(x, y) {
        let nearCells = [];
        const nearCellKeys = this.getNearCellKeys(x, y);
        nearCellKeys.forEach(key => {
            const [cx, cy] = key.split(",").map(Number);
            if (this.pointInBounds(cx, cy)) {
                const index = (cx * this.dimension + cy) * Cell.numBytes;
                nearCells.push({
                    waterLevel: this.dataView.getUint8(index),
                    sunlightLevel: this.dataView.getUint8(index + 1),
                    plantType: this.dataView.getUint8(index + 2),
                    growthLevel: this.dataView.getUint8(index + 5)
                });
            }
        });
        return nearCells;
    }

    growCells() { //this function is kinda ugly but we can refactor later
       for (let i = 0; i < this.dimension; i++) {
        for (let j = 0; j < this.dimension; j++) {
            const index = (i * this.dimension + j) * Cell.numBytes + 2;
            const plantType = this.dataView.getUint8(index);
            if (plantType !== 3) {
                const plantGrowthLevelIndex = index + 1;
                const currentGrowthLevel = this.dataView.getUint8(plantGrowthLevelIndex);
                this.dataView.setUint8(plantGrowthLevelIndex, currentGrowthLevel + 1);
            }
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
        });
        return keys;
    }

    pointInBounds(x, y) {
        return x >= 0 && x < this.dimension && y >= 0 && y < this.dimension;
    }

    update() {

    }
}