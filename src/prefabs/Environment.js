import { w } from "../main.js";
import { KEYBOARD, ACTION, REFRESH_REDO, MAX_TIME} from "../scenes/Play.js";
import TimeAction from "./Action.js";

export default class Environment extends Phaser.GameObjects.GameObject {
	constructor(scene, x, y) {
		super(scene, x, y);
		this.currentTime = 0;
		this.day = 0;
		this.timerDisplay = scene.add.text(
			10,
			10,
			"Press 'T' to advance time: " + this.currentTime
		);
		this.dayDisplay = scene.add.text(10, 30, "Day: " + this.day);
		this.plantDisplay = scene.add.text(
			10,
			50,
			this.scene.player.plantInventory
		);
		this.controlsDisplay = scene.add.text(
			w - 140,
			10,
			"Press 'R'\nfor controls"
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

	loadData(data) {
		this.currentTime = data.time ?? this.currentTime;
		this.day = data.day ?? this.day;
		this.event = data.event ?? this.event;
		this.updateTimeDisplay();
	}

	displayPlayerInventory(inventory) {
		let displayString = "Inventory:\n";
		for (let key in inventory) {
			displayString += key + ": " + inventory[key] + "\n";
		}
		this.plantDisplay.setText(displayString);
	}

	updateTimeDisplay() {
		this.timerDisplay.setText("Time: " + this.currentTime);
		this.dayDisplay.setText("Day: " + this.day);
	}

	update() {
		if (KEYBOARD.JustDown(this.keys.T) || this.scene.tProc) {
			this.scene.tProc = false;
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
