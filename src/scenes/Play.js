import * as yaml from "../../yamljs/dist/yaml.js";
import { h, w } from "../main.js";
import Grid from "../prefabs/Grid.js";
import Player from "../prefabs/Player.js";
import Environment from "../prefabs/Environment.js";
import SaveFile from "../prefabs/SaveFile.js";
import Plant, { internalPlantTypeCompiler } from "../prefabs/Plant.js";
import { allPlantDefs } from "../prefabs/plantDef.js";
import MoveAction, { PlantAction } from "../prefabs/Action.js";
import { autosaveMsgText, saveText } from "../translations.js";

export const KEYBOARD = Phaser.Input.Keyboard;
export const MOVE = "move";
export const TIME = "time";
export const PLANT = "plant";
export const ACTION = "action";
export const REFRESH_REDO = "refresh_redo";
export const MAX_TIME = 3;
export const LANG_CHANGE = "language-changed";

export const languages = ["English", "中文", "اللغةالعربية"];
export let language = "English";

export default class Play extends Phaser.Scene {
	constructor() {
		super("playScene");
	}

	preload() {
		this.load.text("yamlData", "../src/scenarios.yaml");
	}

	undo() {
		if (this.undoStack.length < 1) return;
		const action = this.undoStack.pop();
		switch (action.type) {
			case MOVE:
				this.player.moveCharacter(action.x, action.y, true);
				this.redoStack.push(new MoveAction(action.x, action.y));
				break;

			case TIME:
				if (action.dayChange) {
					this.environment.currentTime = MAX_TIME;
					this.environment.day -= 1;
				} else this.environment.currentTime -= 1;
				this.environment.updateTimeDisplay();
				this.redoStack.push(action);
				break;

			case PLANT:
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
				this.player.moveCharacter(action.x, action.y);
				break;

			case TIME:
				if (action.dayChange) {
					this.environment.currentTime = 0;
					this.environment.day += 1;
				} else this.environment.currentTime += 1;
				this.environment.updateTimeDisplay();
				break;

			case PLANT:
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
		this.proc = {
			wProc: false,
			aProc: false,
			sProc: false,
			dProc: false,
			qProc: false,
			eProc: false,
			rProc: false,
			tProc: false,
			oneProc: false,
			twoProc: false,
			threeProc: false,
			fourProc: false,
		};

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
			.text(w - 110, 70, "↩️")
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
			.text(w - 80, 70, "↪️")
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
		this.events.on(LANG_CHANGE, () => {
			this.environment.updateTimeDisplay();
			this.grid.updateNames();
			this.environment.updateControlsDisplay();
			this.player.updateInventory();
			if (!this.saveBtn1.saved)
				this.saveBtn1.updateText(saveText[language] + "1");
			if (!this.saveBtn2.saved)
				this.saveBtn2.updateText(saveText[language] + "2");
			if (!this.saveBtn3.saved)
				this.saveBtn3.updateText(saveText[language] + "3");
		});

		this.saveBtn1 = new SaveFile(
			this,
			w - 100,
			120,
			saveText[language] + "1",
			{ fontSize: "15px", color: "#FFFFFF" },
			"save1"
		);
		this.saveBtn2 = new SaveFile(
			this,
			w - 100,
			150,
			saveText[language] + "2",
			{ fontSize: "15px", color: "#FFFFFF" },
			"save2"
		);
		this.saveBtn3 = new SaveFile(
			this,
			w - 100,
			180,
			saveText[language] + "3",
			{ fontSize: "15px", color: "#FFFFFF" },
			"save3"
		);

		this.upBtn = this.add
			.text(w - 900, 220, "⬆️")
			.setStyle({ fontSize: "25px" })
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				if (this.wProc) return;
				this.wProc = true;
				setTimeout(
					function () {
						this.wProc = false;
					}.bind(this),
					175
				);
			});

