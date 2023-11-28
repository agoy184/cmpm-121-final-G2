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

    update() {
        if (keys.W.isDown) {
            this.moveCharacter(0,-1)
        } 
        else if (keys.A.isDown) {
            this.moveCharacter(-1,0)
        }
        else if (keys.S.isDown) {
            this.moveCharacter(0,1)
        }
        else if (keys.D.isDown) {
            this.moveCharacter(1,0)
        }

        if (keys.R.isDown) {
            let plant = this.scene.grid.getPlant(this.gridX, this.gridY);
            alert(plant.rules);
        }
        
        if (keys.E.isDown) {
            let info = this.scene.grid.getCellInfo(this.gridX, this.gridY);
            alert(info);
        }
        if (!this.removingPlantAlready && keys.Q.isDown) {
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
        else if (this.removingPlantAlready && keys.Q.isUp) {
            this.removingPlantAlready = false;
        }

        // gotta refactor this later
        if (keys.ONE.isDown) {
            this.scene.grid.addPlant(new Carrot(this.scene, this.gridX, this.gridY));
        }
        if (keys.TWO.isDown) {
            this.scene.grid.addPlant(new Tomato(this.scene, this.gridX, this.gridY));
        }
        if (keys.THREE.isDown) {
            this.scene.grid.addPlant(new Potato(this.scene, this.gridX, this.gridY));
        }
    }
}