class Plant extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, name){
        let gridPoint = scene.grid.getPoint(x,y);
        super(scene, gridPoint[0], gridPoint[1], texture, frame);
        this.gridX = x;
        this.gridY = y;
        this.name = name;
        this.growthLevel = 1;
        scene.add.existing(this);
    }

    toString() {
        return this.name + " at (" + this.gridX + ", " + this.gridY + ")" ;
    }

    deletePlant() {
        this.destroy();
    }

    growPlant(nearCells) {
        //implementation written in subclasses
    }

    update(){

    }
}

class Carrot extends Plant {
    constructor(scene, x, y){
        super(scene, x, y, "carrot", 0, "Carrot");
        this.setScale(0.05);
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
                this.setScale(this.growthLevel * 0.05);
            }
        }
    }
}

class Tomato extends Plant {
    constructor(scene, x, y){
        super(scene, x, y, "tomato", 0, "Tomato");
        this.setScale(0.05);
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
                        this.setScale(this.growthLevel * 0.05);
                    }
                }
            }
        }
    }
}

class Potato extends Plant {
    constructor(scene, x, y){
        super(scene, x, y, "potato", 0, "Potato");
        this.setScale(0.1);
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
                if(nearCells[i] instanceof Cell && (!nearCells[i].plant || !nearCells[i].plant instanceof Potato)) {
                    if (this.growthLevel < 3) { 
                        this.growthLevel += 1;
                        this.setScale(this.growthLevel * 0.07);
                    }
                }
            }
        }
    }
}