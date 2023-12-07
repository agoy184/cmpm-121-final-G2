class Plant extends Phaser.GameObjects.Sprite {
    numBytes = 4;
    constructor(scene, x, y, dataView){
        let gridPoint = scene.grid.getPoint(x,y);
        super(scene, gridPoint[0], gridPoint[1], textures[0], 0, names[0]);
        this.dataView = dataView;
        scene.add.existing(this);
    }
    
    //Plant Byte Map
    /*
    * First byte is the plant type: 0 = Carrot, 1 = Tomato, 2 = Potato
    * Next byte is the X position: 0-4
    * Next byte is the Y position: 0-4
    * Next byte is the growth level: 1-3
    * */

    get type() {
        return this.dataView.getUint8(0);
    }
    
    set type(i) {
        if (this.dataView) {
            this.dataView.setUint8(0, i);
            if (i < 2) {
                this.setScale(0.05);
            } else {
                this.setScale(0.1);
            }
            this.setTexture(textures[i]);
            this.setName(names[i]);
        }
    }
    
    get x() {
        return this.dataView.getUint8(1);
    }
    
    set x(i) {
        if (this.dataView) {
            this.dataView.setUint8(1, i);
        }
    }
    
    get y() {
        return this.dataView.getUint8(2);
    }
    
    set y(i) {
        if (this.dataView) {
            this.dataView.setUint8(2, i);
        }
    }
    
    get growthLevel() {
        return this.dataView.getUint8(3);
    }
    
    set growthLevel(i) {
        if (this.dataView) {
            this.dataView.setUint8(3, i);
        }
    }

    toString() {
        return this.scene.names[this.type] + " at (" + this.x + ", " + this.y + ")" ;
    }

    deletePlant() {
        this.type = 0;
        this.x = 0;
        this.y = 0;
        this.growthLevel = 0;
        console.log("bruh");
        this.destroy();
    }

    growPlant(nearCells) {
        if (this.dataView) {
            if (this.type == 0) { //carrot
                if (nearCells[0].waterLevel > 0 && nearCells[0].sunlightLevel > 0) {
                    for (let i = 1; i < nearCells.length; i++) {
                        if (nearCells[i] instanceof Cell && nearCells[i].plant) {
                            return;
                        }
                    }
                    if (this.growthLevel < 3) {
                        this.growthLevel += 1;
                        this.setScale(this.growthLevel * 0.05);
                    }
                }
            } else if (this.type == 1) { //tomato
                if (nearCells[0].waterLevel > 25 && nearCells[0].sunlightLevel > 4) {
                    for (let i = 1; i < nearCells.length; i++) {
                        if (nearCells[i] instanceof Cell && nearCells[i].plant) {
                            if (this.growthLevel < 3) {
                                this.growthLevel += 1;
                                this.setScale(this.growthLevel * 0.05);
                            }
                        }
                    }
                }
            } else if (this.type == 2) { //potato
                if (nearCells[0].waterLevel > 10 && nearCells[0].sunlightLevel < 5) {
                    for (let i = 1; i < nearCells.length; i++) {
                        if (nearCells[i] instanceof Cell && (!nearCells[i].plant || !nearCells[i].plant instanceof Potato)) {
                            if (this.growthLevel < 3) {
                                this.growthLevel += 1;
                                this.setScale(this.growthLevel * 0.07);
                            }
                        }
                    }
                }
            } else {
                //invalid or null, if this happens there is probably something i overlooked
                console.log("bruh");
            }
        }
    }

    saveData() {
        return { x: this.x, y: this.y, type: this.type, growthLevel: this.growthLevel };
    }

    loadData(data) {
        this.x = data.x;
        this.y = data.y;
        this.type = data.type;
        this.growthLevel = data.growthLevel;
        this.gridPoint = this.scene.getPoint(this.x, this.y);

        if (this.type != 2) {
            this.setScale(this.growthLevel * 0.05);
        } else if (this.growthLevel == 1) {
            this.setScale(0.1);
        } else {
            this.setScale(this.growthLevel * 0.07);
        }
    }

    update() {
        
        console.log("bruh");
        if (this.type != 2) {
            this.setScale(this.growthLevel * 0.05);
        } else if (this.growthLevel == 1) {
            this.setScale(0.1);
        } else {
            this.setScale(this.growthLevel * 0.07);
        }

        if (this.plantType == 3) {
            this.scene.grid.removePlant(this.x, this.y);
            this.destroy();
        }
        if (this.growthLevel > 3) {
            this.growthLevel = 3;
        }

        console.log(this.growthLevel + " " + this.x + " " + this.y + " " + this.type);
    }
}
