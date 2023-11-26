class Plant extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame){
        let gridPoint = scene.grid.getPoint(x,y);
        super(scene, gridPoint[0], gridPoint[1], texture, frame);
        this.gridX = x;
        this.gridY = y;
        this.placeHolderRectangle = new Phaser.GameObjects.Rectangle(scene, this.x, this.y, 32, 60, 0xa0ffaa);
        scene.add.existing(this);
        scene.add.existing(this.placeHolderRectangle);
    }

    toString() {
        return "Plant at (" + this.gridX + ", " + this.gridY + ")" ;
    }

    update(){

    }
}