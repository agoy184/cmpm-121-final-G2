class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        this.bgGrid = this.add.image(w/2, h/2, 'grassbg').setScale(1);
        this.grid = new Grid(this, w/2, h/2, 320*2, 268*2, 5);
        this.player = new Player(this, 2, 2, 'farmer').setOrigin(0.5).setScale(0.2).setDepth(2);
        this.environment = new Environment(this, w/2, h/2);

        this.grid.addPlant(new Carrot(this, 0, 1));
        this.grid.addPlant(new Tomato(this, 4, 3));
        this.grid.addPlant(new Potato(this, 1, 4));
        
        keys = this.input.keyboard.addKeys('W, A, S, D, Q, E, R, T, ONE, TWO, THREE');
        controls = "Keys:\n" +
                "1: Plant Carrot\n" +
                "2: Plant Tomato\n" +
                "3: Plant Potato\n" +
                "Q: Pick Up Plant\n" +
                "WASD: Move\n" +
                "E: Get Cell Info\n" +
                "R (on a plant): Get Plant Rules\n" +
                "T: Advance Time\n";
    }

    update() {
        this.player.update();
        this.environment.update();
    }

}