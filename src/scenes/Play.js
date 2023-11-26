class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('farmer', './assets/farmer.png');
        this.load.image('grid', './assets/redGrid.png');

    }

    create() {
        this.grid = new Grid(this, game.config.width/2, game.config.height/2, 320*2, 268*2, 5);
        this.player = new Player(this, 2, 2, 'farmer').setOrigin(0.5).setScale(0.2).setDepth(2);
        this.environment = new Environment(this, game.config.width/2, game.config.height/2, 'placeholder').setScale(0.5);
        // this.bgGrid = this.add.image(game.config.width/2, game.config.height/2, 'grid').setScale(2);
        this.grid.addPlant(new Plant(this, 0, 1, 'placeholder').setScale(0.5));
        this.grid.addPlant(new Plant(this, 4, 3, 'placeholder').setScale(0.5));
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }

    update() {
        // this.input.on('pointerdown', (pointer) => {
        //     console.log(pointer.x, pointer.y);
        // });
        this.player.update();
        this.environment.update();
    }

}