class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame){
        super(scene,x, y, texture, frame);
        scene.add.existing(this);
    }

    update(){
        if (keyW.isDown && this.y >= 25) {
            this.y -= 100;
        } else if (keyS.isDown && this.y <= game.config.height - 200) {
            this.y += 100;
        }
        if (keyA.isDown && this.x >= 250) {
            this.x -= 125;
        } else if (keyD.isDown && this.x <= game.config.width - 375) {
            this.x += 125;
        }

    }
}