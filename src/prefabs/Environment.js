import { w } from "../main.js";
import { KEYBOARD, ACTION, REFRESH_REDO, MAX_TIME } from "../scenes/Play.js";
import TimeAction from "./Action.js";
import { language } from "../scenes/Play.js";
import {
	advanceTimeText,
	pressForControlsText,
	inventoryText,
	dayText,
	timeText,
} from "../translations.js";

export default class Environment extends Phaser.GameObjects.GameObject {
	constructor(scene, x, y) {
		super(scene, x, y);
		this.currentTime = 0;
		this.day = 0;
		this.timerDisplay = scene.add.text(
			10,
			10,
			advanceTimeText[language] + this.currentTime
		);
		this.dayDisplay = scene.add.text(10, 30, dayText[language] + this.day);
		this.plantDisplay = scene.add.text(
			10,
			50,
			this.scene.player.plantInventory
		);
		this.controlsDisplay = scene.add.text(
			w - 140,
			10,
			pressForControlsText[language]
		);
		this.keys = this.scene.input.keyboard.addKeys(
			"W, A, S, D, Q, E, R, T, ONE, TWO, THREE, FOUR"
		);
		this.event = 0;
		scene.add.existing(this);
	}

	saveData() {
		return {
			time: this.currentTime,
			day: this.day,
			event: this.event,
		};
	}

	updateControlsDisplay() {
		this.controlsDisplay.setText(pressForControlsText[language]);
	}

	loadData(data) {
		this.currentTime = data.time ?? this.currentTime;
		this.day = data.day ?? this.day;
		this.event = data.event ?? this.event;
		this.updateTimeDisplay();
	}

	displayPlayerInventory(inventory) {
		let displayString = inventoryText[language];
		for (let key in inventory) {
			displayString += key + ": " + inventory[key] + "\n";
		}
		this.plantDisplay.setText(displayString);
	}

	updateTimeDisplay() {
		this.timerDisplay.setText(timeText[language] + this.currentTime);
		this.dayDisplay.setText(dayText[language] + this.day);
	}

	update() {
		if (KEYBOARD.JustDown(this.keys.T) || this.scene.proc["tProc"]) {
			this.scene.proc["tProc"] = false;
			this.currentTime += 1;
			this.scene.events.emit(REFRESH_REDO);
			if (this.currentTime > MAX_TIME) {
				this.currentTime = 0;
				this.day += 1;
				this.scene.events.emit(ACTION, {
					action: new TimeAction(true),
				});
				this.scene.events.emit("newDay", { day: this.day });
			} else this.scene.events.emit(ACTION, { action: new TimeAction() });
			this.updateTimeDisplay();
		}
		this.displayPlayerInventory(this.scene.player.plantInventory);

		if (this.event != 0) {
			if (this.day == this.event) {
				this.scene.grid.destroyAllPlants();
				this.event = 0;
			}
		}
	}
}
