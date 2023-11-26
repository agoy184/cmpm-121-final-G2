class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame){
        super(scene,x, y, texture, frame);
        this.gridX = 2;
        this.gridY = 2;
        this.moving = false;
        scene.add.existing(this);
    }

    tweenToPoint(x, y) {
        this.scene.tweens.add({
            targets: this,
            x: x,
            y: y,
            duration: 200,
            ease: 'Power1',
            onComplete: () => {
                this.moving = false;
                console.log(this.moving);
                console.log(this.gridX, this.gridY);
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
    }
}