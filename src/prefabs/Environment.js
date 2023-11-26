class Environment extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame){
        super(scene,x, y, texture, frame);
        this.currentTime = 0;
        this.timer = scene.add.text(10, 10, "Press 'T' to advance time: " + this.currentTime)
        scene.add.existing(this);
    }

    update(){
        if (this.scene.keyT.isDown) {
            this.currentTime += 1;
            this.timer.setText("Time: " + this.currentTime);
            if (this.currentTime >= 100) {
                this.currentTime = 0;
            }
        }
    }
}