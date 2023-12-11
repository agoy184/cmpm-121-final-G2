import { h, w } from "../main.js";
import Grid from "../prefabs/Grid.js";
import Player from "../prefabs/Player.js";
import Environment from "../prefabs/Environment.js";
import SaveFile from "../prefabs/SaveFile.js";

const KEYBOARD = Phaser.Input.Keyboard;
const MOVE = "move";
const TIME = "time";
const PLANT = "plant";
const ACTION = "action";
const REFRESH_REDO = "refresh_redo";
const MAX_TIME = 3;

export default class Play extends Phaser.Scene {
	constructor() {
		super("playScene");
	}

	undo() {
		if (this.undoStack.length < 1) return;
		const action = this.undoStack.pop();
		switch (action.type) {
			case MOVE:
				console.log(MOVE);
				this.player.moveCharacter(action.x, action.y, true);
				this.redoStack.push(new MoveAction(action.x, action.y));
				break;

			case TIME:
				console.log(TIME);
				if (action.dayChange) {
					this.environment.currentTime = MAX_TIME;
					this.environment.day -= 1;
				} else this.environment.currentTime -= 1;
				this.environment.updateTimeDisplay();
				this.redoStack.push(action);
				break;

			case PLANT:
				console.log(PLANT);
				this.redoStack.push(
					new PlantAction(this.player.copyInventory(), this.grid)
				);
				this.player.plantInventory = action.inventory;
				this.environment.displayPlayerInventory(action.inventory);
				this.grid.loadData(action.gridData);
				break;
		}
	}

	redo() {
		if (this.redoStack.length < 1) return;
		const action = this.redoStack.pop();
		switch (action.type) {
			case MOVE:
				console.log(MOVE);
				this.player.moveCharacter(action.x, action.y);
				break;

			case TIME:
				console.log(TIME);
				if (action.dayChange) {
					this.environment.currentTime = 0;
					this.environment.day += 1;
				} else this.environment.currentTime += 1;
				this.environment.updateTimeDisplay();
				break;

			case PLANT:
				console.log(PLANT);
				this.undoStack.push(
					new PlantAction(this.player.copyInventory(), this.grid)
				);
				this.player.plantInventory = action.inventory;
				this.environment.displayPlayerInventory(action.inventory);
				this.grid.loadData(action.gridData);
				break;
		}
	}

	create() {
		this.bgGrid = this.add.image(w / 2, h / 2, "grassbg").setScale(1);
		this.grid = new Grid(this, w / 2, h / 2, 320 * 2, 268 * 2, 5);
		this.player = new Player(this, 2, 2, "farmer")
			.setOrigin(0.5)
			.setScale(0.2)
			.setDepth(2);
		this.environment = new Environment(this, w / 2, h / 2);
		this.undoStack = [];
		let undoProc = false;
		this.redoStack = [];
		let redoProc = false;

		this.undoBtn = this.add
			.text(w - 110, 70, "⬅️")
			.setStyle({ fontSize: "25px" })
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				if (undoProc) return;
				undoProc = true;
				this.undo();
				setTimeout(function () {
					undoProc = false;
				}, 175);
			});

		this.redoBtn = this.add
			.text(w - 80, 70, "➡️")
			.setStyle({ fontSize: "25px" })
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				if (redoProc) return;
				redoProc = true;
				this.redo();
				setTimeout(function () {
					redoProc = false;
				}, 175);
			});

		this.events.on(ACTION, (event) => this.undoStack.push(event.action));
		this.events.on(REFRESH_REDO, () => (this.redoStack = []));

		// Add save/load buttons

		this.saveBtn1 = new SaveFile(
			this,
			w - 100,
			120,
			"Save 1",
			{ fontSize: "15px", color: "#FFFFFF" },
			"save1"
		);
		this.saveBtn2 = new SaveFile(
			this,
			w - 100,
			150,
			"Save 2",
			{ fontSize: "15px", color: "#FFFFFF" },
			"save2"
		);
		this.saveBtn3 = new SaveFile(
			this,
			w - 100,
			180,
			"Save 3",
			{ fontSize: "15px", color: "#FFFFFF" },
			"save3"
		);

		// this.saveButtons = [this.saveBtn1, this.saveBtn2, this.saveBtn3];
		//names = ["Carrot", "Tomato", "Potato", "Banana", null];
		// textures = ["carrot", "tomato", "potato", "null"];

		this.plantSpriteArray = {};

		this.grid.addPlant(new Plant(this, 0, 1, internalPlantTypeCompiler(allPlantDefs[0])));
		this.grid.addPlant(new Plant(this, 4, 3, internalPlantTypeCompiler(allPlantDefs[1])));
		this.grid.addPlant(new Plant(this, 1, 4, internalPlantTypeCompiler(allPlantDefs[2])));

		keys = this.input.keyboard.addKeys(
			"W, A, S, D, Q, E, R, T, ONE, TWO, THREE, FOUR"
		);
		controls =
			"Keys:\n" +
			"1: Plant Carrot\n" +
			"2: Plant Tomato\n" +
			"3: Plant Potato\n" +
			"4: Plant Banana\n" +
			"Q: Pick Up Plant\n" +
			"WASD: Move\n" +
			"E: Get Cell Info\n" +
			"R (on a plant): Get Plant Rules\n" +
			"T: Advance Time\n";

		this.startTime = this.time.now;
		if (localStorage.getItem("autosave")) {
			// question box that checks whether player wants to load autosave
			let loadAutosave = confirm("Do you want to load autosave?");
			if (loadAutosave) {
				this.loadFile("autosave");
			} else {
				// remove autosave from local storage so that if player refreshes, they dont get an old autosave
				localStorage.removeItem("autosave");
			}
		}
		// autosave when window is closed and every 5 mins below
		window.onbeforeunload = () => {
			this.autosave();
		};
	}

	update() {
		this.player.update();
		this.environment.update();

		let elapsed = this.time.now - this.startTime;
		// console.log(elapsed);
		// 300000 ms = 5 mins
		if (elapsed > 10000) {
			this.startTime = this.time.now;
			this.autosave();
		}
	}

	autosave() {
		// if statement so there is no autosave if the player does nothing at all
		if (this.undoStack.length > 0) {
			console.log("Autosaved");
			// autosave with current date and time
			this.saveFile("autosave"); // + new Date().toISOString());
		}
	}

	saveFile(label) {
		let save = {
			player: this.player.saveData(),
			environment: this.environment.saveData(),
			grid: this.grid.saveData(),
			undoStack: this.undoStack,
			redoStack: this.redoStack,
		};
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
