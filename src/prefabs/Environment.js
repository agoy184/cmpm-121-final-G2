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

class Event {
	constructor(name, day, duration, emoji) {
		this.name = name;
		this.day = day;
		this.duration = duration;
		this.emoji = emoji;
	}
}

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
		this.events = [];
		scene.add.existing(this);
	}

	saveData() {
		return {
			time: this.currentTime,
			day: this.day,
			events: this.events,
		};
	}

	updateControlsDisplay() {
		this.controlsDisplay.setText(pressForControlsText[language]);
	}

	loadData(data) {
		this.currentTime = data.time ?? this.currentTime;
		this.day = data.day ?? this.day;
		if (data.events != null) {
			for (let num in data.events) {
				const evt = new Event(
					data.events[num].name,
					data.events[num].day,
					data.events[num].duration,
					data.events[num].emoji
				);
				this.events.push(evt);
			}
		}
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
			this.eventChecker();
		}
		this.displayPlayerInventory(this.scene.player.plantInventory);
	}

	eventChecker() {
		if (this.events == null || this.events.length == 0) {
			return;
		}

		for (let evt of this.events) {
			if (evt != null) {
				if (evt.duration <= 0) {
					if (this.scene.eventEmoji.text == evt.emoji) {
						this.scene.eventEmoji.setText("");
					}

					this.events.splice(this.events.indexOf(evt), 1);
					continue;
				}

				if (evt.day != this.day) {
					continue;
				}

				evt.duration -= 1;
				evt.day += 1;

				console.log(evt.name + " " + evt.duration);

				this.scene.eventEmoji.setText(evt.emoji);

				switch (evt.name) {
					case "Rain":
						this.scene.grid.waterAllPlants();
						break;
					case "Drought":
						this.scene.grid.dryAllPlants();
						break;
					case "Destruction":
						this.scene.grid.destroyAllPlants();
						break;
				}
			}
		}
	}

	isEventActive(eventName) {
		for (let evt of this.events) {
			if (evt.name == eventName) {
				if (evt.day == this.day && evt.duration > 0) {
					return true;
				}
			}
		}
		return false;
	}
}
