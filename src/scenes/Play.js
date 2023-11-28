class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        this.bgGrid = this.add.image(game.config.width/2, game.config.height/2, 'grassbg').setScale(1);
        this.grid = new Grid(this, game.config.width/2, game.config.height/2, 320*2, 268*2, 5);
        this.player = new Player(this, 2, 2, 'farmer').setOrigin(0.5).setScale(0.2).setDepth(2);
        this.environment = new Environment(this,game.config.width/2, game.config.height/2);
        this.grid.addPlant(new Carrot(this, 0, 1));
        this.grid.addPlant(new Tomato(this, 4, 3));
        this.grid.addPlant(new Potato(this, 1, 4));
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        this.key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        this.key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    }

    update() {
        // this.input.on('pointerdown', (pointer) => {
        //     console.log(pointer.x, pointer.y);
        // });
        this.player.update();
        this.environment.update();
    }

}