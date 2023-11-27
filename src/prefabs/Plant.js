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
        scene.add.existing(this);
        scene.add.existing(this.placeHolderRectangle);
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

    update(){

    }
}

class PlantType1 extends Plant {
    constructor(scene, x, y){
        super(scene, x, y, "plant1Image", 0, "plant1Name");
    }
}

class PlantType2 extends Plant {
    constructor(scene, x, y){
        super(scene, x, y, "plant2Image", 0, "plant2Name");
    }
}

class PlantType3 extends Plant {
    constructor(scene, x, y){
        super(scene, x, y, "plant3Image", 0, "plant3Name");
    }
}