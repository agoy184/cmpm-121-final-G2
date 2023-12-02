const KEYBOARD = Phaser.Input.Keyboard;
// --- cases for undo ---
const MOVE = "move";
const TIME = "time";
const LEVEL = "level";
const REMOVE = "remove";
const PLANT = "plant";
const ACTION = "action";
const REFRESH_REDO = "refresh_redo";

class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    undo() {
        if (this.undoStack.length < 1) return;
        const action = this.undoStack.pop();
        this.redoStack.push(action);
        switch (action.type) {
            case MOVE:
                console.log(MOVE);
                this.player.moveCharacter(action.x, action.y, true);
                break;
        
            case TIME:
                console.log(TIME);
                if (action.dayChange) {
                    this.environment.currentTime = 100;
                    this.environment.day -= 1;
                } else this.environment.currentTime -= 1;
                this.environment.updateTimeDisplay();
                break;

            case LEVEL:
                break;
            case REMOVE:
                break;
            case PLANT:
                break;
        }
    }

    redo() {
        if (this.redoStack.length < 1) return;
        const action = this.redoStack.pop();
        switch (action.type) {
            case MOVE:
                console.log(MOVE);
                this.player.moveCharacter(action.x, action.y, false, true);
                break;
            
            case TIME:
                console.log(TIME);
                if (action.dayChange) {
                    this.environment.currentTime = 0;
                    this.environment.day += 1;
                } else this.environment.currentTime += 1;
                this.environment.updateTimeDisplay();
                break;
            
            case LEVEL:
                break;
            case REMOVE:
                break;
            case PLANT:
                break;
        }
    }

    create() {
        this.bgGrid = this.add.image(w/2, h/2, "grassbg").setScale(1);
        this.grid = new Grid(this, w/2, h/2, 320*2, 268*2, 5);
        this.player = new Player(this, 2, 2, "farmer").setOrigin(0.5).setScale(0.2).setDepth(2);
        this.environment = new Environment(this, w/2, h/2);
        this.undoStack = [];
        let undoProc = false;
        this.redoStack = [];
        let redoProc = false;

        this.undoBtn = this.add.text(w - 110, 70, "⬅️")
            .setStyle({ fontSize: "25px" })
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                if(undoProc) return;
                undoProc = true;
                this.undo();
                setTimeout(function() {
                    undoProc = false;
                }, 175);
            });

        this.redoBtn = this.add.text(w - 80, 70, "➡️")
            .setStyle({ fontSize: "25px" })
            .setInteractive({ useHandCursor: true })
            .on("pointerdown", () => {
                if(redoProc) return;
                redoProc = true;
                this.redo();
                setTimeout(function() {
                    redoProc = false;
                }, 175);
            });

        this.events.on(ACTION, (event) => {
            this.undoStack.push(event.action);
            console.log(event.action);
        });

        this.events.on(REFRESH_REDO, () => this.redoStack = []);

        // Add save/load buttons

        this.saveBtn1 = new SaveFile(this, w - 100, 120, "Save 1", { fontSize: "15px", color: "#FFFFFF" }, "save1");
        this.saveBtn2 = new SaveFile(this, w - 100, 150, "Save 2", { fontSize: "15px", color: "#FFFFFF" }, "save2");
        this.saveBtn3 = new SaveFile(this, w - 100, 180, "Save 3", { fontSize: "15px", color: "#FFFFFF" }, "save3");

        this.grid.addPlant(new Carrot(this, 0, 1));
        this.grid.addPlant(new Tomato(this, 4, 3));
        this.grid.addPlant(new Potato(this, 1, 4));
        
        keys = this.input.keyboard.addKeys("W, A, S, D, Q, E, R, T, ONE, TWO, THREE, L");
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

        if (KEYBOARD.JustDown(keys.L)) {
            this.bruhmoment("save1");
        }
    }

    saveFile(label) {
        let save = {
            player: this.player.saveData(),
            environment: this.environment.saveData(),
            grid: this.grid.saveData(),
            undoStack: this.undoStack,
            redoStack: this.redoStack
        };
        console.log(save.undoStack);
        localStorage.setItem(label, JSON.stringify(save));
    }

    loadFile(label) {
        let save = JSON.parse(localStorage.getItem(label));
        this.player.loadData(save.player);
        this.environment.loadData(save.environment);
        this.grid.loadData(save.grid);
        this.undoStack = save.undoStack;
        this.redoStack = save.redoStack;
        console.log(this.undoStack);
    }

}