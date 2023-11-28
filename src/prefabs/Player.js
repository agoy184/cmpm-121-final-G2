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

    tweenToPoint(x, y) {
        this.scene.tweens.add({
            targets: this,
            x: x,
            y: y,
            duration: 175,
            ease: 'Power1',
            onComplete: () => {
                this.moving = false;
            }
        });
    }

    moveCharacter(dX, dY) {
        if (this.moving) {
            return;
        }
        if (!this.scene.grid.pointInBounds(this.gridX + dX, this.gridY + dY)) {
            return;
        }
        this.moving = true;
        let newPoint = this.scene.grid.getPoint(this.gridX + dX, this.gridY + dY);
        this.tweenToPoint(newPoint[0], newPoint[1]);
        this.gridY += dY;
        this.gridX += dX;
    }

    update(){
        if (keyW.isDown) {
            this.moveCharacter(0,-1)
        } 
        else if (keyA.isDown) {
            this.moveCharacter(-1,0)
        }
        else if (keyS.isDown) {
            this.moveCharacter(0,1)
        }
        else if (keyD.isDown) {
            this.moveCharacter(1,0)
        }
        
        if (this.scene.keyE.isDown) {
            let info = this.scene.grid.getCellInfo(this.gridX, this.gridY);
            alert(info);
        }
        if (!this.removingPlantAlready && keyQ.isDown) {
            this.removingPlantAlready = true;
            let plant = this.scene.grid.removePlant(this.gridX, this.gridY);
            console.log(plant);
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
        else if (this.removingPlantAlready && keyQ.isUp) {
            this.removingPlantAlready = false;
        }
        // gotta refactor this later
        if (this.scene.key1.isDown) {
            this.scene.grid.addPlant(new PlantType1(this.scene, this.gridX, this.gridY).setScale(0.5));
        }
        if (this.scene.key2.isDown) {
            this.scene.grid.addPlant(new PlantType2(this.scene, this.gridX, this.gridY).setScale(0.5));
        }
        if (this.scene.key3.isDown) {
            this.scene.grid.addPlant(new PlantType3(this.scene, this.gridX, this.gridY).setScale(0.5));
        }
    }
}