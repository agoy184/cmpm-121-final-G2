class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('farmer', './assets/farmer.png');
        this.load.image('grid', './assets/redGrid.png');

    }

    create() {
        this.player = new Player(this, game.config.width/2 - 50, game.config.height/2 - 50, 'farmer', 0, 30).setOrigin(0, 0).setScale(0.2);
        this.bgGrid = this.add.image(game.config.width/2, game.config.height/2, 'grid').setScale(2);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    }

    update() {
        this.player.update();
    }

}