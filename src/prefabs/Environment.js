/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { w, h } from "../main.js";

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
		scene.add.existing(this);
	}

	saveData() {
		return {
			time: this.currentTime,
			day: this.day,
		};
	}

	loadData(data) {
		this.currentTime = data.time;
		this.day = data.day;
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
		if (KEYBOARD.JustDown(keys.T)) {
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
	}
}
