import {
	KEYBOARD, controls, ACTION, REFRESH_REDO } from "../scenes/Play.js";
import MoveAction from "./Action.js";
import PlantAction from "./Action.js";
import Plant, { internalPlantTypeCompiler } from "../prefabs/Plant.js";
import { allPlantDefs } from "../prefabs/plantDef.js";

export default class Player extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, texture, frame) {
		let gridPoint = scene.grid.getPoint(x, y);
		super(scene, gridPoint[0], gridPoint[1], texture, frame);
		this.gridX = x;
		this.gridY = y;
		this.moving = false;
		this.removingPlantAlready = false;
		this.plantInventory = {};
		this.growthThreePlants = 0;
		this.keys = this.scene.input.keyboard.addKeys(
			"W, A, S, D, Q, E, R, T, ONE, TWO, THREE, FOUR"
		);
		scene.add.existing(this);
	}

	copyInventory() {
		let inventoryData = {};
		for (let key in this.plantInventory) {
			inventoryData[key] = this.plantInventory[key];
		}
		return inventoryData;
	}

	saveData() {
		return {
			x: this.gridX,
			y: this.gridY,
			inventory: this.plantInventory,
			growthThreePlants: this.growthThreePlants,
		};
	}

	loadData(data) {
		this.gridX = data.x ?? this.gridX;
		this.gridY = data.y ?? this.gridY;
		this.plantInventory = data.inventory ?? this.plantInventory;
		this.growthThreePlants = data.growthThreePlants ?? this.growthThreePlants;
		let gridPoint = this.scene.grid.getPoint(this.gridX, this.gridY);
		[this.x, this.y] = gridPoint;
	}

	tweenToPoint(x, y) {
		this.scene.tweens.add({
			targets: this,
			x: x,
			y: y,
			duration: 175,
			ease: "Power1",
			onComplete: () => {
				this.moving = false;
			},
		});
	}

	moveCharacter(dX, dY, undo = false) {
		if (undo) {
			dX = dX * -1;
			dY = dY * -1;
		}
		if (this.moving) {
			return;
		}
		if (!this.scene.grid.pointInBounds(this.gridX + dX, this.gridY + dY)) {
			return;
		}
		this.moving = true;
		let newPoint = this.scene.grid.getPoint(
			this.gridX + dX,
			this.gridY + dY
		);
		this.tweenToPoint(newPoint[0], newPoint[1]);
		if (!undo)
			this.scene.events.emit(ACTION, { action: new MoveAction(dX, dY) });
		this.gridY += dY;
		this.gridX += dX;
	}

	update() {
		if (KEYBOARD.JustDown(this.keys.W) || this.scene.wProc) {
			this.moveCharacter(0, -1);
			this.scene.wProc = false;
		} else if (KEYBOARD.JustDown(this.keys.A) || this.scene.aProc) {
			this.moveCharacter(-1, 0);
			this.scene.aProc = false;
		} else if (KEYBOARD.JustDown(this.keys.S) || this.scene.sProc) {
			this.moveCharacter(0, 1);
			this.scene.sProc = false;
		} else if (KEYBOARD.JustDown(this.keys.D) || this.scene.dProc) {
			this.moveCharacter(1, 0);
			this.scene.dProc = false;
		}

		if (KEYBOARD.JustDown(this.keys.R) || this.scene.rProc) {
			let plant = this.scene.grid.getPlant(this.gridX, this.gridY);
			this.scene.rProc = false;
			if (plant) {
				alert(plant.rules);
			} else {
				alert(controls);
			}
		}

		if (KEYBOARD.JustDown(this.keys.E) || this.scene.eProc) {
			let info = this.scene.grid.getCellInfo(this.gridX, this.gridY);
			this.scene.eProc = false;
			alert(info);
		}
		if (!this.removingPlantAlready && (KEYBOARD.JustDown(this.keys.Q) || this.scene.qProc)) {
			this.scene.qProc = false;
			this.scene.events.emit(ACTION, {
				action: new PlantAction(this.copyInventory(), this.scene.grid),
			});
			this.scene.events.emit(REFRESH_REDO);
			this.removingPlantAlready = true;
			let plant = this.scene.grid.removePlant(this.gridX, this.gridY);
			if (!plant) {
				return;
			}
			if (plant[1] == 3) {
				this.growthThreePlants += 1;
				if (this.growthThreePlants == 5) {
					alert("You collected 5 level 3 plants! You win!");
				}
			}
			this.plantInventory[plant] = (this.plantInventory[plant] || 0) + 1;
		} else if (this.removingPlantAlready && this.keys.Q.isUp) {
			this.removingPlantAlready = false;
		}

		// gotta refactor this later
		if (KEYBOARD.JustDown(this.keys.ONE) || this.scene.oneProc) {
			this.scene.oneProc = false;
			this.scene.events.emit(ACTION, {
				action: new PlantAction(this.copyInventory(), this.scene.grid),
			});
			this.scene.events.emit(REFRESH_REDO);
			this.scene.grid.addPlant(
				new Plant(this.scene, this.gridX, this.gridY, internalPlantTypeCompiler(allPlantDefs[0]))
			);
		}
		if (KEYBOARD.JustDown(this.keys.TWO) || this.scene.twoProc) {
			this.scene.twoProc = false;
			this.scene.events.emit(ACTION, {
				action: new PlantAction(this.copyInventory(), this.scene.grid),
			});
			this.scene.events.emit(REFRESH_REDO);
			this.scene.grid.addPlant(
				new Plant(this.scene, this.gridX, this.gridY, internalPlantTypeCompiler(allPlantDefs[1]))
			);
		}
		if (KEYBOARD.JustDown(this.keys.THREE) || this.scene.threeProc) {
			this.scene.threeProc = false;
			this.scene.events.emit(ACTION, {
				action: new PlantAction(this.copyInventory(), this.scene.grid),
			});
			this.scene.events.emit(REFRESH_REDO);
			this.scene.grid.addPlant(
				new Plant(this.scene, this.gridX, this.gridY, internalPlantTypeCompiler(allPlantDefs[2]))
			);
		}

		if (KEYBOARD.JustDown(this.keys.FOUR) || this.scene.fourProc) {
			this.scene.fourProc = false;
			this.scene.events.emit(ACTION, {
				action: new PlantAction(this.copyInventory(), this.scene.grid),
			});
			this.scene.events.emit(REFRESH_REDO);
			this.scene.grid.addPlant(
				new Plant(this.scene, this.gridX, this.gridY, internalPlantTypeCompiler(allPlantDefs[3]))
			);
		}
	}
}
