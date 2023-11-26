class Grid extends Phaser.GameObjects.Grid {
    constructor(scene, x, y, width, height, dimension){
        super(scene, x, y, width, height, width/dimension, height/dimension, 0x000000, 1, 0xff0000);
        this.dimension = dimension;
        this.plantGrid = {};
        scene.add.existing(this);
    }

    addPlant(plant){
        let key = plant.gridX + "," + plant.gridY;
        this.plantGrid[key] = plant;
        // console.log(this.plantGrid);
    }

    checkCellForPlant(x, y) {
        let key = x + "," + y;
        return this.plantGrid[key];
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