class Plant extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame){
        super(scene,x, y, texture, frame);
        this.gridX = 0;
        this.gridY = 1;
        
        scene.add.existing(this);
    }

    update(){

    }
}