		this.leftBtn = this.add
			.text(w - 930, 250, "⬅️")
			.setStyle({ fontSize: "25px" })
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				this.input.keyboard.emit("keydown-A");
				if (this.aProc) return;
				this.aProc = true;
				setTimeout(
					function () {
						this.aProc = false;
					}.bind(this),
					175
				);
			});

		this.downBtn = this.add
			.text(w - 900, 280, "⬇️")
			.setStyle({ fontSize: "25px" })
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				this.input.keyboard.emit("keydown-S");
				if (this.sProc) return;
				this.sProc = true;
				setTimeout(
					function () {
						this.sProc = false;
					}.bind(this),
					175
				);
			});

		this.rightBtn = this.add
			.text(w - 870, 250, "➡️")
			.setStyle({ fontSize: "25px" })
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				this.input.keyboard.emit("keydown-D");
				if (this.dProc) return;
				this.dProc = true;
				setTimeout(
					function () {
						this.dProc = false;
					}.bind(this),
					175
				);
			});

		this.qBtn = this.add
			.text(w - 60, 250, "Q")
			.setStyle({ fontSize: "25px" })
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				if (this.qProc) return;
				this.qProc = true;
				setTimeout(
					function () {
						this.qProc = false;
					}.bind(this),
					175
				);
			});

		this.eBtn = this.add
			.text(w - 120, 250, "E")
			.setStyle({ fontSize: "25px" })
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				if (this.eProc) return;
				this.eProc = true;
				setTimeout(
					function () {
						this.eProc = false;
					}.bind(this),
					175
				);
			});

		this.rBtn = this.add
			.text(w - 90, 220, "R")
			.setStyle({ fontSize: "25px" })
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				if (this.rProc) return;
				this.rProc = true;
				setTimeout(
					function () {
						this.rProc = false;
					}.bind(this),
					175
				);
			});

		this.tBtn = this.add
			.text(w - 90, 280, "T")
			.setStyle({ fontSize: "25px" })
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				if (this.tProc) return;
				this.tProc = true;
				setTimeout(
					function () {
						this.tProc = false;
					}.bind(this),
					175
				);
			});

		this.oneBtn = this.add
			.text(w - 145, 450, "1")
			.setStyle({ fontSize: "25px" })
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				if (this.oneProc) return;
				this.oneProc = true;
				setTimeout(
					function () {
						this.oneProc = false;
					}.bind(this),
					175
				);
			});

		this.twoBtn = this.add
			.text(w - 105, 450, "2")
			.setStyle({ fontSize: "25px" })
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				if (this.twoProc) return;
				this.twoProc = true;
				setTimeout(
					function () {
						this.twoProc = false;
					}.bind(this),
					175
				);
			});

		this.threeBtn = this.add
			.text(w - 65, 450, "3")
			.setStyle({ fontSize: "25px" })
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				if (this.threeProc) return;
				this.threeProc = true;
				setTimeout(
					function () {
						this.threeProc = false;
					}.bind(this),
					175
				);
			});

		this.fourBtn = this.add
			.text(w - 25, 450, "4")
			.setStyle({ fontSize: "25px" })
			.setInteractive({ useHandCursor: true })
			.on("pointerdown", () => {
				if (this.fourProc) return;
				this.fourProc = true;
				setTimeout(
					function () {
						this.fourProc = false;
					}.bind(this),
					175
				);
			});

		this.createLangButtons();
		this.plantSpriteArray = {};

		this.startTime = this.time.now;
		if (localStorage.getItem("autosave")) {
			let loadAutosave = confirm(autosaveMsgText[language]);
			if (loadAutosave) {
				this.loadFile("autosave");
			} else {
				localStorage.removeItem("autosave");
			}
		}
		// autosave when window is closed and every 5 mins below
		window.onbeforeunload = () => {
			this.autosave();
		};

		this.uploadFromYaml();
	}

	createLangButtons() {
		let yPos = 330;
		languages.forEach((lang) => {
			const btn = this.add
				.text(10, yPos, lang)
				.setStyle({ fontSize: "15px" })
				.setInteractive({ useHandCursor: true })
				.on("pointerout", () => {
					btn.setStyle({ fill: "#FFFFFF" });
					btn.setFontSize(15);
				})
				.on("pointerover", () => {
					btn.setStyle({ fill: "#f39c12" });
					btn.setFontSize(15 * 1.1);
				})
				.on("pointerdown", () => {
					language = lang;
					this.events.emit(LANG_CHANGE);
				});
			yPos += 20;
		});
	}

	uploadFromYaml() {
		let yamlData = this.cache.text.get("yamlData");
		let data = YAML.parse(yamlData);

		if (data) {
			this.player.loadData(data[0].start.player);
			this.grid.loadData(data[0].start.grid);
			this.environment.loadData(data[0].start.environment);
		} else {
			this.grid.addPlant(
				new Plant(
					this,
					0,
					1,
					internalPlantTypeCompiler(allPlantDefs[0])
				)
			);
			this.grid.addPlant(
				new Plant(
					this,
					4,
					3,
					internalPlantTypeCompiler(allPlantDefs[1])
				)
			);
			this.grid.addPlant(
				new Plant(
					this,
					1,
					4,
					internalPlantTypeCompiler(allPlantDefs[2])
				)
			);
		}
	}

	update() {
		this.player.update();
		this.environment.update();

		let elapsed = this.time.now - this.startTime;
		if (elapsed > 10000) {
			this.startTime = this.time.now;
			this.autosave();
		}
	}

	autosave() {
		if (this.undoStack.length > 0) {
			console.log("Autosaved");
			this.saveFile("autosave");
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
	}
}
