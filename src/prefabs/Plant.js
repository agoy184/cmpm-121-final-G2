class Plant extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, name){
        let gridPoint = scene.grid.getPoint(x,y);
        super(scene, gridPoint[0], gridPoint[1], texture, frame);
        this.gridX = x;
        this.gridY = y;
        this.name = name;
        this.growthLevel = 1;
        let color = this.stringToHash(this.name)
        this.placeHolderRectangle = new Phaser.GameObjects.Rectangle(scene, this.x, this.y, 32, 60, color);
        scene.add.existing(this.placeHolderRectangle);
        scene.add.existing(this);
    }

    // https://www.geeksforgeeks.org/how-to-create-hash-from-string-in-javascript/#
    // to temporarily add a unique color to each plant type until we have images for them
    stringToHash(string) {
             
        let hash = 0;
         
        if (string.length == 0) return hash;
         
        for (let i = 0; i < string.length; i++) {
            let char = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
         
        return hash;
    }

    toString() {
        return this.name + " at (" + this.gridX + ", " + this.gridY + ")" ;
    }

    deletePlant() {
        this.placeHolderRectangle.destroy();
        this.destroy();
    }

    growPlant(nearCells) {
        //implementation written in subclasses
    }

    update(){

    }
}

class PlantType1 extends Plant {
    constructor(scene, x, y){
        super(scene, x, y, "plant1Image", 0, "plant1Name");
    }

    /*
    plant 1 growing rules:
    - if water level is positive
    - and the sunlight level is greater than 0
    - and there are no nearby plants
    */
    growPlant(nearCells) {
        if(nearCells[0].waterLevel > 0 && nearCells[0].sunlightLevel > 0) {
            for (let i = 1; i < nearCells.length; i++) {
                if(nearCells[i] instanceof Cell && nearCells[i].plant) {
                    return;
                }
            }
            if (this.growthLevel < 3) { 
                this.growthLevel += 1;
            }
        }
    }
}

class PlantType2 extends Plant {
    constructor(scene, x, y){
        super(scene, x, y, "plant2Image", 0, "plant2Name");
    }

    /*
    plant 2 growing rules:
    - if water level is greater than 25
    - and the sunlight level is greater than 4
    - and there is at least one nearby plant
    */
    growPlant(nearCells) {
        if(nearCells[0].waterLevel > 25 && nearCells[0].sunlightLevel > 4) {
            for(let i = 1; i < nearCells.length; i++) {
                if(nearCells[i] instanceof Cell && nearCells[i].plant) {
                    if (this.growthLevel < 3) { 
                        this.growthLevel += 1;
                    }
                }
            }
        }
    }
}

class PlantType3 extends Plant {
    constructor(scene, x, y){
        super(scene, x, y, "plant3Image", 0, "plant3Name");
    }

    /*
    plant 3 growing rules:
    - if water level is greater than 10
    - and the sunlight level is less than 5
    - and there are no nearby plants (except for plant 3)
    */
    growPlant(nearCells) {
        if(nearCells[0].waterLevel > 10 && nearCells[0].sunlightLevel < 5) {
            for(let i = 1; i < nearCells.length; i++) {
                if(nearCells[i] instanceof Cell && (!nearCells[i].plant || !nearCells[i].plant instanceof PlantType3)) {
                    if (this.growthLevel < 3) { 
                        this.growthLevel += 1;
                    }
                }
            }
        }
    }
}