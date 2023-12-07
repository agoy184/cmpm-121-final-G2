class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame){
        let gridPoint = scene.grid.getPoint(x,y);
        super(scene, gridPoint[0], gridPoint[1], texture, frame);
        this.gridX = x;
        this.gridY = y;
        this.moving = false;
        this.removingPlantAlready = false;
        this.plantInventory = {};
        this.growthThreePlants = 0;
        scene.add.existing(this);
    }

    saveData() {
        return {
            x: this.gridX,
            y: this.gridY,
            inventory: this.plantInventory,
            growthThreePlants: this.growthThreePlants
        }
    }

    loadData(data) {
        this.gridX = data.x;
        this.gridY = data.y;
        this.plantInventory = data.inventory;
        this.growthThreePlants = data.growthThreePlants;
        let gridPoint = this.scene.grid.getPoint(this.gridX, this.gridY);
        this.x = gridPoint[0];
        this.y = gridPoint[1];
    }

    tweenToPoint(x, y) {
        this.scene.tweens.add({
            targets: this,
            x: x,
            y: y,
            duration: 175,
            ease: "Power1",
            onComplete: () => {
                this.moving = false;
            }
        });
    }

    moveCharacter(dX, dY, undo = false) {
        if(undo) {
            dX = dX * -1;
            dY = dY * -1;
        }
        if (this.moving) {
            return;
        }
        if (!this.scene.grid.pointInBounds(this.gridX + dX, this.gridY + dY)) {
            return;
        }
        this.moving = true;
        let newPoint = this.scene.grid.getPoint(this.gridX + dX, this.gridY + dY);
        this.tweenToPoint(newPoint[0], newPoint[1]);
        if (!undo) this.scene.events.emit(ACTION, {action: new MoveAction(dX, dY)});
        this.gridY += dY;
        this.gridX += dX;

    }

    update() {
        if (KEYBOARD.JustDown(keys.W)) {
            this.moveCharacter(0, -1);
        } 
        else if (KEYBOARD.JustDown(keys.A)) {
            this.moveCharacter(-1, 0);
        }
        else if (KEYBOARD.JustDown(keys.S)) {
            this.moveCharacter(0, 1);
        }
        else if (KEYBOARD.JustDown(keys.D)) {
            this.moveCharacter(1, 0);
        }

        if (KEYBOARD.JustDown(keys.R)) {
            let plant = this.scene.grid.getPlant(this.gridX, this.gridY);
            if (plant) {
                alert(plant.rules);
            } else {
                alert(controls);
            }
        }
        
        if (KEYBOARD.JustDown(keys.E)) {
            let info = this.scene.grid.getCellInfo(this.gridX, this.gridY);
            alert(info);
            console.log(this.scene.grid.plants);
            console.log(this.scene.grid.plants[0].x + " " + this.scene.grid.plants[0].y);
            console.log(this.gridX + " " + this.gridY);
        }
        if (!this.removingPlantAlready && KEYBOARD.JustDown(keys.Q)) {
            console.log(this.plantInventory);
            this.scene.events.emit(ACTION, {action: new PlantAction(this.plantInventory, this.scene.grid)});
            this.scene.events.emit(REFRESH_REDO);
            this.removingPlantAlready = true;
            let plant = this.scene.grid.removePlant(this.gridX, this.gridY);
            if (!plant) {
                return;
            }
            if (plant[1] == 3) {
                this.growthThreePlants += 1;
                if (this.growthThreePlants == 5) {
                    alert("You collected 5 level 3 plants! You win!");
                }
            }
            this.plantInventory[plant] = (this.plantInventory[plant] || 0) + 1;
        }
        else if (this.removingPlantAlready && keys.Q.isUp) {
            this.removingPlantAlready = false;
        }

        // gotta refactor this later
        if (KEYBOARD.JustDown(keys.ONE)) {
            this.scene.events.emit(ACTION, {action: new PlantAction(this.plantInventory, this.scene.grid)});
            this.scene.events.emit(REFRESH_REDO);
            //this.scene.grid.addPlant(new Carrot(this.scene, this.gridX, this.gridY));
            this.scene.grid.addPlant(0, this.scene, this.gridX, this.gridY);
        }
        if (KEYBOARD.JustDown(keys.TWO)) {
            this.scene.events.emit(ACTION, {action: new PlantAction(this.plantInventory, this.scene.grid)});
            this.scene.events.emit(REFRESH_REDO);
            //this.scene.grid.addPlant(new Tomato(this.scene, this.gridX, this.gridY));
            this.scene.grid.addPlant(1, this.scene, this.gridX, this.gridY);
        }
        if (KEYBOARD.JustDown(keys.THREE)) {
            this.scene.events.emit(ACTION, {action: new PlantAction(this.plantInventory, this.scene.grid)});
            this.scene.events.emit(REFRESH_REDO);
            //this.scene.grid.addPlant(new Potato(this.scene, this.gridX, this.gridY));
            this.scene.grid.addPlant(2, this.scene, this.gridX, this.gridY);
        }
    }
}